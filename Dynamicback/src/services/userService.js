const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Diet = require("../models/Diet");
const Metric = require("../models/Metric");
const Workout = require("../models/Workout");
const Announcement = require("../models/Announcement");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const ExcelJS = require("exceljs");

// ─── Delete Student (Soft Delete) ────────────────────────────────────────────
const deleteStudent = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "student") {
    throw new ApiError(400, "Only students can be deleted");
  }

  user.isActive = false;
  await user.save();

  return {
    message: "Student deactivated successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  };
};

// ─── Reactivate Student ─────────────────────────────────────────────────────
const reactivateStudent = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "student") {
    throw new ApiError(400, "Only students can be reactivated");
  }

  user.isActive = true;
  await user.save();

  return {
    message: "Student reactivated successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  };
};

// ─── Permanent Delete Student ───────────────────────────────────────────────
const permanentDeleteStudent = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "student") {
    throw new ApiError(400, "Only students can be permanently deleted");
  }

  // Cascading delete associated records
  await Promise.all([
    Attendance.deleteMany({ studentId: userId }),
    Diet.deleteMany({ studentId: userId }),
    Metric.deleteMany({ studentId: userId }),
    Workout.deleteMany({ assignedTo: userId }),
    Announcement.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    ),
  ]);

  // Finally delete the user
  await User.findByIdAndDelete(userId);

  return {
    message: "Student and all associated records permanently deleted",
  };
};

// ─── Get All Students ────────────────────────────────────────────────────────
const getAllStudents = async ({ status, batch, gender, bloodGroup, isActive, page = 1, limit = 10, name }) => {
  const filter = { role: "student" };

  // If isActive is provided as a string "true"/"false", convert it. 
  // Otherwise default to true to show only active students.
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  } else {
    filter.isActive = true;
  }

  if (name) filter.name = { $regex: name, $options: "i" };
  if (status) filter.status = status;
  if (batch) filter.batch = batch;
  if (gender) filter.gender = gender;
  if (bloodGroup) filter.bloodGroup = bloodGroup;

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    message: "Students fetched successfully",
    data: {
      students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

// ─── Import Students from Excel ──────────────────────────────────────────────
const importStudents = async (fileBuffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new ApiError(400, "Excel file has no worksheets");
  }

  const students = [];
  const errors = [];
  const defaultPassword = "Gym@1234";
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(defaultPassword, salt);

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return; // Skip header row

    const name = row.getCell(1).value?.toString().trim();
    const email = row.getCell(2).value?.toString().trim().toLowerCase();
    const phone = row.getCell(3).value?.toString().trim();
    const batch = row.getCell(4).value?.toString().trim();

    if (!name || !email) {
      errors.push(`Row ${rowIndex}: Name and email are required`);
      return;
    }

    students.push({
      name,
      email,
      phone,
      batch,
      password: hashedPassword,
      role: "student",
      status: "pending",
      isActive: true,
    });
  });

  if (students.length === 0) {
    throw new ApiError(400, "No valid students found in file");
  }

  // Use insertMany with ordered: false to continue on duplicates
  let inserted = 0;
  try {
    const result = await User.insertMany(students, { ordered: false });
    inserted = result.length;
  } catch (err) {
    // BulkWriteError – some duplicates
    if (err.code === 11000 || err.name === "MongoBulkWriteError") {
      inserted = err.insertedDocs?.length || 0;
      errors.push("Some emails already exist and were skipped");
    } else {
      throw err;
    }
  }

  return {
    message: `Import complete. ${inserted} students added.`,
    data: {
      totalProcessed: students.length,
      inserted,
      errors,
    },
  };
};

