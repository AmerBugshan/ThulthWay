const prisma = require("./prisma");

async function findAllWithPlans() {
  return prisma.subscriptionType.findMany({
    include: { plans: { orderBy: { price: "asc" } } },
    orderBy: { nameEn: "asc" },
  });
}

async function findById(id) {
  return prisma.subscriptionType.findUnique({
    where: { id },
    include: { plans: { orderBy: { price: "asc" } } },
  });
}

async function create(data) {
  return prisma.subscriptionType.create({ data });
}

async function update(id, data) {
  return prisma.subscriptionType.update({
    where: { id },
    data,
    include: { plans: { orderBy: { price: "asc" } } },
  });
}

async function remove(id) {
  return prisma.subscriptionType.delete({ where: { id } });
}

async function hasOrders(id) {
  const count = await prisma.order.count({ where: { subscriptionTypeId: id } });
  return count > 0;
}

// ── Plans ──────────────────────────────────────────────────

async function findPlanById(id) {
  return prisma.plan.findUnique({ where: { id } });
}

async function createPlan(data) {
  return prisma.plan.create({ data });
}

async function updatePlan(id, data) {
  return prisma.plan.update({ where: { id }, data });
}

async function removePlan(id) {
  return prisma.plan.delete({ where: { id } });
}

async function planHasOrders(id) {
  const count = await prisma.order.count({ where: { planId: id } });
  return count > 0;
}

module.exports = {
  findAllWithPlans,
  findById,
  create,
  update,
  remove,
  hasOrders,
  findPlanById,
  createPlan,
  updatePlan,
  removePlan,
  planHasOrders,
};
