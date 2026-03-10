const adminOrderService = require("../services/adminOrderService");

async function list(req, res) {
  const result = await adminOrderService.listOrders(req.query);
  res.json(result);
}

module.exports = { list };