// ─── Export Student Progress ─────────────────────────────────────────────────
const exportStudentProgress = async () => {
  const students = await User.find({
    role: "student",
    isActive: true,
  }).select("name email fatherName gender dob age height weight bloodGroup phone emergencyContact address batch entryAmount fitnessGoals");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Student Progress");

  sheet.columns = [
    { header: "Student ID", key: "id", width: 30 },
    { header: "Name", key: "name", width: 25 },
    { header: "Father's Name", key: "fatherName", width: 25 },
    { header: "Gender", key: "gender", width: 12 },
    { header: "DOB", key: "dob", width: 15 },
    { header: "Age", key: "age", width: 8 },
    { header: "Height (cm)", key: "height", width: 12 },
    { header: "Weight (kg)", key: "weight", width: 12 },
    { header: "Blood Group", key: "bloodGroup", width: 15 },
    { header: "Email", key: "email", width: 30 },
    { header: "Contact Number", key: "phone", width: 20 },
    { header: "Emergency Contact", key: "emergencyContact", width: 20 },
    { header: "Address", key: "address", width: 40 },
    { header: "Current Batch", key: "batch", width: 20 },
    { header: "Entry Amount", key: "entryAmount", width: 15 },
    { header: "Fitness Goals", key: "fitnessGoals", width: 40 },
    // { header: "Attendance %", key: "attendance", width: 15 },
    // { header: "Workout Completion %", key: "workout", width: 20 },
  ];

  // Style header row
  sheet.getRow(1).font = { bold: true };

  for (const student of students) {
    // Attendance %
    let attendancePercent = 0;
    try {
      const totalDays = await Attendance.countDocuments({
        studentId: student._id,
      });
      // Assume 30-day month as baseline
      attendancePercent =
        totalDays > 0 ? Math.round((totalDays / 30) * 100) : 0;
    } catch {
      // Attendance model may not exist yet
    }

    // Workout completion %
    let workoutPercent = 0;
    try {
      const workouts = await Workout.find({ assignedTo: student._id });
      if (workouts.length > 0) {
        const totalCompletion = workouts.reduce(
          (sum, w) => sum + (w.completionStatus || 0),
          0
        );
        workoutPercent = Math.round(totalCompletion / workouts.length);
      }
    } catch {
      // Workout model may not exist yet
    }

    // Latest weight
    let latestWeight = "N/A";
    try {
      const metric = await Metric.findOne({ studentId: student._id })
        .sort({ date: -1 })
        .limit(1);
      if (metric) latestWeight = metric.weight;
    } catch {
      // Metric model may not exist yet
    }

    sheet.addRow({
      id: student._id.toString(),
      name: student.name,
      fatherName: student.fatherName || "N/A",
      gender: student.gender || "N/A",
      dob: student.dob ? student.dob.toISOString().split("T")[0] : "N/A",
      age: student.age || "N/A",
      height: student.height || "N/A",
      weight: student.weight || latestWeight, // Prefer metric if available
      bloodGroup: student.bloodGroup || "N/A",
      email: student.email,
      phone: student.phone || "N/A",
      emergencyContact: student.emergencyContact || "N/A",
      address: student.address || "N/A",
      batch: student.batch || "N/A",
      entryAmount: student.entryAmount || 0,
      fitnessGoals: student.fitnessGoals ? student.fitnessGoals.join(", ") : "N/A",
      // attendance: attendancePercent,
      // workout: workoutPercent,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

// ─── Get Dashboard Stats ─────────────────────────────────────────────────────
const getStats = async () => {
  const [totalStudents, pendingApprovals, batches] = await Promise.all([
    User.countDocuments({ role: "student", isActive: true }),
    User.countDocuments({ role: "student", status: "pending", isActive: true }),
    User.distinct("batch", { role: "student", isActive: true, batch: { $ne: null } }),
  ]);

  return {
    totalStudents,
    pendingApprovals,
    activeBatches: batches.length,
  };
};

// ─── Get Batch Names ─────────────────────────────────────────────────────────
const getBatches = async () => {
  const batches = await User.distinct("batch", {
    role: "student",
    isActive: true,
    status: "approved",
    batch: { $ne: null },
  });

  return {
    message: "Batches fetched successfully",
    data: batches.sort(),
  };
};

// ─── Update Profile ─────────────────────────────────────────────────────────
const updateProfile = async (userId, updateData) => {
  const allowedUpdates = [
    "name",
    "profilePicture",
    "gymName",
    "address",
    "contactPhone",
  ];

  const updates = Object.keys(updateData).filter((key) =>
    allowedUpdates.includes(key)
  );

  if (updates.length === 0) {
    throw new ApiError(400, "No valid update fields provided");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  updates.forEach((update) => (user[update] = updateData[update]));
  await user.save();

  return {
    message: "Profile updated successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      gymName: user.gymName,
      address: user.address,
      contactPhone: user.contactPhone,
      phone: user.phone,
    },
  };
};

// ─── Get Single Student ──────────────────────────────────────────────────────
const getStudent = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "Student not found");
  }
  return {
    message: "Student details fetched successfully",
    data: user,
  };
};

// ─── Update Student by Admin ────────────────────────────────────────────────
const updateStudentAdmin = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Student not found");
  }

  // Define allowed fields for admin edit
  const allowedUpdates = [
    "name",
    "email",
    "phone",
    "gender",
    "fatherName",
    "dob",
    "age",
    "height",
    "weight",
    "fitnessGoals",
    "entryAmount",
    "bloodGroup",
    "emergencyContact",
    "address",
    "batch",
    "status",
  ];

  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      user[key] = updateData[key];
    }
  });

  await user.save();

  return {
    message: "Student updated successfully",
    data: user,
  };
};

module.exports = {
  deleteStudent,
  reactivateStudent,
  permanentDeleteStudent,
  getAllStudents,
  getStudent,
  updateStudentAdmin,
  importStudents,
  exportStudentProgress,
  getStats,
  getBatches,
  updateProfile,
};
