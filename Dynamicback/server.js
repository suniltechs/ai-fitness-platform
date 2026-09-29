require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const routes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");
const { initSocket } = require("./src/config/socket");
const initCleanupTask = require("./src/utils/cleanupTask");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ─── Global Middlewares ─────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running 🚀" });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.all("/{*splat}", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    // Initialize Socket.io
    initSocket(server);

    // Initialize Cleanup Tasks
    initCleanupTask();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 Socket.io ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
