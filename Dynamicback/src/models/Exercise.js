const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for case-insensitive search if needed, though unique index handles most
exerciseSchema.index({ name: 1 });

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
