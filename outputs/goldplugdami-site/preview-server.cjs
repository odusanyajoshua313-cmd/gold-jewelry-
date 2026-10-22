const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const dataPath = path.join(root, "store.json");
const port = Number(process.env.PORT || 3000);
const adminToken = process.env.ADMIN_TOKEN;
let writeQueue = Promise.resolve();
const contentTypes = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  response.end(JSON.stringify(body));
}
function publicProduct(product) {
  return { sku: product.sku, name: product.name, category: product.category, karat: product.karat, weightGrams: product.weightGrams, detail: product.detail, image: product.image, alt: product.alt, quoteState: product.quoteState, availability: product.status === "active" && product.stockQuantity > 0 ? "in-stock" : "sold-out" };
}
function authorised(request) { return Boolean(adminToken) && request.headers.authorization === `Bearer ${adminToken}`; }
async function readBody(request) {
  let body = "";
  for await (const chunk of request) { body += chunk; if (body.length > 100000) throw new Error("Request body is too large"); }
  try { return JSON.parse(body || "{}"); } catch { throw new Error("Body must be valid JSON"); }
}
function validateProduct(input, existing = {}) {
  const product = { ...existing, ...input };
  for (const field of ["sku", "name", "category", "image", "alt"]) if (typeof product[field] !== "string" || !product[field].trim()) throw new Error(`${field} is required`);
  if (!Number.isInteger(Number(product.karat)) || ![18, 21, 22, 24].includes(Number(product.karat))) throw new Error("karat must be 18, 21, 22, or 24");
  if (!Number.isFinite(Number(product.weightGrams)) || Number(product.weightGrams) <= 0) throw new Error("weightGrams must be greater than zero");
  if (!Number.isInteger(Number(product.stockQuantity)) || Number(product.stockQuantity) < 0) throw new Error("stockQuantity must be a whole number of zero or more");
  if (!["active", "draft", "archived"].includes(product.status)) throw new Error("status must be active, draft, or archived");
  if (!["daily-rate", "request-quote"].includes(product.quoteState)) throw new Error("quoteState must be daily-rate or request-quote");
  return { ...product, sku: product.sku.trim(), name: product.name.trim(), karat: Number(product.karat), weightGrams: Number(product.weightGrams), stockQuantity: Number(product.stockQuantity), detail: String(product.detail || "").trim(), updatedAt: new Date().toISOString() };
}
async function mutate(work) {
  const task = writeQueue.then(async () => {
    const store = JSON.parse(await fs.readFile(dataPath, "utf8"));
    const result = await work(store);
    store.updatedAt = new Date().toISOString();
    await fs.writeFile(dataPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
    return result;
  });
  writeQueue = task.catch(() => undefined);
  return task;
}
async function serveStatic(pathname, response) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\\/+/, "");
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) return json(response, 403, { error: "Forbidden" });
  try { const contents = await fs.readFile(filePath); response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream", "X-Content-Type-Options": "nosniff" }).end(contents); }
  catch (error) { json(response, error.code === "ENOENT" ? 404 : 500, { error: "Not found" }); }
}
async function handler(request, response) {
  const url = new URL(request.url, "http://localhost");
  if (request.method === "GET" && url.pathname === "/api/catalog") {
    const store = JSON.parse(await fs.readFile(dataPath, "utf8"));
    return json(response, 200, { updatedAt: store.updatedAt, products: store.products.filter((item) => item.status === "active").map(publicProduct) });
  }
  if (!url.pathname.startsWith("/api/")) return serveStatic(url.pathname, response);
  if (!url.pathname.startsWith("/api/admin/")) return json(response, 404, { error: "Not found" });
  if (!authorised(request)) return json(response, 401, { error: "Administrator authentication is required" });
  if (request.method === "GET" && url.pathname === "/api/admin/store") return json(response, 200, JSON.parse(await fs.readFile(dataPath, "utf8")));
  if (request.method === "POST" && url.pathname === "/api/admin/products") {
    const input = await readBody(request);
    const product = await mutate((store) => {
      const next = validateProduct(input);
      if (store.products.some((item) => item.sku === next.sku)) throw new Error("A product already uses this SKU");
      store.products.push({ ...next, createdAt: new Date().toISOString() }); return next;
    });
    return json(response, 201, { product });
  }
  const productMatch = url.pathname.match(/^\\/api\\/admin\\/products\\/([^/]+)$/);
  if (request.method === "PUT" && productMatch) {
    const input = await readBody(request); const sku = decodeURIComponent(productMatch[1]);
    const product = await mutate((store) => {
      const index = store.products.findIndex((item) => item.sku === sku);
      if (index < 0) throw new Error("Product not found");
      const next = validateProduct({ ...input, sku }, store.products[index]); store.products[index] = next; return next;
    });
    return json(response, 200, { product });
  }
  if (request.method === "POST" && url.pathname === "/api/admin/sales") {
    const input = await readBody(request);
    const result = await mutate((store) => {
      const quantity = Number(input.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("quantity must be a whole number greater than zero");
      if (!["whatsapp", "walk-in", "delivery"].includes(input.channel)) throw new Error("channel must be whatsapp, walk-in, or delivery");
      const product = store.products.find((item) => item.sku === input.sku);
      if (!product) throw new Error("Product not found");
      if (product.status !== "active" || product.stockQuantity < quantity) throw new Error("Insufficient available stock");
      product.stockQuantity -= quantity; product.updatedAt = new Date().toISOString();
      const sale = { id: `sale_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, sku: product.sku, quantity, channel: input.channel, reference: String(input.reference || "").trim(), notes: String(input.notes || "").trim(), createdAt: new Date().toISOString() };
      store.sales.unshift(sale); return { sale, product };
    });
    return json(response, 201, result);
  }
  return json(response, 404, { error: "Not found" });
}
http.createServer((request, response) => handler(request, response).catch((error) => json(response, 400, { error: error.message || "Request failed" }))).listen(port, "127.0.0.1", () => console.log(`Goldplugdami inventory preview running at http://127.0.0.1:${port}`));
