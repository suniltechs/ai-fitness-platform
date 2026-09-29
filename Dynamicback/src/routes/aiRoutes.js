const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const verifyToken = require("../middlewares/auth");

// POST /api/v1/ai/generate-plan — Generate AI Diet & Workout
router.post(
  "/generate-plan",
  verifyToken,
  aiController.generatePlan
);

// GET /api/v1/ai/chat/history — Get Chat History
router.get(
  "/chat/history",
  verifyToken,
  aiController.getChatHistory
);

// POST /api/v1/ai/chat/message — Send Chat Message
router.post(
  "/chat/message",
  verifyToken,
  aiController.sendMessage
);

// POST /api/v1/ai/suggest-exercises — Suggest Exercises (Admin only)
router.post(
  "/suggest-exercises",
  verifyToken,
  aiController.suggestExercises
);

// GET /api/v1/ai/admin/student-summary/:id — Get AI Student Progress Summary (Admin only)
router.get(
  "/admin/student-summary/:id",
  verifyToken,
  aiController.getStudentProgressSummary
);

// POST /api/v1/ai/diet-recommendation — Get AI Diet Recommendation (Student only)
router.post(
  "/diet-recommendation",
  verifyToken,
  aiController.recommendDiet
);

module.exports = router;
