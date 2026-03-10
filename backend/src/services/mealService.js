const mealRepository = require("../data-access/mealRepository");
const { getPresignedUrl } = require("../s3");
const { AppError } = require("../middleware");

async function getAllMeals(type, categoryId) {
  const filter = {};
  if (type && ["BREAKFAST", "MAIN"].includes(type.toUpperCase())) {
    filter.type = type.toUpperCase();
  }
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  const meals = await mealRepository.findAll(filter);

  return Promise.all(
    meals.map(async (meal) => ({
      ...meal,
      imageUrl: await getPresignedUrl(meal.imageKey),
    }))
  );
}

async function getMealById(id) {
  const meal = await mealRepository.findById(id);
  if (!meal) throw new AppError("Meal not found", 404);

  return {
    ...meal,
    imageUrl: await getPresignedUrl(meal.imageKey),
  };
}

module.exports = { getAllMeals, getMealById };
