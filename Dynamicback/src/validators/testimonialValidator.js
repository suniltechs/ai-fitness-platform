const { body } = require("express-validator");

const createTestimonialValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isLength({ max: 100 })
    .withMessage("Role must be at most 100 characters"),
  body("review")
    .trim()
    .notEmpty()
    .withMessage("Review is required")
    .isLength({ max: 1000 })
    .withMessage("Review must be at most 1000 characters"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

const updateStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Invalid status value"),
];

module.exports = {
  createTestimonialValidator,
  updateStatusValidator,
};
