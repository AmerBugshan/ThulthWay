const adminSubService = require("../services/adminSubscriptionService");

async function list(req, res) {
  const subscriptions = await adminSubService.listSubscriptions();
  res.json(subscriptions);
}

async function create(req, res) {
  const subscription = await adminSubService.createSubscription(req.body);
  res.status(201).json(subscription);
}

async function update(req, res) {
  const subscription = await adminSubService.updateSubscription(req.params.id, req.body);
  res.json(subscription);
}

async function remove(req, res) {
  const result = await adminSubService.deleteSubscription(req.params.id);
  res.json(result);
}

// ── Plans ──────────────────────────────────────────────────

async function createPlan(req, res) {
  const plan = await adminSubService.createPlan(req.params.subId, req.body);
  res.status(201).json(plan);
}

async function updatePlan(req, res) {
  const plan = await adminSubService.updatePlan(req.params.id, req.body);
  res.json(plan);
}

async function deletePlan(req, res) {
  const result = await adminSubService.deletePlan(req.params.id);
  res.json(result);
}

module.exports = { list, create, update, remove, createPlan, updatePlan, deletePlan };
