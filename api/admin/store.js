// api/admin/store.js - Aggregates full admin inventory, gold rates, and sales data
const { isSupabaseConfigured, sendJson, verifyAdmin, supabaseRest } = require("../_supabase");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const admin = await verifyAdmin(req);
  if (!admin) {
    return sendJson(res, 401, { error: "Administrator authentication is required" });
  }

  try {
    if (isSupabaseConfigured()) {
      // Fetch products (all statuses including drafts), gold rates, and sales
      const [productsData, ratesData, salesData] = await Promise.all([
        supabaseRest("products?select=*&order=created_at.desc"),
        supabaseRest("gold_rates?select=karat,rate_per_gram&order=karat.asc"),
        supabaseRest("sales?select=*&order=created_at.desc&limit=50")
      ]);

      const rates = {};
      for (const r of ratesData || []) {
        rates[r.karat] = Number(r.rate_per_gram);
      }
      if (!rates[18]) rates[18] = 175000;

      // Transform products for dashboard compatibility
      const products = (productsData || []).map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        category: p.category,
        karat: p.karat,
        weightGrams: Number(p.weight_grams),
        detail: p.description || "",
        image: p.primary_image || (p.images && p.images[0]) || "",
        images: p.images || [],
        alt: p.alt,
        status: p.status === "available" ? "active" : p.status, // Map 'available' to 'active' for admin select
        rawStatus: p.status,
        stockQuantity: p.stock_quantity,
        quoteState: p.quote_state,
        rateOverride: p.rate_override ? Number(p.rate_override) : null,
        fixedPrice: p.fixed_price ? Number(p.fixed_price) : null,
        featured: Boolean(p.featured),
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

      // Transform sales for dashboard compatibility
      const sales = (salesData || []).map(s => ({
        id: s.id,
        sku: s.product_sku,
        productId: s.product_id,
        productName: s.product_name,
        quantity: s.quantity,
        channel: s.sales_channel,
        unitPrice: Number(s.unit_price),
        totalAmount: Number(s.total_amount),
        reference: s.customer_reference || "",
        createdAt: s.created_at
      }));

      return sendJson(res, 200, {
        updatedAt: new Date().toISOString(),
        rates: rates,
        products: products,
        sales: sales
      });
    } else {
      // Local store.json fallback
      const path = require("path");
      const fs = require("fs");
      const p = path.join(__dirname, "../../outputs/goldplugdami-site/store.json");
      const store = JSON.parse(fs.readFileSync(p, "utf8"));
      return sendJson(res, 200, store);
    }
  } catch (err) {
    console.error("GET /api/admin/store error:", err);
    return sendJson(res, 500, { error: err.message || "Failed to load admin data" });
  }
};

