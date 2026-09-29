const Testimonial = require("../models/Testimonial");
const cloudinary = require("../config/cloudinary");

const createTestimonial = async (data, file) => {
  let imageUrl = "";
  let publicId = "";

  if (file) {
    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "dynamic-gym/testimonials",
          transformation: [
            { width: 400, height: 400, crop: "fill", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    imageUrl = result.secure_url;
    publicId = result.public_id;
  }

  const testimonial = await Testimonial.create({
    ...data,
    imageUrl,
    publicId,
  });

  return { message: "Testimonial submitted successfully", testimonial };
};

const getPublicTestimonials = async () => {
  const testimonials = await Testimonial.find({ status: "approved" }).sort({
    order: 1,
    createdAt: -1,
  });
  return { testimonials };
};

const getAllTestimonials = async () => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  return { testimonials };
};

const updateTestimonialStatus = async (id, status) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!testimonial) throw new Error("Testimonial not found");
  return { message: `Testimonial ${status} successfully`, testimonial };
};

const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) throw new Error("Testimonial not found");

  if (testimonial.publicId) {
    await cloudinary.uploader.destroy(testimonial.publicId);
  }

  await Testimonial.findByIdAndDelete(id);
  return { message: "Testimonial deleted successfully" };
};

module.exports = {
  createTestimonial,
  getPublicTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
};
