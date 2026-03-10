function validateCreateOrder(body) {
  const { subscriptionTypeId, planId, meals } = body;
  if (!subscriptionTypeId || !planId) {
    return "subscriptionTypeId and planId are required";
  }
  if (!Array.isArray(meals) || meals.length === 0) {
    return "Meals array is required";
  }
  return null;
}

function computeNutritionTotals(mealSelections, mealRecords) {
  const mealMap = Object.fromEntries(mealRecords.map((m) => [m.id, m]));

  let totalCalories = 0,
    totalProtein = 0,
    totalCarbs = 0,
    totalFat = 0;

  for (const sel of mealSelections) {
    const m = mealMap[sel.mealId];
    if (m) {
      totalCalories += m.calories;
      totalProtein += m.protein;
      totalCarbs += m.carbs;
      totalFat += m.fat;
    }
  }

  return {
    totalCalories: Math.round(totalCalories * 100) / 100,
    totalProtein: Math.round(totalProtein * 100) / 100,
    totalCarbs: Math.round(totalCarbs * 100) / 100,
    totalFat: Math.round(totalFat * 100) / 100,
  };
}

module.exports = { validateCreateOrder, computeNutritionTotals };
