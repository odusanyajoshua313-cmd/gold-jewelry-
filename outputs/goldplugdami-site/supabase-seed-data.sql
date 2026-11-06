-- Auto-generated migration from store.json (2026-11-06T14:16:55.843Z)

-- 1. Gold Rates
INSERT INTO public.gold_rates (karat, rate_per_gram, updated_at) VALUES (18, 175000, now()) ON CONFLICT (karat) DO UPDATE SET rate_per_gram = EXCLUDED.rate_per_gram, updated_at = now();

-- 2. Products (13 items)
INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'ER-02', '18 Karat Gold Earring', '18-karat-gold-earring-er-02', 'earrings', 18, 2.5, 'Classic round hoop', 'Pair of 18 Karat gold hoop earrings; scale reads 2.5 grams', 'assets/earrings-hoops-2-5g.jpeg', ARRAY['assets/earrings-hoops-2-5g.jpeg'], 1, 'available', 'daily-rate', NULL, true, '2026-10-22T00:00:00.000Z', '2026-10-22T17:04:27.170Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'ER-05', '18 Karat Gold Earring', '18-karat-gold-earring-er-05', 'earrings', 18, 2.1, 'Stud earring', 'Pair of 18 Karat gold stud earrings; scale reads 2.1 grams', 'assets/earrings-stud-2-1g.jpeg', ARRAY['assets/earrings-stud-2-1g.jpeg'], 1, 'available', 'daily-rate', NULL, true, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'ER-08', '18 Karat Gold Earring', '18-karat-gold-earring-er-08', 'earrings', 18, 1.5, 'Sculptural form', '18 Karat sculptural gold earring; scale reads 1.5 grams', 'assets/earrings-sculptural-1-5g.jpeg', ARRAY['assets/earrings-sculptural-1-5g.jpeg'], 1, 'available', 'daily-rate', NULL, true, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'ER-12', '18 Karat Gold Earring', '18-karat-gold-earring-er-12', 'earrings', 18, 2.6, 'Patterned round hoop', 'Pair of 18 Karat patterned gold hoop earrings; scale reads 2.6 grams', 'assets/earrings-pattern-hoops-2-6g.jpeg', ARRAY['assets/earrings-pattern-hoops-2-6g.jpeg'], 1, 'available', 'daily-rate', NULL, true, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'NK-01', '18 Karat Twist Gold Necklace', '18-karat-twist-gold-necklace-nk-01', 'necklaces', 18, 23.1, 'Twist design', '18 Karat twist gold necklace; scale reads 23.1 grams', 'assets/twist-necklace-23-1g.jpg', ARRAY['assets/twist-necklace-23-1g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'NK-02', '18 Karat Twist Gold Necklace', '18-karat-twist-gold-necklace-nk-02', 'necklaces', 18, 22.9, 'Twist design', 'Separate 18 Karat twist gold necklace; scale reads 22.9 grams', 'assets/twist-necklace-22-9g.jpg', ARRAY['assets/twist-necklace-22-9g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'NK-FR-01', '18 Karat Franco Gold Necklace', '18-karat-franco-gold-necklace-nk-fr-01', 'necklaces', 18, 2.3, 'Franco design - no pendant', '18 Karat Franco gold necklace without a pendant; scale reads 2.3 grams', 'assets/franco-necklace-2-3g.jpg', ARRAY['assets/franco-necklace-2-3g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'NK-FR-02', '18 Karat Franco Gold Necklace', '18-karat-franco-gold-necklace-nk-fr-02', 'necklaces', 18, 5, 'Franco design - no pendant', 'Separate 18 Karat Franco gold necklace without a pendant; scale reads 5 grams', 'assets/franco-necklace-5g.jpg', ARRAY['assets/franco-necklace-5g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'PD-AN-01', '18 Karat Anchor Pendant', '18-karat-anchor-pendant-pd-an-01', 'pendants', 18, 8.5, 'Anchor design', '18 Karat gold anchor pendant on a scale showing 8.5 grams', 'assets/pendant-anchor-8-5g.jpg', ARRAY['assets/pendant-anchor-8-5g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'PD-BT-01', '18 Karat Bitcoin Pendant', '18-karat-bitcoin-pendant-pd-bt-01', 'pendants', 18, 7.2, 'Bitcoin design', '18 Karat gold Bitcoin pendant on a scale showing 7.2 grams', 'assets/pendant-bitcoin-7-2g.jpg', ARRAY['assets/pendant-bitcoin-7-2g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'PD-JP-01', '18 Karat Jesus Piece Pendant', '18-karat-jesus-piece-pendant-pd-jp-01', 'pendants', 18, 2.1, 'Jesus piece design', '18 Karat gold Jesus Piece pendant on a scale showing 2.1 grams', 'assets/pendant-jesus-piece-2-1g.jpg', ARRAY['assets/pendant-jesus-piece-2-1g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'PD-PH-01', '18 Karat Pharaoh Pendant', '18-karat-pharaoh-pendant-pd-ph-01', 'pendants', 18, 9.3, 'Pharaoh design', '18 Karat gold Pharaoh pendant on a scale showing 9.3 grams', 'assets/pendant-pharaoh-9-3g.jpg', ARRAY['assets/pendant-pharaoh-9-3g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T00:00:00.000Z', '2026-10-22T00:00:00.000Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  'GB-01', '24 Karat Gold bar', '24-karat-gold-bar-gb-01', 'gold-bars', 24, 2.5, '2.5g Fine Gold 999.9 Bullion with security assay card', '24 Karat 2.5 grams 999.9 fine gold bar in tamper-evident security certicard', 'assets/gold-bar-2-5g.jpg', ARRAY['assets/gold-bar-2-5g.jpg'], 1, 'available', 'daily-rate', NULL, false, '2026-10-22T16:28:11.647Z', '2026-11-03T13:43:57.135Z'
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  karat = EXCLUDED.karat,
  weight_grams = EXCLUDED.weight_grams,
  description = EXCLUDED.description,
  alt = EXCLUDED.alt,
  primary_image = EXCLUDED.primary_image,
  images = EXCLUDED.images,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

