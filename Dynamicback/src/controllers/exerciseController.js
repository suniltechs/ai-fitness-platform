const exerciseService = require("../services/exerciseService");
const catchAsync = require("../utils/catchAsync");

// ─── Get All Exercises ───────────────────────────────────────────────────────
const getExercises = catchAsync(async (req, res) => {
  const result = await exerciseService.getAllExercises();
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  getExercises,
};
