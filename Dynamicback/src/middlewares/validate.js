const { validationResult } = require("express-validator");

/**
 * Middleware: Run express-validator checks and return 400 on failure.
 * Usage: router.post("/", [...validationRules], validate, controller.handler)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
