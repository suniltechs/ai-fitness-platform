const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: () => {
        // Store date-only (midnight UTC)
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      },
    },
    status: {
      type: String,
      enum: ["present"],
      default: "present",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one attendance record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
