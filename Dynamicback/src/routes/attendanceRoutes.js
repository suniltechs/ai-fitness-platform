const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const {
  adminAttendanceValidator,
} = require("../validators/attendanceValidator");

// POST /api/v1/attendance — Mark attendance (student only)
router.post(
  "/",
  verifyToken,
  requireRole("student"),
  attendanceController.markAttendance
);

// GET /api/v1/attendance/my — Get my attendance (student only)
router.get(
  "/my",
  verifyToken,
  requireRole("student"),
  attendanceController.getMyAttendance
);

// GET /api/v1/attendance/admin — Admin attendance monitor (admin only)
router.get(
  "/admin",
  verifyToken,
  requireRole("admin"),
  adminAttendanceValidator,
  validate,
  attendanceController.adminGetAttendance
);

module.exports = router;
