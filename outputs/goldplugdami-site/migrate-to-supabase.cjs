/**
 * GOLDPLUGDAMI — SUPABASE DATA MIGRATION SCRIPT
 *
 * Migrates existing inventory and gold rates from store.json into Supabase PostgreSQL
 * and uploads product photos to the Supabase Storage bucket 'product-images'.
 *
 * Usage:
 *   node migrate-to-supabase.cjs
 *
 * Requires environment variables:
 *   SUPABASE_URL (e.g. https://xyzcompany.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY (service role secret for administrative setup)
 */

const fs = require("fs");
const path = require("path");

const root = __dirname;
const storePath = path.join(root, "store.json");
const backupPath = path.join(root, "store.backup.json");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function runMigration() {
  console.log("=================================================");
  console.log("  GOLDPLUGDAMI: STORE.JSON -> SUPABASE MIGRATION ");
  console.log("=================================================\n");

  if (!fs.existsSync(storePath)) {
    console.error("❌ Error: store.json not found at", storePath);
    process.exit(1);
  }

  // Ensure backup is present
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(storePath, backupPath);
    console.log("✓ Created safety backup: store.backup.json");
  } else {
    console.log("✓ Safety backup verified: store.backup.json");
  }

  const rawStore = fs.readFileSync(storePath, "utf8");
  const store = JSON.parse(rawStore);
  const products = store.products || [];
  const rates = store.rates || { 18: 175000 };

  console.log(`Found ${products.length} products and daily rates in store.json.\n`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("ℹ️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.");
    console.log("    To execute live migration to your Supabase project, run:");
    console.log('    $env:SUPABASE_URL = "https://your-project.supabase.co"');
    console.log('    $env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"');
    console.log("    node migrate-to-supabase.cjs\n");
    console.log("Generating dry-run SQL / payload inspection...");
  }

  // Transform products into Supabase schema format
  const transformedProducts = products.map((p, idx) => {
    const slug = slugify(`${p.name}-${p.sku}`);
    const status = p.status === "active" 
      ? (p.stockQuantity > 0 ? "available" : "sold_out")
      : "draft";

    const imagePath = p.image || "";
    // If Supabase Storage is configured, this maps to public CDN URL
    const publicUrl = SUPABASE_URL && !imagePath.startsWith("http")
      ? `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/product-images/${path.basename(imagePath)}`
      : imagePath;

    return {
      sku: p.sku,
      name: p.name,
      slug: slug,
      category: p.category,
      karat: Number(p.karat),
      weight_grams: Number(p.weightGrams),
      description: p.detail || "",
      alt: p.alt || `${p.name} - ${p.weightGrams}g`,
      primary_image: publicUrl,
      images: [publicUrl],
      stock_quantity: Number(p.stockQuantity ?? 1),
      status: status,
      quote_state: p.quoteState || "daily-rate",
      rate_override: p.rateOverride ? Number(p.rateOverride) : null,
      featured: idx < 4, // Feature the top 4 items by default
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString()
    };
  });

  // Prepare SQL INSERT script as an easy alternative to running direct SDK calls
  let sqlDump = `-- Auto-generated migration from store.json (${new Date().toISOString()})\n\n`;
  
  // Daily rates SQL
  sqlDump += `-- 1. Gold Rates\n`;
  for (const [karat, rate] of Object.entries(rates)) {
    sqlDump += `INSERT INTO public.gold_rates (karat, rate_per_gram, updated_at) VALUES (${karat}, ${rate}, now()) ON CONFLICT (karat) DO UPDATE SET rate_per_gram = EXCLUDED.rate_per_gram, updated_at = now();\n`;
  }
  sqlDump += `\n-- 2. Products (${transformedProducts.length} items)\n`;

  for (const p of transformedProducts) {
    const imgArray = `ARRAY['${p.images.join("','")}']`;
    const rateOverrideVal = p.rate_override ? p.rate_override : "NULL";
    const escName = p.name.replace(/'/g, "''");
    const escDesc = p.description.replace(/'/g, "''");
    const escAlt = p.alt.replace(/'/g, "''");

    sqlDump += `INSERT INTO public.products (
  sku, name, slug, category, karat, weight_grams, description, alt, primary_image, images, stock_quantity, status, quote_state, rate_override, featured, created_at, updated_at
) VALUES (
  '${p.sku}', '${escName}', '${p.slug}', '${p.category}', ${p.karat}, ${p.weight_grams}, '${escDesc}', '${escAlt}', '${p.primary_image}', ${imgArray}, ${p.stock_quantity}, '${p.status}', '${p.quote_state}', ${rateOverrideVal}, ${p.featured}, '${p.created_at}', '${p.updated_at}'
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
  updated_at = EXCLUDED.updated_at;\n\n`;
  }

  const sqlPath = path.join(root, "supabase-seed-data.sql");
  fs.writeFileSync(sqlPath, sqlDump, "utf8");
  console.log(`✓ Generated SQL seed file: ${sqlPath}`);
  console.log(`  (You can also paste this directly into Supabase SQL Editor)\n`);

  // If live credentials provided, execute via Supabase REST API
  if (SUPABASE_URL && SUPABASE_KEY) {
    console.log("Connecting to Supabase at", SUPABASE_URL);
    try {
      // 1. Upload assets to Storage
      console.log("Checking storage bucket 'product-images'...");
      const assetsDir = path.join(root, "assets");
      const assetFiles = fs.readdirSync(assetsDir);
      
      for (const file of assetFiles) {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
        const filePath = path.join(assetsDir, file);
        const fileData = fs.readFileSync(filePath);
        const mime = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";

        const uploadUrl = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/product-images/${file}`;
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": mime,
            "x-upsert": "true"
          },
          body: fileData
        });
        if (res.ok) {
          console.log(`  ✓ Uploaded image: ${file}`);
        } else {
          const errText = await res.text();
          console.log(`  ⚠️ Storage note for ${file}: ${res.statusText}`);
        }
      }

      // 2. Insert Rates
      for (const [k, r] of Object.entries(rates)) {
        await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/gold_rates`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
          },
          body: JSON.stringify({ karat: Number(k), rate_per_gram: Number(r), updated_at: new Date().toISOString() })
        });
      }
      console.log("✓ Live gold rates synced to Supabase");

      // 3. Upsert Products
      const prodRes = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "apikey": SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(transformedProducts)
      });

      if (!prodRes.ok) {
        throw new Error(`Failed to insert products: ${await prodRes.text()}`);
      }

      console.log(`✓ Successfully migrated ${transformedProducts.length} products to Supabase!`);
    } catch (err) {
      console.error("❌ Live API error:", err.message);
      console.log("You can run the generated supabase-seed-data.sql in the Supabase SQL editor directly.");
    }
  }

  console.log("\n=================================================");
  console.log("  MIGRATION PREPARATION COMPLETE");
  console.log("=================================================");
}

runMigration().catch(err => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});

