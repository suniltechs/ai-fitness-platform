const Attendance = require("../models/Attendance");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// ─── Mark Attendance ─────────────────────────────────────────────────────────
const markAttendance = async (studentId) => {
  // Today's date at midnight
  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Check if already marked
  const existing = await Attendance.findOne({
    studentId,
    date: dateOnly,
  });

  if (existing) {
    throw new ApiError(400, "Attendance already marked for today");
  }

  const attendance = await Attendance.create({
    studentId,
    date: dateOnly,
    status: "present",
  });

  return {
    message: "Attendance marked successfully",
    data: attendance,
  };
};

// ─── Get My Attendance (Student) ─────────────────────────────────────────────
const getMyAttendance = async (studentId) => {
  const records = await Attendance.find({ studentId }).sort({ date: -1 });

  const totalDays = records.length;

  return {
    message: "Attendance records fetched successfully",
    data: {
      totalDays,
      records,
    },
  };
};

// ─── Admin Attendance Monitor ────────────────────────────────────────────────
const adminGetAttendance = async ({ batch }) => {
  // Build match filter for students
  const studentFilter = { role: "student", isActive: true };
  if (batch) {
    studentFilter.batch = { $regex: batch, $options: "i" };
  }

  const students = await User.find(studentFilter).select("name email batch");

  const result = [];

  for (const student of students) {
    const totalPresent = await Attendance.countDocuments({
      studentId: student._id,
    });

    // Calculate attendance percentage (based on 30-day baseline)
    const attendancePercentage =
      totalPresent > 0 ? Math.round((totalPresent / 30) * 100) : 0;

    result.push({
      studentId: student._id,
      name: student.name,
      email: student.email,
      batch: student.batch,
      totalPresent,
      attendancePercentage: Math.min(attendancePercentage, 100),
    });
  }

  return {
    message: "Attendance data fetched successfully",
    data: result,
  };
};

module.exports = {
  markAttendance,
  getMyAttendance,
  adminGetAttendance,
};
