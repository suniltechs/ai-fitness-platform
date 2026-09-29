const dietService = require("../services/dietService");
const catchAsync = require("../utils/catchAsync");

// ─── Add Daily Diet (Student) ────────────────────────────────────────────────
const addDiet = catchAsync(async (req, res) => {
  const result = await dietService.addDiet(req.user.userId, req.body);
  res.status(201).json({
    success: true,
    ...result,
  });
});

// ─── Get My Diet Logs (Student) ──────────────────────────────────────────────
const getMyDiet = catchAsync(async (req, res) => {
  const result = await dietService.getMyDiet(req.user.userId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Get Macro Summary (Student) ─────────────────────────────────────────────
const getMacroSummary = catchAsync(async (req, res) => {
  const result = await dietService.getMacroSummary(req.user.userId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  addDiet,
  getMyDiet,
  getMacroSummary,
};
