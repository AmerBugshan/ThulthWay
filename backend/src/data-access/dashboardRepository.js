const prisma = require("./prisma");

async function getOrdersCount(dateFrom) {
  const where = dateFrom ? { createdAt: { gte: dateFrom } } : {};
  return prisma.order.count({ where });
}

async function getTotalRevenue(dateFrom) {
  const where = dateFrom ? { createdAt: { gte: dateFrom } } : {};
  const result = await prisma.order.aggregate({
    where,
    _sum: { totalCalories: true },
    _count: true,
  });
  // Revenue = sum of plan prices for all orders in period
  const orders = await prisma.order.findMany({
    where,
    select: { plan: { select: { price: true } } },
  });
  const revenue = orders.reduce((sum, o) => sum + (o.plan?.price || 0), 0);
  return { count: result._count, revenue };
}

async function getMealsCount() {
  return prisma.meal.count();
}

async function getSubscriptionTypesCount() {
  return prisma.subscriptionType.count();
}

async function getOrdersByMonth(dateFrom) {
  const where = dateFrom ? { createdAt: { gte: dateFrom } } : {};
  const orders = await prisma.order.findMany({
    where,
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const grouped = {};
  for (const order of orders) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
    grouped[key] = (grouped[key] || 0) + 1;
  }
  return Object.entries(grouped).map(([month, count]) => ({ month, count }));
}

async function getOrdersBySubscription(dateFrom) {
  const where = dateFrom ? { createdAt: { gte: dateFrom } } : {};
  const results = await prisma.order.groupBy({
    by: ["subscriptionTypeId"],
    where,
    _count: true,
  });

  const subTypes = await prisma.subscriptionType.findMany();
  const subMap = Object.fromEntries(subTypes.map((s) => [s.id, s]));

  return results.map((r) => ({
    subscriptionTypeId: r.subscriptionTypeId,
    nameEn: subMap[r.subscriptionTypeId]?.nameEn || "Unknown",
    nameAr: subMap[r.subscriptionTypeId]?.nameAr || "Unknown",
    count: r._count,
  }));
}

async function getOrdersByPlan(dateFrom) {
  const where = dateFrom ? { createdAt: { gte: dateFrom } } : {};
  const results = await prisma.order.groupBy({
    by: ["planId"],
    where,
    _count: true,
  });

  const plans = await prisma.plan.findMany();
  const planMap = Object.fromEntries(plans.map((p) => [p.id, p]));

  return results.map((r) => ({
    planId: r.planId,
    nameEn: planMap[r.planId]?.nameEn || "Unknown",
    nameAr: planMap[r.planId]?.nameAr || "Unknown",
    count: r._count,
  }));
}

async function getPopularMeals(dateFrom, limit = 10) {
  const where = dateFrom ? { order: { createdAt: { gte: dateFrom } } } : {};
  const results = await prisma.orderMeal.groupBy({
    by: ["mealId"],
    where,
    _count: true,
    orderBy: { _count: { mealId: "desc" } },
    take: limit,
  });

  const meals = await prisma.meal.findMany({
    where: { id: { in: results.map((r) => r.mealId) } },
  });
  const mealMap = Object.fromEntries(meals.map((m) => [m.id, m]));

  return results.map((r) => ({
    mealId: r.mealId,
    nameEn: mealMap[r.mealId]?.nameEn || "Unknown",
    nameAr: mealMap[r.mealId]?.nameAr || "Unknown",
    type: mealMap[r.mealId]?.type || "MAIN",
    count: r._count,
  }));
}

async function getMealTypeBreakdown() {
  const breakfast = await prisma.meal.count({ where: { type: "BREAKFAST" } });
  const main = await prisma.meal.count({ where: { type: "MAIN" } });
  return { breakfast, main };
}

module.exports = {
  getOrdersCount,
  getTotalRevenue,
  getMealsCount,
  getSubscriptionTypesCount,
  getOrdersByMonth,
  getOrdersBySubscription,
  getOrdersByPlan,
  getPopularMeals,
  getMealTypeBreakdown,
};
