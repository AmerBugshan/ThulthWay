function validateSubscriptionType(body) {
  const { nameEn, nameAr } = body;
  if (!nameEn || !nameAr) {
    return "Missing required fields: nameEn, nameAr";
  }
  return null;
}

function validatePlan(body) {
  const { nameEn, nameAr, slug, price } = body;
  if (!nameEn || !nameAr || !slug || price == null) {
    return "Missing required fields: nameEn, nameAr, slug, price";
  }
  if (typeof price !== "number" && isNaN(parseInt(price))) {
    return "price must be a number";
  }
  return null;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseSubscriptionData(body) {
  return {
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    slug: body.slug || generateSlug(body.nameEn),
  };
}

function parsePlanData(body, subscriptionTypeId) {
  const data = {
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    slug: body.slug,
    price: parseInt(body.price),
    breakfastSlots: parseInt(body.breakfastSlots) || 0,
    mainSlots: parseInt(body.mainSlots) || 0,
  };
  if (subscriptionTypeId) {
    data.subscriptionTypeId = subscriptionTypeId;
  }
  return data;
}

module.exports = { validateSubscriptionType, validatePlan, generateSlug, parseSubscriptionData, parsePlanData };
