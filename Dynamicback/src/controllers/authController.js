const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

// ─── Cookie options ─────────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Register Student ───────────────────────────────────────────────────────
const register = catchAsync(async (req, res) => {
  const result = await authService.registerStudent(req.body);

  if (result.token) {
    res.cookie("token", result.token, cookieOptions);
  }

  res.status(201).json({
    success: true,
    user: result.user,
    message: result.message,
  });
});

// ─── Admin Login ────────────────────────────────────────────────────────────
const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.adminLogin(email, password);

  res.cookie("token", result.token, cookieOptions);

  res.status(200).json({
    success: true,
    user: result.user,
  });
});

// ─── Student Login ──────────────────────────────────────────────────────────
const studentLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.studentLogin(email, password);

  res.cookie("token", result.token, cookieOptions);

  res.status(200).json({
    success: true,
    user: result.user,
  });
});

// ─── Get Current User ───────────────────────────────────────────────────────
const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.userId);
  res.status(200).json({
    success: true,
    user,
  });
});

// ─── Logout ─────────────────────────────────────────────────────────────────
const logout = catchAsync(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ─── Change Password ────────────────────────────────────────────────────────
const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    req.user.userId,
    oldPassword,
    newPassword
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  register,
  adminLogin,
  studentLogin,
  getMe,
  logout,
  changePassword,
};
