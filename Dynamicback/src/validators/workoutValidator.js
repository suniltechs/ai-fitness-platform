const { body } = require("express-validator");

const assignWorkoutValidator = [
  // assignedTo — optional, string or array of strings (MongoDB ObjectIds)
  body("assignedTo")
    .optional()
    .custom((value) => {
      const ids = Array.isArray(value) ? value : [value];
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      for (const id of ids) {
        if (!objectIdRegex.test(id)) {
          throw new Error(`Invalid student ID: ${id}`);
        }
      }
      return true;
    }),

  // batches — optional, string or array of strings
  body("batches")
    .optional()
    .custom((value) => {
      const names = Array.isArray(value) ? value : [value];
      for (const name of names) {
        if (typeof name !== "string" || !name.trim()) {
          throw new Error("Each batch name must be a non-empty string");
        }
      }
      return true;
    }),

  // Legacy single batch field (backwards compatible)
  body("batch")
    .optional()
    .isString()
    .withMessage("Batch must be a string"),

  body("exercises")
    .isArray({ min: 1 })
    .withMessage("At least one exercise is required"),
  body("exercises.*.name")
    .notEmpty()
    .withMessage("Exercise name is required"),
  body("exercises.*.reps")
    .isInt({ min: 1 })
    .withMessage("Reps must be a positive integer"),
  body("exercises.*.sets")
    .isInt({ min: 1 })
    .withMessage("Sets must be a positive integer"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
];

const markExerciseCompleteValidator = [
  body("exerciseName")
    .notEmpty()
    .withMessage("Exercise name is required"),
];

module.exports = {
  assignWorkoutValidator,
  markExerciseCompleteValidator,
};
