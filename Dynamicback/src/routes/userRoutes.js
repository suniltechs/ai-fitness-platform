const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const upload = require("../middlewares/upload");
const { getAllStudentsValidator } = require("../validators/userValidator");

// GET /api/v1/users — Get all students (admin only)
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  getAllStudentsValidator,
  validate,
  userController.getAllStudents
);

// GET /api/v1/users/stats — Get dashboard stats (admin only)
router.get(
  "/stats",
  verifyToken,
  requireRole("admin"),
  userController.getStats
);

// GET /api/v1/users/batches — Get distinct batch names (admin only)
router.get(
  "/batches",
  verifyToken,
  requireRole("admin"),
  userController.getBatches
);

// GET /api/v1/users/export — Export student progress (admin only)
router.get(
  "/export",
  verifyToken,
  requireRole("admin"),
  userController.exportStudentProgress
);

// POST /api/v1/users/import — Import students from Excel (admin only)
router.post(
  "/import",
  verifyToken,
  requireRole("admin"),
  upload.single("file"),
  userController.importStudents
);

// PATCH /api/v1/users/:id/approve — Approve student (admin only)
router.patch(
  "/:id/approve",
  verifyToken,
  requireRole("admin"),
  userController.approveStudent
);

// GET /api/v1/users/:id — Get single student details (admin only)
router.get(
  "/:id",
  verifyToken,
  requireRole("admin"),
  userController.getStudent
);

// PATCH /api/v1/users/:id — Update student details (admin only)
router.patch(
  "/:id",
  verifyToken,
  requireRole("admin"),
  userController.updateStudentAdmin
);

// DELETE /api/v1/users/:id — Soft delete student (admin only)
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  userController.deleteStudent
);

// PATCH /api/v1/users/:id/reactivate — Reactivate student (admin only)
router.patch(
  "/:id/reactivate",
  verifyToken,
  requireRole("admin"),
  userController.reactivateStudent
);

// DELETE /api/v1/users/:id/permanent — Permanent delete student (admin only)
router.delete(
  "/:id/permanent",
  verifyToken,
  requireRole("admin"),
  userController.permanentDeleteStudent
);

// PATCH /api/v1/users/profile — Update current user profile
router.patch(
  "/profile",
  verifyToken,
  userController.updateProfile
);

module.exports = router;
