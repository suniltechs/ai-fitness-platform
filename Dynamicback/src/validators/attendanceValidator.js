const { query } = require("express-validator");

const adminAttendanceValidator = [
  query("batch").optional().isString().withMessage("Batch must be a string"),
];

module.exports = {
  adminAttendanceValidator,
};
