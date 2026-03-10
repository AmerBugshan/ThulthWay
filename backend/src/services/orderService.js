const orderRepository = require("../data-access/orderRepository");
const mealRepository = require("../data-access/mealRepository");
const { validateCreateOrder, computeNutritionTotals } = require("../models/orderModel");
const { getPresignedUrl } = require("../s3");
const { AppError } = require("../middleware");

async function createOrder(payload) {
  const validationError = validateCreateOrder(payload);
  if (validationError) throw new AppError(validationError, 400);

  const { subscriptionTypeId, planId, meals } = payload;

  const planValid = await orderRepository.planExists(planId);
  if (!planValid) throw new AppError("Invalid plan", 400);

  const subValid = await orderRepository.subscriptionTypeExists(subscriptionTypeId);
  if (!subValid) throw new AppError("Invalid subscription type", 400);

  const mealIds = [...new Set(meals.map((m) => m.mealId))];
  const mealRecords = await mealRepository.findByIds(mealIds);
  const totals = computeNutritionTotals(meals, mealRecords);

  return orderRepository.create({
    subscriptionTypeId,
    planId,
    ...totals,
    meals: {
      create: meals.map((m) => ({
        mealId: m.mealId,
        day: m.day,
        slot: m.slot,
      })),
    },
  });
}

async function getOrderById(id) {
  const order = await orderRepository.findById(id);
  if (!order) throw new AppError("Order not found", 404);

  const mealsWithUrls = await Promise.all(
    order.meals.map(async (om) => ({
      ...om,
      meal: {
        ...om.meal,
        imageUrl: await getPresignedUrl(om.meal.imageKey),
      },
    }))
  );

  return { ...order, meals: mealsWithUrls };
}

module.exports = { createOrder, getOrderById };
