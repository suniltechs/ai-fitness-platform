const mongoose = require("mongoose");

const ragConversationSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    generatedQuery: {
      collection: { type: String, default: null },
      operation: { type: String, default: null },
      pipeline: { type: mongoose.Schema.Types.Mixed, default: null },
    },
    queryResults: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    sources: [
      {
        collection: { type: String },
        count: { type: Number, default: 0 },
        _id: false,
      },
    ],
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ragConversationSchema.index({ adminId: 1, createdAt: -1 });

const RagConversation = mongoose.model("RagConversation", ragConversationSchema);

module.exports = RagConversation;
