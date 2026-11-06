-- ==============================================================================
-- GOLDPLUGDAMI — SUPABASE DATABASE ARCHITECTURE & SCHEMA
-- Compatible with PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- Admin Profiles (links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Daily Gold Rates (₦ / gram)
CREATE TABLE IF NOT EXISTS public.gold_rates (
    karat SMALLINT PRIMARY KEY CHECK (karat IN (18, 21, 22, 24)),
    rate_per_gram NUMERIC(12, 2) NOT NULL CHECK (rate_per_gram > 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial standard daily gold rate
INSERT INTO public.gold_rates (karat, rate_per_gram)
VALUES (18, 175000.00), (21, 204000.00), (22, 214000.00), (24, 233000.00)
ON CONFLICT (karat) DO NOTHING;

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('earrings', 'necklaces', 'pendants', 'gold-bars', 'bracelets', 'rings')),
    karat SMALLINT NOT NULL CHECK (karat IN (18, 21, 22, 24)),
    weight_grams NUMERIC(8, 2) NOT NULL CHECK (weight_grams > 0),
    description TEXT DEFAULT '',
    alt TEXT DEFAULT '',
    images TEXT[] NOT NULL DEFAULT '{}',
    primary_image TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 1 CHECK (stock_quantity >= 0),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'draft')),
    quote_state TEXT NOT NULL DEFAULT 'daily-rate' CHECK (quote_state IN ('daily-rate', 'fixed-price')),
    fixed_price NUMERIC(12, 2) CHECK (fixed_price IS NULL OR fixed_price >= 0),
    rate_override NUMERIC(12, 2) CHECK (rate_override IS NULL OR rate_override > 0),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Sales & Transaction Records Table
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_sku TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    sales_channel TEXT NOT NULL CHECK (sales_channel IN ('WhatsApp', 'walk-in', 'delivery')),
    customer_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_karat ON public.products(karat);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON public.sales(product_id);

-- ==============================================================================
-- 4. TRIGGERS & ATOMIC FUNCTIONS
-- ==============================================================================

-- Auto-update updated_at on product changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Atomic sale recording with row locking and stock deduction
CREATE OR REPLACE FUNCTION public.record_sale(
    p_product_id UUID,
    p_quantity INTEGER,
    p_unit_price NUMERIC,
    p_sales_channel TEXT,
    p_customer_ref TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_prod RECORD;
    v_total NUMERIC;
    v_sale_id UUID;
    v_new_stock INTEGER;
    v_new_status TEXT;
BEGIN
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Sale quantity must be greater than zero';
    END IF;

    -- Lock the product row for update to prevent race conditions
    SELECT id, sku, name, stock_quantity, status
    INTO v_prod
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product with ID % not found', p_product_id;
    END IF;

    IF v_prod.stock_quantity < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock: % available, % requested', v_prod.stock_quantity, p_quantity;
    END IF;

    v_new_stock := v_prod.stock_quantity - p_quantity;
    v_new_status := CASE WHEN v_new_stock = 0 THEN 'sold_out' ELSE v_prod.status END;
    v_total := p_quantity * p_unit_price;

    -- Deduct stock and adjust status if depleted
    UPDATE public.products
    SET stock_quantity = v_new_stock,
        status = v_new_status,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_product_id;

    -- Record transaction
    INSERT INTO public.sales (
        product_id,
        product_sku,
        product_name,
        quantity,
        unit_price,
        total_amount,
        sales_channel,
        customer_reference,
        notes
    ) VALUES (
        p_product_id,
        v_prod.sku,
        v_prod.name,
        p_quantity,
        p_unit_price,
        v_total,
        p_sales_channel,
        p_customer_ref,
        p_notes
    )
    RETURNING id INTO v_sale_id;

    RETURN jsonb_build_object(
        'success', true,
        'sale_id', v_sale_id,
        'product_id', p_product_id,
        'remaining_stock', v_new_stock,
        'status', v_new_status,
        'total_amount', v_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Helper to check if current caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5A. Products Policies
-- Public (anonymous customers) can read published products
CREATE POLICY "Public read available or sold_out products"
ON public.products FOR SELECT
USING (status IN ('available', 'sold_out'));

-- Admins can read all products (including drafts)
CREATE POLICY "Admin full select on products"
ON public.products FOR SELECT
USING (public.is_admin());

-- Only admins can create, update, or delete products
CREATE POLICY "Admin insert products"
ON public.products FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admin update products"
ON public.products FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete products"
ON public.products FOR DELETE
USING (public.is_admin());

-- 5B. Gold Rates Policies
-- Anyone can read current gold rates
CREATE POLICY "Public read gold rates"
ON public.gold_rates FOR SELECT
USING (true);

-- Only admins can update gold rates
CREATE POLICY "Admin modify gold rates"
ON public.gold_rates FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5C. Sales Policies
-- Only authenticated admins can read sales records
CREATE POLICY "Admin select sales"
ON public.sales FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admin insert sales"
ON public.sales FOR INSERT
WITH CHECK (public.is_admin());

-- 5D. Admin Profiles Policies
CREATE POLICY "Admin view profiles"
ON public.admin_profiles FOR SELECT
USING (public.is_admin() OR auth.uid() = id);

-- ==============================================================================
-- 6. STORAGE BUCKET CONFIGURATION (product-images)
-- ==============================================================================

-- Create bucket 'product-images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    15728640, -- 15 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- Storage RLS: Public can view images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Storage RLS: Only admins can upload images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images'
    AND (public.is_admin() OR auth.role() = 'authenticated')
);

-- Storage RLS: Only admins can update or delete images
DROP POLICY IF EXISTS "Admins can modify product images" ON storage.objects;
CREATE POLICY "Admins can modify product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images'
    AND (public.is_admin() OR auth.role() = 'authenticated')
);

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images'
    AND (public.is_admin() OR auth.role() = 'authenticated')
);

