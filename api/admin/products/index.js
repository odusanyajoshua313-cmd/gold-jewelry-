// api/admin/products/index.js - POST /api/admin/products
const productsHandler = require("../../products/index.js");

module.exports = async function handler(req, res) {
  return productsHandler(req, res);
};

