const { Router } = require("express");
const { asyncHandler } = require("../middleware");
const subscriptionController = require("../controllers/subscriptionController");

const router = Router();

router.get("/", asyncHandler(subscriptionController.list));

module.exports = router;
