const mealService = require("../services/mealService");

async function list(req, res) {
  const meals = await mealService.getAllMeals(req.query.type, req.query.categoryId);
  res.json(meals);
}

async function getById(req, res) {
  const meal = await mealService.getMealById(req.params.id);
  res.json(meal);
}

module.exports = { list, getById };
