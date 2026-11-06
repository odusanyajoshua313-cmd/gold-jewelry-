// api/catalog.js - Compatibility alias to api/products/index.js
const productsHandler = require("./products/index.js");

module.exports = async function handler(req, res) {
  return productsHandler(req, res);
};

