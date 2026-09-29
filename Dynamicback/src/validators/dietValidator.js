const { body } = require("express-validator");

const addDietValidator = [
  body("calories")
    .isFloat({ min: 0 })
    .withMessage("Calories must be a non-negative number"),
  body("protein")
    .isFloat({ min: 0 })
    .withMessage("Protein must be a non-negative number"),
  body("carbs")
    .isFloat({ min: 0 })
    .withMessage("Carbs must be a non-negative number"),
  body("fat")
    .isFloat({ min: 0 })
    .withMessage("Fat must be a non-negative number"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),
];

module.exports = {
  addDietValidator,
};
