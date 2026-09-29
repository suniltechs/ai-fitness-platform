const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    target: {
      type: String,
      enum: ["all", "batch", "individual", "both"],
      required: [true, "Target is required"],
    },
    batches: [
      {
        type: String,
        trim: true,
      },
    ],
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    targetValue: {
      type: String,
      trim: true,
      default: null,
      // Deprecated: used for single batch/student previously
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ target: 1, createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
