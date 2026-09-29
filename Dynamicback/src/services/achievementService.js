const { Milestone, GalleryImage } = require("../models/Achievement");
const cloudinary = require("../config/cloudinary");

// ─── Milestones ──────────────────────────────────────────────────────────────

const createMilestone = async (data, userId) => {
  const count = await Milestone.countDocuments();
  const milestone = await Milestone.create({
    ...data,
    order: data.order ?? count,
    createdBy: userId,
  });
  return { message: "Milestone created successfully", milestone };
};

const getAllMilestones = async () => {
  const milestones = await Milestone.find().sort({ order: 1 });
  return { milestones };
};

const updateMilestone = async (id, data) => {
  const milestone = await Milestone.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!milestone) throw new Error("Milestone not found");
  return { message: "Milestone updated successfully", milestone };
};

const deleteMilestone = async (id) => {
  const milestone = await Milestone.findByIdAndDelete(id);
  if (!milestone) throw new Error("Milestone not found");
  return { message: "Milestone deleted successfully" };
};

// ─── Gallery ─────────────────────────────────────────────────────────────────

const uploadGalleryImage = async (file, caption, userId) => {
  // Upload buffer to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "dynamic-gym/gallery",
        transformation: [
          { width: 800, height: 600, crop: "fill", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  const count = await GalleryImage.countDocuments();
  const image = await GalleryImage.create({
    imageUrl: result.secure_url,
    publicId: result.public_id,
    caption: caption || "",
    order: count,
    createdBy: userId,
  });

  return { message: "Image uploaded successfully", image };
};

const getAllGalleryImages = async () => {
  const images = await GalleryImage.find().sort({ order: 1 });
  return { images };
};

const deleteGalleryImage = async (id) => {
  const image = await GalleryImage.findById(id);
  if (!image) throw new Error("Gallery image not found");

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(image.publicId);

  await GalleryImage.findByIdAndDelete(id);
  return { message: "Image deleted successfully" };
};

module.exports = {
  createMilestone,
  getAllMilestones,
  updateMilestone,
  deleteMilestone,
  uploadGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
};
