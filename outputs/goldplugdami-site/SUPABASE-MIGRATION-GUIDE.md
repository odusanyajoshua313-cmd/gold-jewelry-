# GOLDPLUGDAMI: SUPABASE MIGRATION & OPERATIONAL MANUAL

This guide details how to activate your **Supabase PostgreSQL & Storage** backend for **Goldplugdami** on **Vercel**, enabling live product, image, and inventory management directly from your phone or laptop without Git commits.

---

## 1. Architecture Overview

```
[Customer / Storefront]               [Owner Phone / Admin]
        │                                      │
        ▼                                      ▼
   index.html                             admin.html
   (app.js)                           (Supabase Auth)
        │                                      │
        ▼                                      ▼
   GET /api/products               POST /api/admin/*
   (Vercel Edge Functions)         (Protected by JWT / Admin Token)
        │                                      │
        ├──────────────────────────────────────┘
        ▼
   ┌─────────────────────────────────────────────────────────┐
   │                    SUPABASE CLOUD                       │
   │  • PostgreSQL: `products`, `sales`, `gold_rates`        │
   │  • Storage: `product-images` bucket (CDN images)        │
   │  • Auth: Administrator accounts & Row-Level Security    │
   └─────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables Configuration

In **Vercel Dashboard** → **Project Settings** → **Environment Variables**, add:

| Variable Name | Environment | Description | Example / Value |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Your Supabase project URL | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Supabase public anonymous key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Production & Preview (Secret) | Supabase secret key (Server-only) | `eyJhbGciOi...` *(Never expose in frontend)* |
| `ADMIN_TOKEN` | Production & Preview (Secret) | Fallback emergency admin token | `your-secure-admin-token` |

---

## 3. Step-by-Step Supabase Setup

### Step 3.1: Create Your Supabase Project
1. Log in to [supabase.com](https://supabase.com) and click **New project**.
2. Name it **`goldplugdami`**, choose your region (e.g. London / EU or closest to Nigeria), and generate a secure database password.
3. Once provisioned, go to **Settings** → **API** to copy:
   - **Project URL**
   - **Project API keys** (`anon` public and `service_role` secret)

### Step 3.2: Run the Database Schema
1. In the Supabase Dashboard, click the **SQL Editor** tab on the left.
2. Open `outputs/goldplugdami-site/supabase-schema.sql` in your project.
3. Paste the entire SQL script into the Supabase SQL editor and click **Run**.
4. This automatically creates:
   - Tables: `products`, `sales`, `gold_rates`, `admin_profiles`
   - Indexes and constraints
   - Atomic stored procedure `record_sale()` (prevents overselling)
   - Storage bucket `product-images` with public read and authenticated write access
   - Row-Level Security (RLS) policies

### Step 3.3: Create Your Administrator User
1. Go to Supabase Dashboard → **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Enter your email (e.g. `admin@goldplugdami.com`) and choose a strong password. Toggle "Auto Confirm Email" to **ON**.
4. Link this user into `admin_profiles` by running this quick SQL query in the **SQL Editor**:
   ```sql
   INSERT INTO public.admin_profiles (id, email, role)
   SELECT id, email, 'admin'
   FROM auth.users
   WHERE email = 'admin@goldplugdami.com'
   ON CONFLICT (id) DO NOTHING;
   ```

---

## 4. Run the Data Migration

A migration script `outputs/goldplugdami-site/migrate-to-supabase.cjs` and pre-generated SQL seed `outputs/goldplugdami-site/supabase-seed-data.sql` have been prepared.

### Option A: Via SQL Editor (Easiest)
1. Open `outputs/goldplugdami-site/supabase-seed-data.sql`.
2. Copy and paste into the Supabase **SQL Editor** and click **Run**.
3. All 13 existing products and gold rates will populate into the database immediately.

### Option B: Via Node.js Script (Uploads Assets to Storage automatically)
In PowerShell:
```powershell
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
node outputs/goldplugdami-site/migrate-to-supabase.cjs
```
This uploads all local photo assets directly to the Supabase `product-images` storage bucket and maps their public URLs in PostgreSQL.

---

## 5. How to Manage Products From Your Phone / Computer

1. Open **`https://your-domain.vercel.app/admin.html`** (or `http://127.0.0.1:4173/admin.html` locally).
2. **Sign In**:
   - Choose **Supabase Auth** tab: Enter your email and password.
   - Or choose **Admin Token** tab: Enter your `ADMIN_TOKEN` secret.
3. **To Add a Product**:
   - Fill in: Product Name, Category, Karat (18K, 21K, 22K, 24K), and Weight in grams.
   - Tap **Click to upload product photo** to take a picture on your phone or choose from gallery. The photo uploads directly to Supabase Storage.
   - Click **Add Product to Inventory**.
4. **To Adjust Stock or Mark Sold Out**:
   - In the **Inventory & Stock Management** table, change the stock quantity number or change the status dropdown to `Sold Out` or `Active`.
   - Click **Save**.
5. **To Record a Sale (WhatsApp / Walk-in / Delivery)**:
   - Select the piece in the **Record a Sale** dropdown.
   - Select quantity and channel (`WhatsApp`, `walk-in`, `delivery`).
   - Click **Confirm & Deduct Stock**. The stock is automatically deducted in the database; if stock reaches 0, it is automatically marked as sold out.
6. **To Update Daily Gold Rates**:
   - In the **Daily Gold Rates** panel, enter today's ₦/gram rate for 18K, 21K, 22K, or 24K.
   - Click **Update Rates**. All product prices on the storefront recalculate instantly.

