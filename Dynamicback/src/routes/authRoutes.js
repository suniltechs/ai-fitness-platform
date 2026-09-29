const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/auth");

// POST /api/v1/auth/register
router.post("/register", authController.register);

// POST /api/v1/auth/admin-login
router.post("/admin-login", authController.adminLogin);

// POST /api/v1/auth/student-login
router.post("/student-login", authController.studentLogin);

// GET /api/v1/auth/me — Get current logged-in user
router.get("/me", verifyToken, authController.getMe);

// POST /api/v1/auth/logout
router.post("/logout", authController.logout);

// POST /api/v1/auth/change-password
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
