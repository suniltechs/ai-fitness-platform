const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
    },
    reps: {
      type: Number,
      required: [true, "Reps are required"],
      min: 1,
    },
    sets: {
      type: Number,
      required: [true, "Sets are required"],
      min: 1,
    },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    batch: {
      type: String,
      default: null,
      trim: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercises: {
      type: [exerciseSchema],
      required: [true, "At least one exercise is required"],
      validate: [(val) => val.length > 0, "At least one exercise is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: false,
    },
    completionStatus: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedExercises: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient student workout queries
workoutSchema.index({ assignedTo: 1, startDate: -1 });
workoutSchema.index({ batch: 1, startDate: -1 });

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
