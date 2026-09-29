const { Server } = require("socket.io");

let io;

/**
 * Initialize Socket.io with the HTTP server.
 * @param {import("http").Server} server
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join user-specific room for targeted notifications
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    // Join batch room
    socket.on("joinBatch", (batch) => {
      socket.join(`batch:${batch}`);
      console.log(`📦 Socket ${socket.id} joined batch: ${batch}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the Socket.io instance. Must call initSocket() first.
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  }
  return io;
};

module.exports = { initSocket, getIO };
