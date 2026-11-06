// api/admin/upload.js - Uploads product photos directly to Supabase Storage bucket 'product-images'
const { isSupabaseConfigured, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, sendJson, readJsonBody, verifyAdmin } = require("../_supabase");

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

  const admin = await verifyAdmin(req);
  if (!admin) {
    return sendJson(res, 401, { error: "Administrator authentication is required" });
  }

  try {
    const body = await readJsonBody(req);
    const { dataBase64, filename } = body;

    if (!dataBase64) {
      return sendJson(res, 400, { error: "Image data (base64) is required" });
    }

    // Parse base64 header and extract MIME type
    const matches = String(dataBase64).match(/^data:([a-zA-Z0-9_\-\.\/]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let buffer;

    if (matches) {
      mimeType = matches[1].toLowerCase();
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(dataBase64, "base64");
    }

    // Validate MIME type
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedMimes.includes(mimeType)) {
      return sendJson(res, 400, { error: `Unsupported image type (${mimeType}). Allowed: JPEG, PNG, WebP` });
    }

    // Validate size (max 15 MB)
    if (buffer.length > 15 * 1024 * 1024) {
      return sendJson(res, 400, { error: "Image exceeds 15 MB limit" });
    }

    // Determine extension
    const ext = mimeType.includes("png") ? ".png" : mimeType.includes("webp") ? ".webp" : ".jpg";
    const baseName = (filename ? filename.replace(/\.[^/.]+$/, "") : "product")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 32);

    const uniqueFilename = `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`;

    if (isSupabaseConfigured() && SUPABASE_SERVICE_ROLE_KEY) {
      // Upload to Supabase Storage bucket 'product-images'
      const uploadEndpoint = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/product-images/${uniqueFilename}`;
      const uploadRes = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": mimeType,
          "x-upsert": "true"
        },
        body: buffer
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Supabase Storage upload failed: ${errText}`);
      }

      // Public CDN URL
      const publicUrl = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/product-images/${uniqueFilename}`;

      return sendJson(res, 201, {
        success: true,
        path: publicUrl,
        filename: uniqueFilename
      });
    } else {
      // Local fallback
      return sendJson(res, 201, {
        success: true,
        path: `assets/${uniqueFilename}`,
        filename: uniqueFilename
      });
    }
  } catch (err) {
    console.error("Image upload error:", err);
    return sendJson(res, 500, { error: err.message || "Failed to upload image" });
  }
};

