const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const {
  createAnnouncementValidator,
  updateAnnouncementValidator,
} = require("../validators/announcementValidator");

// POST /api/v1/announcements — Create announcement (admin only)
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  createAnnouncementValidator,
  validate,
  announcementController.createAnnouncement
);

// GET /api/v1/announcements/my — Get announcements (student or admin view)
router.get(
  "/my",
  verifyToken,
  requireRole("admin", "student"),
  announcementController.getMyAnnouncements
);

// PATCH /api/v1/announcements/:id — Update announcement (admin only)
router.patch(
  "/:id",
  verifyToken,
  requireRole("admin"),
  updateAnnouncementValidator,
  validate,
  announcementController.updateAnnouncement
);

// DELETE /api/v1/announcements/:id — Delete announcement (admin only)
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  announcementController.deleteAnnouncement
);

module.exports = router;
