// api/admin/inventory/[id].js - Handles quick inventory & stock adjustments
const { isSupabaseConfigured, sendJson, readJsonBody, verifyAdmin, supabaseRest } = require("../../_supabase");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  if (req.method !== "PATCH") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const admin = await verifyAdmin(req);
  if (!admin) {
    return sendJson(res, 401, { error: "Administrator authentication is required" });
  }

  const idOrSku = req.query?.id || req.url.split("?")[0].split("/").filter(Boolean).pop();
  if (!idOrSku) {
    return sendJson(res, 400, { error: "Product ID or SKU is required" });
  }

  try {
    const body = await readJsonBody(req);
    const { stockQuantity, status, stockDelta } = body;

    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSku);
      const filter = isUuid ? `id=eq.${idOrSku}` : `sku=eq.${idOrSku}`;

      // Fetch current product
      const currentProds = await supabaseRest(`products?${filter}&select=id,sku,stock_quantity,status`);
      if (!currentProds || currentProds.length === 0) {
        return sendJson(res, 404, { error: "Product not found" });
      }

      const current = currentProds[0];
      let newStock = current.stock_quantity;

      if (typeof stockQuantity === "number") {
        newStock = Math.max(0, Math.floor(stockQuantity));
      } else if (typeof stockDelta === "number") {
        newStock = Math.max(0, current.stock_quantity + Math.floor(stockDelta));
      }

      let newStatus = status || current.status;
      if (newStock === 0 && newStatus === "available") {
        newStatus = "sold_out";
      } else if (newStock > 0 && newStatus === "sold_out") {
        newStatus = "available";
      }

      const updated = await supabaseRest(`products?${filter}`, {
        method: "PATCH",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify({
          stock_quantity: newStock,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
      });

      return sendJson(res, 200, {
        success: true,
        product: updated ? updated[0] : null
      });
    } else {
      return sendJson(res, 200, { success: true, updated: idOrSku });
    }
  } catch (err) {
    console.error("Inventory update error:", err);
    return sendJson(res, 500, { error: err.message });
  }
};

