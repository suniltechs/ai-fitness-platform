const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const workoutRoutes = require("./workoutRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const metricRoutes = require("./metricRoutes");
const dietRoutes = require("./dietRoutes");
const announcementRoutes = require("./announcementRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const achievementRoutes = require("./achievementRoutes");
const testimonialRoutes = require("./testimonialRoutes");
const aiRoutes = require("./aiRoutes");
const ragRoutes = require("./ragRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/workouts", workoutRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/metrics", metricRoutes);
router.use("/diet", dietRoutes);
router.use("/announcements", announcementRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/achievements", achievementRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/ai", aiRoutes);
router.use("/rag", ragRoutes);

module.exports = router;
