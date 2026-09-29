const workoutService = require("../services/workoutService");
const catchAsync = require("../utils/catchAsync");

// ─── Assign Workout (Admin) ──────────────────────────────────────────────────
const assignWorkout = catchAsync(async (req, res) => {
  const result = await workoutService.assignWorkout(req.body, req.user.userId);
  res.status(201).json({
    success: true,
    ...result,
  });
});

// ─── Get My Workouts (Student) ───────────────────────────────────────────────
const getMyWorkouts = catchAsync(async (req, res) => {
  const result = await workoutService.getMyWorkouts(req.user.userId);
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Mark Exercise Complete (Student) ────────────────────────────────────────
const markExerciseComplete = catchAsync(async (req, res) => {
  const { exerciseName } = req.body;
  const result = await workoutService.markExerciseComplete(
    req.params.id,
    req.user.userId,
    exerciseName
  );
  res.status(200).json({
    success: true,
    ...result,
  });
});

// ─── Get All Workouts (Admin) ────────────────────────────────────────────────
const getAllWorkouts = catchAsync(async (req, res) => {
  const result = await workoutService.getAllWorkouts();
  res.status(200).json({
    success: true,
    ...result,
  });
});

module.exports = {
  assignWorkout,
  getMyWorkouts,
  markExerciseComplete,
  getAllWorkouts,
};
