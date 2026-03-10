const orderService = require("../services/orderService");

async function create(req, res) {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
}

async function getById(req, res) {
  const order = await orderService.getOrderById(req.params.id);
  res.json(order);
}

module.exports = { create, getById };
