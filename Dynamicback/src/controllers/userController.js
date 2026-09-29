const userService = require("../services/userService");
const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

// ─── Approve Student ────────────────────────────────────────────────────────
const approveStudent = catchAsync(async (req, res) => {
  const result = await authService.approveStudent(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Delete Student (Soft Delete) ────────────────────────────────────────────
const deleteStudent = catchAsync(async (req, res) => {
  const result = await userService.deleteStudent(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Reactivate Student ─────────────────────────────────────────────────────
const reactivateStudent = catchAsync(async (req, res) => {
  const result = await userService.reactivateStudent(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Permanent Delete Student ───────────────────────────────────────────────
const permanentDeleteStudent = catchAsync(async (req, res) => {
  const result = await userService.permanentDeleteStudent(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Get All Students ────────────────────────────────────────────────────────
const getAllStudents = catchAsync(async (req, res) => {
  const { status, batch, gender, bloodGroup, isActive, page, limit, name } = req.query;
  const result = await userService.getAllStudents({ status, batch, gender, bloodGroup, isActive, page, limit, name });
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Import Students from Excel ──────────────────────────────────────────────
const importStudents = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an Excel file",
    });
  }

  const result = await userService.importStudents(req.file.buffer);
  res.status(201).json({
    success: true,
    ...result,
  });
});

// ─── Export Student Progress ─────────────────────────────────────────────────
const exportStudentProgress = catchAsync(async (req, res) => {
  const buffer = await userService.exportStudentProgress();

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=student_progress.xlsx"
  );
  res.send(buffer);
});

const getStats = catchAsync(async (req, res) => {
  const stats = await userService.getStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
});

// ─── Get Batch Names ─────────────────────────────────────────────────────────
const getBatches = catchAsync(async (req, res) => {
  const result = await userService.getBatches();
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Update Profile ─────────────────────────────────────────────────────────
const updateProfile = catchAsync(async (req, res) => {
  const result = await userService.updateProfile(req.user.userId, req.body);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Get Single Student ──────────────────────────────────────────────────────
const getStudent = catchAsync(async (req, res) => {
  const result = await userService.getStudent(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Update Student by Admin ────────────────────────────────────────────────
const updateStudentAdmin = catchAsync(async (req, res) => {
  const result = await userService.updateStudentAdmin(req.params.id, req.body);
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  approveStudent,
  deleteStudent,
  getAllStudents,
  getStudent,
  updateStudentAdmin,
  importStudents,
  exportStudentProgress,
  getStats,
  getBatches,
  updateProfile,
  reactivateStudent,
  permanentDeleteStudent,
};
