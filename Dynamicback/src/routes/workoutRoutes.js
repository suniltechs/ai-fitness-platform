const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const validate = require("../middlewares/validate");
const {
  assignWorkoutValidator,
  markExerciseCompleteValidator,
} = require("../validators/workoutValidator");

// GET /api/v1/workouts — Get all workouts (admin only)
router.get("/", verifyToken, requireRole("admin"), workoutController.getAllWorkouts);

// POST /api/v1/workouts — Assign workout (admin only)
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  assignWorkoutValidator,
  validate,
  workoutController.assignWorkout
);

// GET /api/v1/workouts/my — Get my workouts (student only)
router.get(
  "/my",
  verifyToken,
  requireRole("student"),
  workoutController.getMyWorkouts
);

// PATCH /api/v1/workouts/:id/complete — Mark exercise complete (student only)
router.patch(
  "/:id/complete",
  verifyToken,
  requireRole("student"),
  markExerciseCompleteValidator,
  validate,
  workoutController.markExerciseComplete
);

module.exports = router;
