const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const imageUpload = require("../middlewares/imageUpload");
const {
  createTestimonialValidator,
  updateStatusValidator,
} = require("../validators/testimonialValidator");

// Public endpoints
router.get("/public", testimonialController.getPublicTestimonials);
router.post(
  "/",
  imageUpload.single("image"),
  createTestimonialValidator,
  validate,
  testimonialController.createTestimonial
);

// Admin endpoints
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  testimonialController.getAllTestimonials
);
router.patch(
  "/:id/status",
  verifyToken,
  requireRole("admin"),
  updateStatusValidator,
  validate,
  testimonialController.updateTestimonialStatus
);
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  testimonialController.deleteTestimonial
);

module.exports = router;
