const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const config = require("../config");

// ─── Helper: Generate JWT ───────────────────────────────────────────────────
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

// ─── Register Student ───────────────────────────────────────────────────────
const registerStudent = async (data) => {
  const {
    name,
    email,
    password,
    phone,
    batch,
    gender,
    fatherName,
    dob,
    age,
    height,
    weight,
    fitnessGoals,
    entryAmount,
    bloodGroup,
    emergencyContact,
    address,
  } = data;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  // Create student with default role & status
  const user = await User.create({
    name,
    email,
    password,
    phone,
    batch,
    gender,
    fatherName,
    dob,
    age,
    height,
    weight,
    fitnessGoals,
    entryAmount,
    bloodGroup,
    emergencyContact,
    address,
    role: "student",
    status: "pending",
  });

  const token = generateToken(user);

  return {
    message: "Registration submitted. Await admin approval.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

// ─── Admin Login ────────────────────────────────────────────────────────────
const adminLogin = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "No user found with this email");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  if (user.isActive === false) {
    throw new ApiError(403, "ACCOUNT_DEACTIVATED");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// ─── Student Login ──────────────────────────────────────────────────────────
const studentLogin = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "No user found with this email");
  }

  if (user.role !== "student") {
    throw new ApiError(403, "Access denied. Students only.");
  }

  if (user.isActive === false) {
    throw new ApiError(403, "ACCOUNT_DEACTIVATED");
  }

  // NOTE: We allow pending students to login so they can see the "Waiting for Approval" page
  // if (user.status === "pending") {
  //   throw new ApiError(403, "Awaiting admin approval");
  // }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      batch: user.batch,
    },
  };
};

// ─── Approve Student ────────────────────────────────────────────────────────
const approveStudent = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "student") {
    throw new ApiError(400, "Only students can be approved");
  }

  if (user.status === "approved") {
    throw new ApiError(400, "Student is already approved");
  }

  user.status = "approved";
  await user.save();

  // Emit Socket.io notification to the student
  try {
    const io = require("../config/socket").getIO();
    io.to(userId.toString()).emit("statusUpdated", {
      status: "approved",
      message: "Your account has been approved!",
    });
  } catch (error) {
    console.warn("Socket.io not available for approval notification");
  }

  return {
    message: "Student approved successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    },
  };
};

// ─── Get Current User ───────────────────────────────────────────────────────
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isActive === false) {
    throw new ApiError(403, "ACCOUNT_DEACTIVATED");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    batch: user.batch,
    profilePicture: user.profilePicture,
    gymName: user.gymName,
    address: user.address,
    contactPhone: user.contactPhone,
    phone: user.phone,
    gender: user.gender,
    fatherName: user.fatherName,
    dob: user.dob,
    age: user.age,
    height: user.height,
    weight: user.weight,
    fitnessGoals: user.fitnessGoals,
    entryAmount: user.entryAmount,
    bloodGroup: user.bloodGroup,
    emergencyContact: user.emergencyContact,
  };
};

// ─── Change Password ────────────────────────────────────────────────────────
const changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Invalid current password");
  }

  user.password = newPassword;
  await user.save();

  return {
    message: "Password changed successfully",
  };
};

module.exports = {
  registerStudent,
  adminLogin,
  studentLogin,
  approveStudent,
  getMe,
  changePassword,
};
