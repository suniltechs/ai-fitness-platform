const { query } = require("express-validator");

const getAllStudentsValidator = [
  query("status")
    .optional()
    .isIn(["pending", "approved"])
    .withMessage("Status must be 'pending' or 'approved'"),
  query("batch").optional().isString().withMessage("Batch must be a string"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

module.exports = {
  getAllStudentsValidator,
};
