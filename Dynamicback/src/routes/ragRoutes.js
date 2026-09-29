const express = require("express");
const router = express.Router();
const ragController = require("../controllers/ragController");
const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

// All RAG endpoints require authentication + admin role
router.use(verifyToken);
router.use(requireRole("admin"));

// POST /api/v1/rag/ask — Ask a natural language question
router.post("/ask", ragController.ask);

// GET /api/v1/rag/history — Get conversation history
router.get("/history", ragController.getHistory);

// DELETE /api/v1/rag/history — Clear conversation history
router.delete("/history", ragController.clearHistory);

module.exports = router;
