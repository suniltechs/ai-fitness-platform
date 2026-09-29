const achievementService = require("../services/achievementService");
const catchAsync = require("../utils/catchAsync");

// ─── Milestones ──────────────────────────────────────────────────────────────

const createMilestone = catchAsync(async (req, res) => {
  const result = await achievementService.createMilestone(
    req.body,
    req.user.userId
  );
  res.status(201).json({ success: true, ...result });
});

const getAllMilestones = catchAsync(async (req, res) => {
  const result = await achievementService.getAllMilestones();
  res.status(200).json({ success: true, ...result });
});

const updateMilestone = catchAsync(async (req, res) => {
  const result = await achievementService.updateMilestone(
    req.params.id,
    req.body
  );
  res.status(200).json({ success: true, ...result });
});

const deleteMilestone = catchAsync(async (req, res) => {
  const result = await achievementService.deleteMilestone(req.params.id);
  res.status(200).json({ success: true, ...result });
});

// ─── Gallery ─────────────────────────────────────────────────────────────────

const uploadGalleryImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Image file is required" });
  }
  const result = await achievementService.uploadGalleryImage(
    req.file,
    req.body.caption,
    req.user.userId
  );
  res.status(201).json({ success: true, ...result });
});

const getAllGalleryImages = catchAsync(async (req, res) => {
  const result = await achievementService.getAllGalleryImages();
  res.status(200).json({ success: true, ...result });
});

const deleteGalleryImage = catchAsync(async (req, res) => {
  const result = await achievementService.deleteGalleryImage(req.params.id);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  createMilestone,
  getAllMilestones,
  updateMilestone,
  deleteMilestone,
  uploadGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
};
