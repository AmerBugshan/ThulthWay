const { v4: uuidv4 } = require("uuid");
const path = require("path");
const mealRepository = require("../data-access/mealRepository");
const { uploadFile, getPresignedUrl } = require("../s3");
const { validateCreateMeal, parseMealData } = require("../models/mealModel");
const { AppError } = require("../middleware");

async function createMeal(body, file) {
  const validationError = validateCreateMeal(body);
  if (validationError) throw new AppError(validationError, 400);

  let imageKey = null;
  if (file) {
    const ext = path.extname(file.originalname) || ".jpg";
    imageKey = `meals/${uuidv4()}${ext}`;
    await uploadFile(imageKey, file.buffer, file.mimetype);
  }

  const data = parseMealData(body, imageKey);
  const meal = await mealRepository.create(data);

  return {
    ...meal,
    imageUrl: await getPresignedUrl(meal.imageKey),
  };
}

async function listMeals() {
  const meals = await mealRepository.findAll();
  const withUrls = await Promise.all(
    meals.map(async (meal) => ({
      ...meal,
      imageUrl: await getPresignedUrl(meal.imageKey),
    }))
  );
  return withUrls;
}

async function updateMeal(id, body, file) {
  const existing = await mealRepository.findById(id);
  if (!existing) throw new AppError("Meal not found", 404);

  let imageKey = existing.imageKey;
  if (file) {
    const ext = path.extname(file.originalname) || ".jpg";
    imageKey = `meals/${uuidv4()}${ext}`;
    await uploadFile(imageKey, file.buffer, file.mimetype);
  }

  const updateData = {};
  if (body.nameEn) updateData.nameEn = body.nameEn;
  if (body.nameAr) updateData.nameAr = body.nameAr;
  if (body.type) updateData.type = body.type.toUpperCase();
  if (body.calories != null) updateData.calories = parseFloat(body.calories);
  if (body.protein != null) updateData.protein = parseFloat(body.protein);
  if (body.carbs != null) updateData.carbs = parseFloat(body.carbs);
  if (body.fat != null) updateData.fat = parseFloat(body.fat);
  if (body.fiber != null) updateData.fiber = parseFloat(body.fiber);
  if (body.nameEn) {
    updateData.slug = body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  if (imageKey !== existing.imageKey) {
    updateData.imageKey = imageKey;
  }
  if (body.categoryId !== undefined) {
    updateData.categoryId = body.categoryId || null;
  }

  const meal = await mealRepository.update(id, updateData);
  return {
    ...meal,
    imageUrl: await getPresignedUrl(meal.imageKey),
  };
}

async function deleteMeal(id) {
  const existing = await mealRepository.findById(id);
  if (!existing) throw new AppError("Meal not found", 404);

  const used = await mealRepository.hasOrders(id);
  if (used) throw new AppError("Cannot delete: meal is used in existing orders", 409);

  await mealRepository.remove(id);
  return { success: true };
}

module.exports = { createMeal, listMeals, updateMeal, deleteMeal };
