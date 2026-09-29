const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const imageUpload = require("../middlewares/imageUpload");
const {
  createMilestoneValidator,
  updateMilestoneValidator,
} = require("../validators/achievementValidator");

// ─── Milestones ──────────────────────────────────────────────────────────────

// GET /api/v1/achievements/milestones — Public
router.get("/milestones", achievementController.getAllMilestones);

// POST /api/v1/achievements/milestones — Admin only
router.post(
  "/milestones",
  verifyToken,
  requireRole("admin"),
  createMilestoneValidator,
  validate,
  achievementController.createMilestone
);

// PATCH /api/v1/achievements/milestones/:id — Admin only
router.patch(
  "/milestones/:id",
  verifyToken,
  requireRole("admin"),
  updateMilestoneValidator,
  validate,
  achievementController.updateMilestone
);

// DELETE /api/v1/achievements/milestones/:id — Admin only
router.delete(
  "/milestones/:id",
  verifyToken,
  requireRole("admin"),
  achievementController.deleteMilestone
);

// ─── Gallery ─────────────────────────────────────────────────────────────────

// GET /api/v1/achievements/gallery — Public
router.get("/gallery", achievementController.getAllGalleryImages);

// POST /api/v1/achievements/gallery — Admin only (multipart image upload)
router.post(
  "/gallery",
  verifyToken,
  requireRole("admin"),
  imageUpload.single("image"),
  achievementController.uploadGalleryImage
);

// DELETE /api/v1/achievements/gallery/:id — Admin only
router.delete(
  "/gallery/:id",
  verifyToken,
  requireRole("admin"),
  achievementController.deleteGalleryImage
);

module.exports = router;
