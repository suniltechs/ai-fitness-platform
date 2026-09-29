const Announcement = require("../models/Announcement");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/email");

// Helper: get IO safely
const getIOSafe = () => {
  try {
    return require("../config/socket").getIO();
  } catch {
    return null;
  }
};

// ─── Create Announcement (Admin) ─────────────────────────────────────────────
const createAnnouncement = async (data, adminId) => {
  const { title, message, target, batches, assignedTo } = data;

  const announcement = await Announcement.create({
    title,
    message,
    target,
    batches: batches || [],
    assignedTo: assignedTo || [],
    createdBy: adminId,
  });

  // Emit Socket.io notification
  const io = getIOSafe();
  if (io) {
    if (target === "all") {
      io.emit("announcement", { title, message });
    } else {
      // Send to specific batches
      if (batches && batches.length > 0) {
        batches.forEach((batch) => {
          io.to(`batch:${batch}`).emit("announcement", { title, message });
        });
      }
      // Send to specific individuals
      if (assignedTo && assignedTo.length > 0) {
        assignedTo.forEach((userId) => {
          io.to(userId.toString()).emit("announcement", { title, message });
        });
      }
    }
  }

  // Send email notifications
  let recipients = [];
  if (target === "all") {
    recipients = await User.find({
      role: "student",
      isActive: true,
    }).select("email name");
  } else {
    const query = { role: "student", isActive: true };
    const orConditions = [];

    if (batches && batches.length > 0) {
      orConditions.push({ batch: { $in: batches } });
    }
    if (assignedTo && assignedTo.length > 0) {
      orConditions.push({ _id: { $in: assignedTo } });
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
      recipients = await User.find(query).select("email name");
    }
  }

  // Deduplicate and send
  for (const student of recipients) {
    sendEmail({
      to: student.email,
      subject: `Gym Announcement: ${title}`,
      html: `<h2>${title}</h2><p>${message}</p>`,
    });
  }

  return {
    message: "Announcement created successfully",
    data: announcement,
  };
};

// ─── Get Announcements (Student or Admin View) ──────────────────────────────
const getMyAnnouncements = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let filter = {};

  if (user.role === "student") {
    // Student: Get announcements targeted at: all, student's batch, or this specific student
    filter = {
      $or: [
        { target: "all" },
        { batches: user.batch },
        { assignedTo: userId },
      ],
    };
  } else if (user.role === "admin") {
    // Admin: Get all announcements (they manage them)
    filter = {};
  } else {
    throw new ApiError(403, "Access restricted");
  }

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

  return {
    message: "Announcements fetched successfully",
    data: announcements,
  };
};

// ─── Update Announcement (Admin) ─────────────────────────────────────────────
const updateAnnouncement = async (announcementId, data) => {
  const announcement = await Announcement.findByIdAndUpdate(
    announcementId,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  return {
    message: "Announcement updated successfully",
    data: announcement,
  };
};

// ─── Delete Announcement (Admin) ─────────────────────────────────────────────
const deleteAnnouncement = async (announcementId) => {
  const announcement = await Announcement.findByIdAndDelete(announcementId);

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  return {
    message: "Announcement deleted successfully",
  };
};

module.exports = {
  createAnnouncement,
  getMyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
