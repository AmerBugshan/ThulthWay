const { Router } = require("express");
const { asyncHandler } = require("../middleware");
const orderController = require("../controllers/orderController");

const router = Router();

router.post("/", asyncHandler(orderController.create));
router.get("/:id", asyncHandler(orderController.getById));

module.exports = router;
