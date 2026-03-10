const { Router } = require("express");
const { asyncHandler } = require("../middleware");
const mealController = require("../controllers/mealController");

const router = Router();

router.get("/", asyncHandler(mealController.list));
router.get("/:id", asyncHandler(mealController.getById));

module.exports = router;
