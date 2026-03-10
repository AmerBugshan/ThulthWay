const categoryRepo = require("../data-access/adminCategoryRepository");
const { validateCategory, parseCategoryData } = require("../models/categoryModel");
const { AppError } = require("../middleware");

async function listCategories() {
  return categoryRepo.findAll();
}

async function createCategory(body) {
  const error = validateCategory(body);
  if (error) throw new AppError(error, 400);

  const data = parseCategoryData(body);
  return categoryRepo.create(data);
}

async function updateCategory(id, body) {
  const existing = await categoryRepo.findById(id);
  if (!existing) throw new AppError("Category not found", 404);

  const error = validateCategory(body);
  if (error) throw new AppError(error, 400);

  const data = parseCategoryData(body);
  return categoryRepo.update(id, data);
}

async function deleteCategory(id) {
  const existing = await categoryRepo.findById(id);
  if (!existing) throw new AppError("Category not found", 404);

  const used = await categoryRepo.hasMeals(id);
  if (used) throw new AppError("Cannot delete: category has assigned meals", 409);

  await categoryRepo.remove(id);
  return { success: true };
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
