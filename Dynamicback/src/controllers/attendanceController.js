const attendanceService = require("../services/attendanceService");
const catchAsync = require("../utils/catchAsync");

// ─── Mark Attendance (Student) ───────────────────────────────────────────────
const markAttendance = catchAsync(async (req, res) => {
  const result = await attendanceService.markAttendance(req.user.userId);
  res.status(201).json({
    success: true,
    ...result,
  });
});

// ─── Get My Attendance (Student) ─────────────────────────────────────────────
const getMyAttendance = catchAsync(async (req, res) => {
  const result = await attendanceService.getMyAttendance(req.user.userId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Admin Attendance Monitor ────────────────────────────────────────────────
const adminGetAttendance = catchAsync(async (req, res) => {
  const { batch } = req.query;
  const result = await attendanceService.adminGetAttendance({ batch });
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  markAttendance,
  getMyAttendance,
  adminGetAttendance,
};
