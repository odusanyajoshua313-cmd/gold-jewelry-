// api/products/[id].js - Handles GET, PATCH, DELETE for a specific product
const { isSupabaseConfigured, sendJson, readJsonBody, verifyAdmin, supabaseRest } = require("../_supabase");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  // Extract id / sku from URL or query
  const idOrSku = req.query?.id || req.url.split("?")[0].split("/").filter(Boolean).pop();

  if (!idOrSku) {
    return sendJson(res, 400, { error: "Product ID or SKU is required" });
  }

  // ─── GET /api/products/:id ──────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      if (!isSupabaseConfigured()) {
        return sendJson(res, 501, { error: "Supabase not configured" });
      }

      // Check by UUID or SKU
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSku);
      const query = isUuid ? `products?id=eq.${idOrSku}` : `products?sku=eq.${idOrSku}`;
      const products = await supabaseRest(query);

      if (!products || products.length === 0) {
        return sendJson(res, 404, { error: "Product not found" });
      }

      return sendJson(res, 200, { product: products[0] });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // ─── PATCH /api/products/:id (Admin update) ─────────────────────────────────
  if (req.method === "PATCH") {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return sendJson(res, 401, { error: "Administrator authentication is required" });
    }

    try {
      const body = await readJsonBody(req);
      if (!isSupabaseConfigured()) {
        return sendJson(res, 501, { error: "Supabase not configured" });
      }

      const updateData = {};
      if (body.name !== undefined) updateData.name = String(body.name).trim();
      if (body.category !== undefined) updateData.category = body.category;
      if (body.karat !== undefined) updateData.karat = Number(body.karat);
      if (body.weightGrams !== undefined) updateData.weight_grams = Number(body.weightGrams);
      if (body.weight_grams !== undefined) updateData.weight_grams = Number(body.weight_grams);
      if (body.description !== undefined) updateData.description = String(body.description).trim();
      if (body.detail !== undefined) updateData.description = String(body.detail).trim();
      if (body.stockQuantity !== undefined) updateData.stock_quantity = Number(body.stockQuantity);
      if (body.stock_quantity !== undefined) updateData.stock_quantity = Number(body.stock_quantity);
      if (body.status !== undefined) updateData.status = body.status;
      if (body.quoteState !== undefined) updateData.quote_state = body.quoteState;
      if (body.rateOverride !== undefined) updateData.rate_override = body.rateOverride ? Number(body.rateOverride) : null;
      if (body.fixedPrice !== undefined) updateData.fixed_price = body.fixedPrice ? Number(body.fixedPrice) : null;
      if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
      if (body.images !== undefined) {
        updateData.images = Array.isArray(body.images) ? body.images : [body.images];
        updateData.primary_image = updateData.images[0] || "";
      }
      if (body.image !== undefined && !updateData.images) {
        updateData.primary_image = body.image;
        updateData.images = [body.image];
      }

      updateData.updated_at = new Date().toISOString();

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSku);
      const filter = isUuid ? `id=eq.${idOrSku}` : `sku=eq.${idOrSku}`;

      const updated = await supabaseRest(`products?${filter}`, {
        method: "PATCH",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(updateData)
      });

      return sendJson(res, 200, { success: true, product: updated ? updated[0] : null });
    } catch (err) {
      console.error("PATCH product error:", err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // ─── DELETE /api/products/:id (Admin delete) ────────────────────────────────
  if (req.method === "DELETE") {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return sendJson(res, 401, { error: "Administrator authentication is required" });
    }

    try {
      if (!isSupabaseConfigured()) {
        return sendJson(res, 501, { error: "Supabase not configured" });
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSku);
      const filter = isUuid ? `id=eq.${idOrSku}` : `sku=eq.${idOrSku}`;

      await supabaseRest(`products?${filter}`, {
        method: "DELETE"
      });

      return sendJson(res, 200, { success: true, deleted: idOrSku });
    } catch (err) {
      console.error("DELETE product error:", err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

