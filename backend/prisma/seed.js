const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Subscription Types ──────────────────────────────────────
  const cutting = await prisma.subscriptionType.upsert({
    where: { slug: "cutting" },
    update: {},
    create: { nameEn: "Cutting", nameAr: "تنشيف", slug: "cutting" },
  });

  const maintenance = await prisma.subscriptionType.upsert({
    where: { slug: "maintenance" },
    update: {},
    create: { nameEn: "Maintenance", nameAr: "محافظة", slug: "maintenance" },
  });

  const bulk = await prisma.subscriptionType.upsert({
    where: { slug: "bulk" },
    update: {},
    create: { nameEn: "Bulk", nameAr: "تضخيم", slug: "bulk" },
  });

  // ── Plan definitions ────────────────────────────────────────
  const planDefs = [
    { slug: "breakfast-only", nameEn: "Breakfast only", nameAr: "فطور فقط", breakfastSlots: 1, mainSlots: 0 },
    { slug: "main-only", nameEn: "Main dish only", nameAr: "وجبة رئيسية فقط", breakfastSlots: 0, mainSlots: 1 },
    { slug: "breakfast-main", nameEn: "Breakfast + Main", nameAr: "فطور + وجبة رئيسية", breakfastSlots: 1, mainSlots: 1 },
    { slug: "two-mains", nameEn: "2 Main dishes", nameAr: "وجبتان رئيسيتان", breakfastSlots: 0, mainSlots: 2 },
    { slug: "full", nameEn: "Full package", nameAr: "باقة كاملة", breakfastSlots: 1, mainSlots: 2 },
  ];

  const prices = {
    cutting:     [379, 499, 699, 899, 1199],
    maintenance: [449, 599, 899, 999, 1399],
    bulk:        [519, 699, 1099, 1199, 1599],
  };

  const subTypes = { cutting, maintenance, bulk };

  for (const [subSlug, sub] of Object.entries(subTypes)) {
    for (let i = 0; i < planDefs.length; i++) {
      const def = planDefs[i];
      await prisma.plan.upsert({
        where: {
          subscriptionTypeId_slug: {
            subscriptionTypeId: sub.id,
            slug: def.slug,
          },
        },
        update: { price: prices[subSlug][i] },
        create: {
          nameEn: def.nameEn,
          nameAr: def.nameAr,
          slug: def.slug,
          price: prices[subSlug][i],
          breakfastSlots: def.breakfastSlots,
          mainSlots: def.mainSlots,
          subscriptionTypeId: sub.id,
        },
      });
    }
  }

  // ── Breakfast Meals ─────────────────────────────────────────
  const breakfastMeals = [
    { nameEn: "Halloumi Sandwich", nameAr: "سندويتش الحلوم", calories: 353, protein: 24.6, carbs: 33, fat: 12.7, fiber: 2.6 },
    { nameEn: "Egg & Basil Sauce Sandwich", nameAr: "سندويتش البيض مع صوص الريحان", calories: 395, protein: 23.5, carbs: 25.7, fat: 19.2, fiber: 2.5 },
    { nameEn: "Oat & Egg Pancake", nameAr: "فطيرة الشوفان و البيض", calories: 454, protein: 23.3, carbs: 41, fat: 19.7, fiber: 5.4 },
    { nameEn: "Turkey & Green Sauce Sandwich", nameAr: "سندويتش التيركي مع الصوص الاخضر", calories: 401, protein: 33.8, carbs: 29.2, fat: 14.8, fiber: 3.4 },
    { nameEn: "White Tuna Sandwich", nameAr: "سندويتش تونا بيضاء", calories: 294, protein: 30.6, carbs: 26.1, fat: 8.2, fiber: 3 },
    { nameEn: "Red Tuna Sandwich", nameAr: "سندويتش تونا حمرا", calories: 300, protein: 27.6, carbs: 13.4, fat: 5.88, fiber: 3.2 },
    { nameEn: "Quraysh Sandwich", nameAr: "سندويتش قريش", calories: 415, protein: 24.7, carbs: 57.2, fat: 7, fiber: 3.5 },
  ];

  // ── Main Dish Meals ─────────────────────────────────────────
  const mainMeals = [
    { nameEn: "Chipotle Chicken", nameAr: "تشيبو تشكن", calories: 472, protein: 48, carbs: 49.7, fat: 6.2, fiber: 1.8 },
    { nameEn: "Sesame Chicken with Black Seed Rice", nameAr: "دجاج بالسمسم و رز بحبة البركة", calories: 549, protein: 52.5, carbs: 54.3, fat: 10.9, fiber: 0.8 },
    { nameEn: "Ground Beef with Mashed Potato", nameAr: "لحم مفروم مع بطاطس مهروس", calories: 608, protein: 40, carbs: 27, fat: 36.6, fiber: 3.7 },
    { nameEn: "Chicken Cajun Pasta", nameAr: "دجاج و مكرونة بالكيجن", calories: 593, protein: 57.5, carbs: 60, fat: 10.7, fiber: 0.3 },
    { nameEn: "Shredded Chicken Sandwich", nameAr: "سندويتش دجاج مفتت", calories: 464, protein: 52.5, carbs: 38.5, fat: 8.7, fiber: 4.1 },
    { nameEn: "Pancake", nameAr: "بانكيك", calories: 430, protein: 40, carbs: 35, fat: 6, fiber: 5 },
    { nameEn: "Beef & Sweet Sauce Sandwich", nameAr: "ساندويتش لحم مع الصوص الحلو", calories: 480, protein: 34, carbs: 42, fat: 14, fiber: 4 },
    { nameEn: "Chicken with Garlic Cheese Potato", nameAr: "دجاج و بطاطس بالثوم و الجبن", calories: 455, protein: 56, carbs: 31, fat: 7, fiber: 3 },
    { nameEn: "Onion Chicken Pasta", nameAr: "مكرونة البصل و الدجاج", calories: 529, protein: 55.2, carbs: 47.1, fat: 10.6, fiber: 2 },
    { nameEn: "Orange Chicken with Sesame Rice", nameAr: "دجاج بالبرتقال مع رز بالسمسم", calories: 544, protein: 45, carbs: 22.95, fat: 29.2, fiber: 3.23 },
    { nameEn: "Parsley Chicken with Cilantro Rice", nameAr: "دجاج بالبقدونس و رز بالكزبرة", calories: 446, protein: 50.5, carbs: 42.5, fat: 5.9, fiber: 0.6 },
    { nameEn: "Ground Beef with Potato Sticks", nameAr: "لحم مفروم مع اصابع البطاطس", calories: 352, protein: 42, carbs: 32, fat: 7.7, fiber: 2.7 },
    { nameEn: "Orange Cream Chicken with White Rice", nameAr: "دجاج بكريمة البرتقال مع رز ابيض", calories: 458, protein: 51, carbs: 45.5, fat: 6.3, fiber: 0.6 },
    { nameEn: "Butter Chicken", nameAr: "بتر تشيكن", calories: 574, protein: 54.5, carbs: 54, fat: 12.4, fiber: 2.1 },
    { nameEn: "White Fish with Spiced Rice", nameAr: "سمك ابيض مع رز بهارات مشكلة", calories: 325, protein: 26.5, carbs: 47, fat: 2.2, fiber: 0.9 },
    { nameEn: "Egg Saj Sandwich", nameAr: "سندويتش بيض صاج", calories: 445, protein: 24.8, carbs: 21.6, fat: 6.8, fiber: 3.5 },
    { nameEn: "Double Beef Burger", nameAr: "برقر لحم دبل", calories: 582, protein: 46, carbs: 37, fat: 19, fiber: 3 },
    { nameEn: "Salmon with Italian Spiced Rice", nameAr: "سالمون مع رز البهارات الايطالية", calories: 403, protein: 26, carbs: 42, fat: 13.5, fiber: 0.6 },
    { nameEn: "Mandi", nameAr: "مندي", calories: 367, protein: 35, carbs: 42, fat: 4.9, fiber: 0.6 },
    { nameEn: "Kabsa", nameAr: "كبسة", calories: 450, protein: 50.5, carbs: 43, fat: 5.9, fiber: 0.6 },
    { nameEn: "Curry Sandwich", nameAr: "ساندويتش كاري", calories: 490, protein: 40.6, carbs: 41.2, fat: 14, fiber: 3.2 },
    { nameEn: "Beef Chunks with Wedges", nameAr: "قطع لحم مع بطاطس ودجز", calories: 320, protein: 30, carbs: 27, fat: 8, fiber: 3 },
  ];

  // ── Food Categories ────────────────────────────────────────
  const categoryDefs = [
    { nameEn: "Poultry", nameAr: "دواجن", slug: "poultry" },
    { nameEn: "Beef", nameAr: "لحم بقري", slug: "beef" },
    { nameEn: "Seafood", nameAr: "مأكولات بحرية", slug: "seafood" },
    { nameEn: "Vegetarian", nameAr: "نباتي", slug: "vegetarian" },
    { nameEn: "Eggs & Dairy", nameAr: "بيض وألبان", slug: "eggs-dairy" },
    { nameEn: "Grains", nameAr: "حبوب", slug: "grains" },
    { nameEn: "Other", nameAr: "أخرى", slug: "other" },
  ];

  const categories = {};
  for (const cat of categoryDefs) {
    const result = await prisma.foodCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = result.id;
  }

  // ── Helper to match meal name → category ──────────────────
  function getCategoryId(nameEn) {
    const n = nameEn.toLowerCase();
    if (n.includes("chicken") || n.includes("turkey") || n.includes("mandi") || n.includes("kabsa"))
      return categories["poultry"];
    if (n.includes("beef") || n.includes("ground beef") || n.includes("burger"))
      return categories["beef"];
    if (n.includes("tuna") || n.includes("fish") || n.includes("salmon"))
      return categories["seafood"];
    if (n.includes("halloumi") || n.includes("quraysh") || n.includes("egg"))
      return categories["eggs-dairy"];
    if (n.includes("oat") || n.includes("pancake"))
      return categories["grains"];
    return categories["other"];
  }

  for (const meal of breakfastMeals) {
    const slug = meal.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.meal.upsert({
      where: { slug },
      update: { categoryId: getCategoryId(meal.nameEn) },
      create: { ...meal, slug, type: "BREAKFAST", categoryId: getCategoryId(meal.nameEn) },
    });
  }

  for (const meal of mainMeals) {
    const slug = meal.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.meal.upsert({
      where: { slug },
      update: { categoryId: getCategoryId(meal.nameEn) },
      create: { ...meal, slug, type: "MAIN", categoryId: getCategoryId(meal.nameEn) },
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
