const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [1, "Weight must be positive"],
    },
    bmi: {
      type: Number,
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

metricSchema.index({ studentId: 1, date: -1 });

const Metric = mongoose.model("Metric", metricSchema);

module.exports = Metric;
