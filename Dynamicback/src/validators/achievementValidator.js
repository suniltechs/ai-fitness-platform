const { body } = require("express-validator");

const createMilestoneValidator = [
  body("year")
    .trim()
    .notEmpty()
    .withMessage("Year is required")
    .isLength({ max: 10 })
    .withMessage("Year must be at most 10 characters"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be at most 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("order").optional().isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
];

const updateMilestoneValidator = [
  body("year")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Year cannot be empty")
    .isLength({ max: 10 })
    .withMessage("Year must be at most 10 characters"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title must be at most 200 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("order").optional().isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
];

module.exports = {
  createMilestoneValidator,
  updateMilestoneValidator,
};
