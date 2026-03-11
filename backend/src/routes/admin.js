const { Router } = require("express");
const { upload, asyncHandler } = require("../middleware");
const adminController = require("../controllers/adminController");
const dashboardController = require("../controllers/dashboardController");
const adminSubController = require("../controllers/adminSubscriptionController");
const adminOrderController = require("../controllers/adminOrderController");
const adminCategoryController = require("../controllers/adminCategoryController");

const router = Router();

// ── Dashboard ──────────────────────────────────────────────
router.get("/dashboard/stats", asyncHandler(dashboardController.getStats));

// ── Subscription Types ─────────────────────────────────────
router.get("/subscriptions", asyncHandler(adminSubController.list));
router.post("/subscriptions", asyncHandler(adminSubController.create));
router.put("/subscriptions/:id", asyncHandler(adminSubController.update));
router.delete("/subscriptions/:id", asyncHandler(adminSubController.remove));

// ── Plans ──────────────────────────────────────────────────
router.post("/subscriptions/:subId/plans", asyncHandler(adminSubController.createPlan));
router.put("/plans/:id", asyncHandler(adminSubController.updatePlan));
router.delete("/plans/:id", asyncHandler(adminSubController.deletePlan));

// ── Categories ────────────────────────────────────────────
router.get("/categories", asyncHandler(adminCategoryController.list));
router.post("/categories", asyncHandler(adminCategoryController.create));
router.put("/categories/:id", asyncHandler(adminCategoryController.update));
router.delete("/categories/:id", asyncHandler(adminCategoryController.remove));

// ── Meals ──────────────────────────────────────────────────
router.get("/meals", asyncHandler(adminController.listMeals));
router.post("/meals", upload.single("image"), asyncHandler(adminController.createMeal));
router.put("/meals/:id", upload.single("image"), asyncHandler(adminController.updateMeal));
router.delete("/meals/:id", asyncHandler(adminController.deleteMeal));

// ── Orders ─────────────────────────────────────────────────
router.get("/orders", asyncHandler(adminOrderController.list));
router.delete("/orders/:id", asyncHandler(adminOrderController.remove));

module.exports = router;
