const subRepo = require("../data-access/adminSubscriptionRepository");
const { validateSubscriptionType, validatePlan, parseSubscriptionData, parsePlanData } = require("../models/subscriptionModel");
const { AppError } = require("../middleware");

async function listSubscriptions() {
  return subRepo.findAllWithPlans();
}

async function createSubscription(body) {
  const error = validateSubscriptionType(body);
  if (error) throw new AppError(error, 400);

  const data = parseSubscriptionData(body);
  return subRepo.create(data);
}

async function updateSubscription(id, body) {
  const existing = await subRepo.findById(id);
  if (!existing) throw new AppError("Subscription type not found", 404);

  const error = validateSubscriptionType(body);
  if (error) throw new AppError(error, 400);

  const data = parseSubscriptionData(body);
  return subRepo.update(id, data);
}

async function deleteSubscription(id) {
  const existing = await subRepo.findById(id);
  if (!existing) throw new AppError("Subscription type not found", 404);

  const used = await subRepo.hasOrders(id);
  if (used) throw new AppError("Cannot delete: subscription type has existing orders", 409);

  await subRepo.remove(id);
  return { success: true };
}

// ── Plans ──────────────────────────────────────────────────

async function createPlan(subscriptionTypeId, body) {
  const sub = await subRepo.findById(subscriptionTypeId);
  if (!sub) throw new AppError("Subscription type not found", 404);

  const error = validatePlan(body);
  if (error) throw new AppError(error, 400);

  const data = parsePlanData(body, subscriptionTypeId);
  return subRepo.createPlan(data);
}

async function updatePlan(id, body) {
  const existing = await subRepo.findPlanById(id);
  if (!existing) throw new AppError("Plan not found", 404);

  const error = validatePlan(body);
  if (error) throw new AppError(error, 400);

  const data = parsePlanData(body);
  return subRepo.updatePlan(id, data);
}

async function deletePlan(id) {
  const existing = await subRepo.findPlanById(id);
  if (!existing) throw new AppError("Plan not found", 404);

  const used = await subRepo.planHasOrders(id);
  if (used) throw new AppError("Cannot delete: plan has existing orders", 409);

  await subRepo.removePlan(id);
  return { success: true };
}

module.exports = {
  listSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  createPlan,
  updatePlan,
  deletePlan,
};
