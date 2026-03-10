const adminService = require("../services/adminService");

async function createMeal(req, res) {
  const meal = await adminService.createMeal(req.body, req.file);
  res.status(201).json(meal);
}

async function listMeals(req, res) {
  const meals = await adminService.listMeals();
  res.json(meals);
}

async function updateMeal(req, res) {
  const meal = await adminService.updateMeal(req.params.id, req.body, req.file);
  res.json(meal);
}

async function deleteMeal(req, res) {
  const result = await adminService.deleteMeal(req.params.id);
  res.json(result);
}

module.exports = { createMeal, listMeals, updateMeal, deleteMeal };
