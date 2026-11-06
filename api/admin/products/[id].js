// api/admin/products/[id].js - PUT, PATCH, DELETE for /api/admin/products/:id
const singleProductHandler = require("../../products/[id].js");

module.exports = async function handler(req, res) {
  // Translate PUT to PATCH for product update handler
  if (req.method === "PUT") {
    req.method = "PATCH";
  }
  return singleProductHandler(req, res);
};

