// api/admin/auth/login.js - Supabase Auth Email/Password Login Endpoint
const { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY, sendJson, readJsonBody } = require("../../_supabase");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey"
    }).end();
    return;
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return sendJson(res, 400, { error: "Email and password are required" });
    }

    if (!isSupabaseConfigured()) {
      return sendJson(res, 501, { error: "Supabase is not configured yet. Please use Admin Token login." });
    }

    // Call Supabase Auth endpoint
    const authUrl = `${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token?grant_type=password`;
    const authRes = await fetch(authUrl, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: String(email).trim().toLowerCase(),
        password: String(password)
      })
    });

    if (!authRes.ok) {
      const errData = await authRes.json().catch(() => ({}));
      return sendJson(res, 401, { error: errData.error_description || errData.message || "Invalid email or password" });
    }

    const authData = await authRes.json();
    return sendJson(res, 200, {
      success: true,
      token: authData.access_token,
      user: {
        id: authData.user?.id,
        email: authData.user?.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendJson(res, 500, { error: err.message || "Authentication failed" });
  }
};

