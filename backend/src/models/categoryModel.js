function validateCategory(body) {
  const { nameEn, nameAr } = body;
  if (!nameEn || !nameAr) {
    return "Missing required fields: nameEn, nameAr";
  }
  return null;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseCategoryData(body) {
  return {
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    slug: body.slug || generateSlug(body.nameEn),
  };
}

module.exports = { validateCategory, generateSlug, parseCategoryData };
