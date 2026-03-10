const dashboardRepo = require("../data-access/dashboardRepository");

function getDateFrom(period) {
  if (!period || period === "all") return null;
  const now = new Date();
  const match = period.match(/^(\d+)d$/);
  if (match) {
    const days = parseInt(match[1]);
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }
  return null;
}

async function getStats(period) {
  const dateFrom = getDateFrom(period);

  const [
    { count: ordersCount, revenue },
    mealsCount,
    subscriptionTypesCount,
    ordersByMonth,
    ordersBySubscription,
    ordersByPlan,
    popularMeals,
    mealTypeBreakdown,
  ] = await Promise.all([
    dashboardRepo.getTotalRevenue(dateFrom),
    dashboardRepo.getMealsCount(),
    dashboardRepo.getSubscriptionTypesCount(),
    dashboardRepo.getOrdersByMonth(dateFrom),
    dashboardRepo.getOrdersBySubscription(dateFrom),
    dashboardRepo.getOrdersByPlan(dateFrom),
    dashboardRepo.getPopularMeals(dateFrom),
    dashboardRepo.getMealTypeBreakdown(),
  ]);

  return {
    summary: {
      totalOrders: ordersCount,
      totalRevenue: revenue,
      totalMeals: mealsCount,
      totalSubscriptionTypes: subscriptionTypesCount,
    },
    ordersByMonth,
    ordersBySubscription,
    ordersByPlan,
    popularMeals,
    mealTypeBreakdown,
  };
}

module.exports = { getStats };
