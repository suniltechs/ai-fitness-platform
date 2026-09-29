const Workout = require("../models/Workout");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { getIO } = require("../config/socket");
const sendEmail = require("../utils/email");

const exerciseService = require("../services/exerciseService");

// ─── Assign Workout ──────────────────────────────────────────────────────────
const assignWorkout = async (data, adminId) => {
  const { assignedTo, batches, batch, exercises, startDate, endDate } = data;

  // Auto-save exercise names to the exercises collection
  if (exercises && Array.isArray(exercises)) {
    const exerciseNames = exercises.map((ex) => ex.name);
    exerciseService.saveExercises(exerciseNames).catch((err) => {
      console.error("Error saving exercises:", err);
    });
  }

  // Normalize inputs — accept single values or arrays
  const studentIds = assignedTo
    ? Array.isArray(assignedTo) ? assignedTo : [assignedTo]
    : [];
  const batchNames = batches
    ? Array.isArray(batches) ? batches : [batches]
    : batch
      ? [batch]
      : [];

  if (studentIds.length === 0 && batchNames.length === 0) {
    throw new ApiError(400, "Either assignedTo (studentId) or batches is required");
  }

  // Collect all target student IDs (Set for deduplication)
  const targetStudentIds = new Set(studentIds.map((id) => id.toString()));

  // Resolve batch names → student IDs
  if (batchNames.length > 0) {
    const batchStudents = await User.find({
      role: "student",
      batch: { $in: batchNames },
      isActive: true,
      status: "approved",
    }).select("_id");

    if (batchStudents.length === 0 && studentIds.length === 0) {
      throw new ApiError(404, "No approved students found in the selected batch(es)");
    }

    for (const s of batchStudents) {
      targetStudentIds.add(s._id.toString());
    }
  }

  // Validate individually selected students exist
  if (studentIds.length > 0) {
    const foundStudents = await User.find({
      _id: { $in: studentIds },
      role: "student",
    }).select("_id");

    if (foundStudents.length !== studentIds.length) {
      throw new ApiError(404, "One or more selected students not found");
    }
  }

  // Create one workout per unique student
  const workoutsToCreate = Array.from(targetStudentIds).map((sid) => ({
    assignedTo: sid,
    assignedBy: adminId,
    exercises,
    startDate,
    endDate,
  }));

  const workouts = await Workout.insertMany(workoutsToCreate);

  // Emit Socket.io notification
  try {
    const io = getIO();
    for (const w of workouts) {
      io.to(w.assignedTo.toString()).emit("workoutAssigned", {
        message: "New workout assigned to you",
        workoutId: w._id,
      });
    }
  } catch {
    // Socket.io may not be initialized in tests
  }

  // Send email notifications
  for (const w of workouts) {
    try {
      const student = await User.findById(w.assignedTo);
      if (student?.email) {
        sendEmail({
          to: student.email,
          subject: "New Workout Assigned",
          html: `<h2>Hello ${student.name},</h2><p>A new workout has been assigned to you. Check your dashboard for details.</p>`,
        });
      }
    } catch {
      // Email is best-effort
    }
  }

  return {
    message: `${workouts.length} workout(s) assigned successfully`,
    data: workouts,
  };
};

// ─── Get My Workouts (Student) ───────────────────────────────────────────────
const getMyWorkouts = async (studentId) => {
  const workouts = await Workout.find({ assignedTo: studentId })
    .populate("assignedBy", "name email")
    .sort({ createdAt: -1 });

  return {
    message: "Workouts fetched successfully",
    data: workouts,
  };
};

// ─── Mark Exercise Complete ──────────────────────────────────────────────────
const markExerciseComplete = async (workoutId, studentId, exerciseName) => {
  const workout = await Workout.findOne({
    _id: workoutId,
    assignedTo: studentId,
  });

  if (!workout) {
    throw new ApiError(404, "Workout not found or not assigned to you");
  }

  // Check exercise exists in the workout
  const exerciseExists = workout.exercises.some((e) => e.name === exerciseName);
  if (!exerciseExists) {
    throw new ApiError(400, `Exercise '${exerciseName}' not found in this workout`);
  }

  // Prevent duplicate completion
  if (workout.completedExercises.includes(exerciseName)) {
    throw new ApiError(400, `Exercise '${exerciseName}' is already marked as complete`);
  }

  workout.completedExercises.push(exerciseName);

  // Update completion percentage
  workout.completionStatus = Math.round(
    (workout.completedExercises.length / workout.exercises.length) * 100
  );

  if (workout.completionStatus === 100) {
    workout.endDate = new Date();
  }

  await workout.save();

  return {
    message: `Exercise '${exerciseName}' marked as complete`,
    data: {
      completedExercises: workout.completedExercises,
      completionStatus: workout.completionStatus,
      totalExercises: workout.exercises.length,
    },
  };
};

// ─── Get All Workouts (Admin) ───────────────────────────────────────────────
const getAllWorkouts = async () => {
  const workouts = await Workout.find()
    .populate("assignedTo", "name email batch")
    .populate("assignedBy", "name")
    .sort({ createdAt: -1 })
    .limit(50); // Limit to recent 50 for performance

  return {
    message: "All workouts fetched successfully",
    data: workouts,
  };
};

module.exports = {
  assignWorkout,
  getMyWorkouts,
  markExerciseComplete,
  getAllWorkouts,
};
