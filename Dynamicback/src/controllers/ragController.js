const ragService = require("../services/ragService");
const ApiError = require("../utils/ApiError");

/**
 * POST /api/v1/rag/ask
 * Process a natural language question from the admin using RAG
 */
exports.ask = async (req, res, next) => {
  try {
    const { question } = req.body;
    const adminId = req.user.userId;

    if (!question || !question.trim()) {
      return next(new ApiError(400, "Question cannot be empty"));
    }

    if (!process.env.GEMINI_API_KEY) {
      return next(new ApiError(500, "AI service is not configured (missing API key)."));
    }

    const result = await ragService.processQuestion(adminId, question.trim());

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/rag/history
 * Get RAG conversation history for the current admin
 */
exports.getHistory = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const history = await ragService.getHistory(adminId);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/rag/history
 * Clear RAG conversation history for the current admin
 */
exports.clearHistory = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const deletedCount = await ragService.clearHistory(adminId);

    res.status(200).json({
      success: true,
      message: `Cleared ${deletedCount} conversation(s)`,
    });
  } catch (error) {
    next(error);
  }
};
