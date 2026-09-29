const { body } = require("express-validator");

const addMetricsValidator = [
  body("weight")
    .isFloat({ min: 1 })
    .withMessage("Weight must be a positive number"),
  body("bmi")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("BMI must be a non-negative number"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),
];

module.exports = {
  addMetricsValidator,
};
