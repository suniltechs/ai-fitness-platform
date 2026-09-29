const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const verifyToken = require("../middlewares/auth");

// GET /api/v1/exercises — Get all unique exercises (protected)
router.get("/", verifyToken, exerciseController.getExercises);

module.exports = router;
