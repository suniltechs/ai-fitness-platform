const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    calories: {
      type: Number,
      required: [true, "Calories are required"],
      min: 0,
    },
    protein: {
      type: Number,
      required: [true, "Protein is required"],
      min: 0,
    },
    carbs: {
      type: Number,
      required: [true, "Carbs are required"],
      min: 0,
    },
    fat: {
      type: Number,
      required: [true, "Fat is required"],
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

dietSchema.index({ studentId: 1, date: -1 });

const Diet = mongoose.model("Diet", dietSchema);

module.exports = Diet;
