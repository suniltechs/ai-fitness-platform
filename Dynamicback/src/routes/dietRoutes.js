const express = require("express");
const router = express.Router();
const dietController = require("../controllers/dietController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const { addDietValidator } = require("../validators/dietValidator");

// POST /api/v1/diet — Add daily diet (student only)
router.post(
  "/",
  verifyToken,
  requireRole("student"),
  addDietValidator,
  validate,
  dietController.addDiet
);

// GET /api/v1/diet/my — Get my diet logs (student only)
router.get(
  "/my",
  verifyToken,
  requireRole("student"),
  dietController.getMyDiet
);

// GET /api/v1/diet/macros — Get macro summary (student only)
router.get(
  "/macros",
  verifyToken,
  requireRole("student"),
  dietController.getMacroSummary
);

module.exports = router;
