const { Router } = require("express");
const { asyncHandler } = require("../middleware");
const prisma = require("../data-access/prisma");

const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  const categories = await prisma.foodCategory.findMany({
    orderBy: { nameEn: "asc" },
  });
  res.json(categories);
}));

module.exports = router;
