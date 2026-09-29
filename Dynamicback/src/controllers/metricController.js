const metricService = require("../services/metricService");
const catchAsync = require("../utils/catchAsync");

// ─── Add Metrics (Student) ───────────────────────────────────────────────────
const addMetrics = catchAsync(async (req, res) => {
  const result = await metricService.addMetrics(req.user.userId, req.body);
  res.status(201).json({
    success: true,
    ...result,
  });
});

// ─── Get My Metrics (Student) ────────────────────────────────────────────────
const getMyMetrics = catchAsync(async (req, res) => {
  const result = await metricService.getMyMetrics(req.user.userId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Admin View Student Metrics ──────────────────────────────────────────────
const getStudentMetrics = catchAsync(async (req, res) => {
  const result = await metricService.getStudentMetrics(req.params.studentId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Delete Metrics (Student) ────────────────────────────────────────────────
const deleteMetric = catchAsync(async (req, res) => {
  const result = await metricService.deleteMetric(
    req.user.userId,
    req.params.id
  );
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  addMetrics,
  getMyMetrics,
  getStudentMetrics,
  deleteMetric,
};
