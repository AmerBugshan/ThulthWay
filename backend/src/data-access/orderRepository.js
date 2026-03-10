const prisma = require("./prisma");

async function create(data) {
  return prisma.order.create({
    data,
    include: {
      meals: { include: { meal: true } },
      plan: true,
      subscriptionType: true,
    },
  });
}

async function findById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      subscriptionType: true,
      plan: true,
      meals: {
        include: { meal: true },
        orderBy: [{ day: "asc" }, { slot: "asc" }],
      },
    },
  });
}

async function planExists(planId) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  return !!plan;
}

async function subscriptionTypeExists(id) {
  const sub = await prisma.subscriptionType.findUnique({ where: { id } });
  return !!sub;
}

module.exports = { create, findById, planExists, subscriptionTypeExists };
