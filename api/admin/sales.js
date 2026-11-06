// api/admin/sales.js - Handles POST /api/admin/sales (Atomic sale & stock deduction) and GET sales history
const { isSupabaseConfigured, sendJson, readJsonBody, verifyAdmin, supabaseRest } = require("../_supabase");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  const admin = await verifyAdmin(req);
  if (!admin) {
    return sendJson(res, 401, { error: "Administrator authentication is required" });
  }

  // ─── GET /api/admin/sales (Transaction history) ─────────────────────────────
  if (req.method === "GET") {
    try {
      if (isSupabaseConfigured()) {
        const sales = await supabaseRest("sales?select=*&order=created_at.desc&limit=100");
        return sendJson(res, 200, { sales: sales || [] });
      } else {
        return sendJson(res, 200, { sales: [] });
      }
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // ─── POST /api/admin/sales (Record sale with atomic stock deduction) ────────
  if (req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const { sku, productId, quantity, unitPrice, salesChannel, customerReference, notes } = body;

      const qty = Number(quantity);
      if (!qty || qty <= 0) {
        return sendJson(res, 400, { error: "Quantity must be a positive number" });
      }

      if (!salesChannel || !["WhatsApp", "walk-in", "delivery"].includes(salesChannel)) {
        return sendJson(res, 400, { error: "Valid salesChannel is required ('WhatsApp', 'walk-in', or 'delivery')" });
      }

      if (isSupabaseConfigured()) {
        // Resolve target product UUID
        let targetId = productId;
        let prodRecord = null;

        if (!targetId && sku) {
          const prods = await supabaseRest(`products?sku=eq.${sku}&select=id,sku,name,stock_quantity,status`);
          if (prods && prods.length > 0) {
            targetId = prods[0].id;
            prodRecord = prods[0];
          }
        } else if (targetId) {
          const prods = await supabaseRest(`products?id=eq.${targetId}&select=id,sku,name,stock_quantity,status`);
          if (prods && prods.length > 0) prodRecord = prods[0];
        }

        if (!targetId || !prodRecord) {
          return sendJson(res, 404, { error: "Product not found" });
        }

        if (prodRecord.stock_quantity < qty) {
          return sendJson(res, 400, {
            error: `Cannot sell ${qty} item(s). Current stock is ${prodRecord.stock_quantity}.`
          });
        }

        // Call the atomic PostgreSQL RPC function 'record_sale'
        // This locks the product row, updates stock & status, and inserts the sale record atomically.
        const rpcResult = await supabaseRest("rpc/record_sale", {
          method: "POST",
          body: JSON.stringify({
            p_product_id: targetId,
            p_quantity: qty,
            p_unit_price: Number(unitPrice) || 0,
            p_sales_channel: salesChannel,
            p_customer_ref: customerReference || null,
            p_notes: notes || null
          })
        });

        return sendJson(res, 201, {
          success: true,
          sale: rpcResult
        });
      } else {
        return sendJson(res, 201, {
          success: true,
          sale: { id: "local-sale", quantity: qty, salesChannel }
        });
      }
    } catch (err) {
      console.error("POST /api/admin/sales error:", err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

