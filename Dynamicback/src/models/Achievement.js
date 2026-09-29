const mongoose = require("mongoose");

// ─── Milestone Schema ─────────────────────────────────────────────────────────
const milestoneSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

milestoneSchema.index({ order: 1 });

// ─── Gallery Image Schema ─────────────────────────────────────────────────────
const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

galleryImageSchema.index({ order: 1 });

const Milestone = mongoose.model("Milestone", milestoneSchema);
const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);

module.exports = { Milestone, GalleryImage };
