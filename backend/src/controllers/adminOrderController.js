const adminOrderService = require("../services/adminOrderService");

async function list(req, res) {
  const result = await adminOrderService.listOrders(req.query);
  res.json(result);
}

async function remove(req, res) {
  await adminOrderService.deleteOrder(req.params.id);
  res.json({ success: true });
}

module.exports = { list, remove };
