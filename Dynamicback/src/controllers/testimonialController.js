const testimonialService = require("../services/testimonialService");
const catchAsync = require("../utils/catchAsync");

const createTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialService.createTestimonial(req.body, req.file);
  res.status(201).json({
    success: true,
    ...result,
  });
});

const getPublicTestimonials = catchAsync(async (req, res) => {
  const result = await testimonialService.getPublicTestimonials();
  res.status(200).json({
    success: true,
    ...result,
  });
});

const getAllTestimonials = catchAsync(async (req, res) => {
  const result = await testimonialService.getAllTestimonials();
  res.status(200).json({
    success: true,
    ...result,
  });
});

const updateTestimonialStatus = catchAsync(async (req, res) => {
  const result = await testimonialService.updateTestimonialStatus(
    req.params.id,
    req.body.status
  );
  res.status(200).json({
    success: true,
    ...result,
  });
});

const deleteTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialService.deleteTestimonial(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  createTestimonial,
  getPublicTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
};
