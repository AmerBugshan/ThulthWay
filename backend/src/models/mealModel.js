function validateCreateMeal(body) {
  const { nameEn, nameAr, type, calories, protein, carbs, fat, fiber } = body;
  if (!nameEn || !nameAr || !type || calories == null || protein == null || carbs == null || fat == null || fiber == null) {
    return "Missing required fields: nameEn, nameAr, type, calories, protein, carbs, fat, fiber";
  }
  if (!["BREAKFAST", "MAIN"].includes(type.toUpperCase())) {
    return "type must be BREAKFAST or MAIN";
  }
  return null;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseMealData(body, imageKey) {
  const data = {
    slug: generateSlug(body.nameEn),
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    type: body.type.toUpperCase(),
    calories: parseFloat(body.calories),
    protein: parseFloat(body.protein),
    carbs: parseFloat(body.carbs),
    fat: parseFloat(body.fat),
    fiber: parseFloat(body.fiber),
    imageKey,
  };
  if (body.categoryId) {
    data.categoryId = body.categoryId;
  }
  return data;
}

module.exports = { validateCreateMeal, generateSlug, parseMealData };
