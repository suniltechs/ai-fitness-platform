const announcementService = require("../services/announcementService");
const catchAsync = require("../utils/catchAsync");

// ─── Create Announcement (Admin) ─────────────────────────────────────────────
const createAnnouncement = catchAsync(async (req, res) => {
  const result = await announcementService.createAnnouncement(
    req.body,
    req.user.userId
  );
  res.status(201).json({
    success: true,
    ...result,
  });
});

// ─── Get My Announcements (Student) ──────────────────────────────────────────
const getMyAnnouncements = catchAsync(async (req, res) => {
  const result = await announcementService.getMyAnnouncements(req.user.userId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Update Announcement (Admin) ─────────────────────────────────────────────
const updateAnnouncement = catchAsync(async (req, res) => {
  const result = await announcementService.updateAnnouncement(
    req.params.id,
    req.body
  );
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Delete Announcement (Admin) ─────────────────────────────────────────────
const deleteAnnouncement = catchAsync(async (req, res) => {
  const result = await announcementService.deleteAnnouncement(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  createAnnouncement,
  getMyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
