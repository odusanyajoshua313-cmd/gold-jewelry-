// api/admin/rates.js - Handles GET and PUT for daily gold rates
const { isSupabaseConfigured, sendJson, readJsonBody, verifyAdmin, supabaseRest } = require("../_supabase");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  // ─── GET /api/admin/rates ───────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      if (isSupabaseConfigured()) {
        const rates = await supabaseRest("gold_rates?select=karat,rate_per_gram,updated_at&order=karat.asc");
        const rateMap = {};
        for (const r of rates || []) {
          rateMap[r.karat] = Number(r.rate_per_gram);
        }
        return sendJson(res, 200, { rates: rateMap });
      } else {
        return sendJson(res, 200, { rates: { 18: 175000 } });
      }
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // ─── PUT /api/admin/rates (Admin update daily rates) ────────────────────────
  if (req.method === "PUT") {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return sendJson(res, 401, { error: "Administrator authentication is required" });
    }

    try {
      const body = await readJsonBody(req);
      if (isSupabaseConfigured()) {
        const promises = [];
        for (const [karatStr, rateVal] of Object.entries(body)) {
          const karat = Number(karatStr);
          const rate = Number(rateVal);
          if (![18, 21, 22, 24].includes(karat) || isNaN(rate) || rate <= 0) continue;

          promises.push(
            supabaseRest("gold_rates", {
              method: "POST",
              headers: { "Prefer": "resolution=merge-duplicates" },
              body: JSON.stringify({
                karat: karat,
                rate_per_gram: rate,
                updated_at: new Date().toISOString()
              })
            })
          );
        }
        await Promise.all(promises);

        // Fetch back updated rates
        const refreshed = await supabaseRest("gold_rates?select=karat,rate_per_gram");
        const rateMap = {};
        for (const r of refreshed || []) {
          rateMap[r.karat] = Number(r.rate_per_gram);
        }
        return sendJson(res, 200, { success: true, rates: rateMap });
      } else {
        return sendJson(res, 200, { success: true, rates: body });
      }
    } catch (err) {
      console.error("PUT /api/admin/rates error:", err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};

