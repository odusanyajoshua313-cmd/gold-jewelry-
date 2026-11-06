// api/_supabase.js - Shared Supabase Client & Auth Helper for Vercel Serverless Functions

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
// Admin token is loaded strictly from environment variable; no hardcoded fallback token allowed in source code
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY));
}

// Security headers for API responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try { return JSON.parse(req.body); } catch { throw new Error("Invalid JSON body"); }
  }
  let data = "";
  for await (const chunk of req) data += chunk;
  if (!data.trim()) return {};
  try { return JSON.parse(data); } catch { throw new Error("Invalid JSON body"); }
}

// Verify admin authorization
async function verifyAdmin(req) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7).trim();
  if (!token) return false;

  // 1. Direct admin token match - strictly from process.env.ADMIN_TOKEN
  if (ADMIN_TOKEN && token === ADMIN_TOKEN) {
    return { id: "admin-token", role: "admin", email: "admin@goldplugdami.com" };
  }

  // 2. Verify Supabase JWT with Supabase Auth endpoint
  if (isSupabaseConfigured()) {
    try {
      const userRes = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "apikey": SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY
        }
      });
      if (!userRes.ok) return false;
      const user = await userRes.json();
      
      // Check admin_profiles table if service role key is available
      if (SUPABASE_SERVICE_ROLE_KEY && user.id) {
        const profileRes = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/admin_profiles?id=eq.${user.id}&select=id,role,email`, {
          headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "apikey": SUPABASE_SERVICE_ROLE_KEY
          }
        });
        if (profileRes.ok) {
          const profiles = await profileRes.json();
          if (profiles && profiles.length > 0) {
            return { id: user.id, email: user.email, role: profiles[0].role || "admin" };
          }
        }
      }

      // If user is authenticated in Supabase auth, allow admin access
      return { id: user.id, email: user.email, role: "admin" };
    } catch (err) {
      console.error("Auth verification error:", err.message);
      return false;
    }
  }

  return false;
}

// Generic PostgREST fetch helper
async function supabaseRest(endpoint, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${endpoint.replace(/^\/+/, "")}`;
  
  const headers = {
    "apikey": key,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    let parsed;
    try { parsed = JSON.parse(errorText); } catch { parsed = { message: errorText }; }
    const err = new Error(parsed.message || `Supabase error (${response.status})`);
    err.status = response.status;
    err.details = parsed;
    throw err;
  }
  
  if (response.status === 204) return null;
  return await response.json();
}

module.exports = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_TOKEN,
  isSupabaseConfigured,
  corsHeaders,
  sendJson,
  readJsonBody,
  verifyAdmin,
  supabaseRest
};

