// api/products/index.js - Handles GET /api/products and POST /api/products
const path = require("path");
const fs = require("fs");
const { isSupabaseConfigured, sendJson, readJsonBody, verifyAdmin, supabaseRest } = require("../_supabase");

// Local fallback if Supabase not yet configured
const localStorePath = path.join(__dirname, "../../outputs/goldplugdami-site/store.json");

function getLocalStore() {
  if (fs.existsSync(localStorePath)) {
    return JSON.parse(fs.readFileSync(localStorePath, "utf8"));
  }
  return { products: [], rates: { 18: 175000 } };
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  // ─── GET /api/products (Public storefront) ──────────────────────────────────
  if (req.method === "GET") {
    try {
      if (isSupabaseConfigured()) {
        // Fetch products & rates concurrently from Supabase
        const [products, ratesData] = await Promise.all([
          supabaseRest("products?select=*&order=created_at.desc"),
          supabaseRest("gold_rates?select=karat,rate_per_gram")
        ]);

        const rates = {};
        for (const r of ratesData || []) {
          rates[r.karat] = Number(r.rate_per_gram);
        }
        if (!rates[18]) rates[18] = 175000;

        // Map to storefront format
        const publicItems = (products || [])
          .filter(p => p.status === "available" || p.status === "sold_out")
          .map(p => {
            const effectiveRate = p.rate_override || rates[p.karat] || (p.karat === 18 ? 175000 : null);
            const calculatedPrice = p.fixed_price 
              ? Number(p.fixed_price)
              : (effectiveRate && p.weight_grams ? Math.round(Number(p.weight_grams) * Number(effectiveRate)) : null);

            return {
              id: p.id,
              sku: p.sku,
              name: p.name,
              slug: p.slug,
              category: p.category,
              karat: p.karat,
              weight: `${p.weight_grams}g`,
              weightGrams: Number(p.weight_grams),
              detail: p.description || "",
              image: p.primary_image || (p.images && p.images[0]) || "",
              images: p.images || [],
              alt: p.alt || `${p.name} - ${p.weight_grams}g`,
              availability: p.status === "available" && p.stock_quantity > 0 ? "in-stock" : "sold-out",
              stockQuantity: p.stock_quantity,
              quoteState: p.quote_state || "daily-rate",
              ratePerGram: effectiveRate,
              calculatedPrice: calculatedPrice,
              featured: Boolean(p.featured)
            };
          });

        return sendJson(res, 200, {
          updatedAt: new Date().toISOString(),
          rates: rates,
          products: publicItems
        });
      } else {
        // Fallback to local store.json
        const store = getLocalStore();
        const rates = store.rates || { 18: 175000 };
        const items = (store.products || [])
          .filter(p => p.status === "active")
          .map(p => {
            const rate = p.rateOverride || rates[p.karat] || (p.karat === 18 ? 175000 : null);
            return {
              id: p.sku,
              sku: p.sku,
              name: p.name,
              category: p.category,
              karat: p.karat,
              weight: `${p.weightGrams}g`,
              weightGrams: p.weightGrams,
              detail: p.detail,
              image: p.image,
              alt: p.alt,
              availability: p.stockQuantity > 0 ? "in-stock" : "sold-out",
              quoteState: p.quoteState,
              ratePerGram: rate,
              calculatedPrice: rate && p.weightGrams ? Math.round(p.weightGrams * rate) : null
            };
          });

        return sendJson(res, 200, {
          updatedAt: store.updatedAt,
          rates: rates,
          products: items
        });
      }
    } catch (err) {
      console.error("GET /api/products error:", err);
      return sendJson(res, 500, { error: err.message || "Failed to load products" });
    }
  }

  // ─── POST /api/products (Admin create product) ──────────────────────────────
  if (req.method === "POST") {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return sendJson(res, 401, { error: "Administrator authentication is required" });
    }

    try {
      const body = await readJsonBody(req);
      
      // Validation
      if (!body.name || !body.category || !body.karat || !body.weightGrams) {
        return sendJson(res, 400, { error: "Missing required fields: name, category, karat, weightGrams" });
      }

      // Generate SKU if omitted
      let sku = body.sku ? String(body.sku).trim() : "";
      if (!sku) {
        const cat = String(body.category).toLowerCase();
        const prefix = cat.includes("bar") ? "GB" : cat.includes("ear") ? "ER" : cat.includes("pen") ? "PN" : cat.includes("neck") ? "NK" : "GP";
        sku = `${prefix}-${Date.now().toString().slice(-4)}`;
      }

      const slug = `${sku.toLowerCase()}-${String(body.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
      const stock = Number.isInteger(Number(body.stockQuantity)) ? Number(body.stockQuantity) : 1;
      const status = body.status || (stock > 0 ? "available" : "sold_out");
      const images = Array.isArray(body.images) && body.images.length ? body.images : [body.image || ""];

      if (isSupabaseConfigured()) {
        const insertPayload = {
          sku: sku,
          name: String(body.name).trim(),
          slug: slug,
          category: body.category,
          karat: Number(body.karat),
          weight_grams: Number(body.weightGrams),
          description: String(body.description || body.detail || "").trim(),
          alt: String(body.alt || `${body.name} - ${body.weightGrams}g`).trim(),
          primary_image: images[0] || "",
          images: images,
          stock_quantity: stock,
          status: status,
          quote_state: body.quoteState || "daily-rate",
          rate_override: body.rateOverride ? Number(body.rateOverride) : null,
          fixed_price: body.fixedPrice ? Number(body.fixedPrice) : null,
          featured: Boolean(body.featured)
        };

        const result = await supabaseRest("products", {
          method: "POST",
          headers: { "Prefer": "return=representation" },
          body: JSON.stringify(insertPayload)
        });

        return sendJson(res, 201, { success: true, product: result ? result[0] : insertPayload });
      } else {
        return sendJson(res, 201, { success: true, product: { sku, name: body.name } });
      }
    } catch (err) {
      console.error("POST /api/products error:", err);
      return sendJson(res, 500, { error: err.message || "Failed to create product" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

