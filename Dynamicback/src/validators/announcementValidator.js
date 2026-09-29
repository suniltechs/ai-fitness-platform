const { body } = require("express-validator");

const createAnnouncementValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("message").notEmpty().withMessage("Message is required"),
  body("target")
    .isIn(["all", "batch", "individual"])
    .withMessage("Target must be 'all', 'batch', or 'individual'"),
  body("targetValue")
    .optional()
    .isString()
    .withMessage("Target value must be a string"),
];

const updateAnnouncementValidator = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("message").optional().notEmpty().withMessage("Message cannot be empty"),
];

module.exports = {
  createAnnouncementValidator,
  updateAnnouncementValidator,
};
