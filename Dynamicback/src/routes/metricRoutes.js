const express = require("express");
const router = express.Router();
const metricController = require("../controllers/metricController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const { addMetricsValidator } = require("../validators/metricValidator");

// POST /api/v1/metrics — Add metrics (student only)
router.post(
  "/",
  verifyToken,
  requireRole("student"),
  addMetricsValidator,
  validate,
  metricController.addMetrics
);

// GET /api/v1/metrics/my — Get my metrics (student only)
router.get(
  "/my",
  verifyToken,
  requireRole("student"),
  metricController.getMyMetrics
);

// GET /api/v1/metrics/:studentId — Admin view student metrics
router.get(
  "/:studentId",
  verifyToken,
  requireRole("admin"),
  metricController.getStudentMetrics
);

// DELETE /api/v1/metrics/:id — Delete metric (student only)
router.delete(
  "/:id",
  verifyToken,
  requireRole("student"),
  metricController.deleteMetric
);

module.exports = router;
