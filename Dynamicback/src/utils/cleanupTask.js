const cron = require("node-cron");
const Workout = require("../models/Workout");

/**
 * Cleanup task to delete workout records older than 7 days.
 * Runs every day at 00:00 (midnight).
 */
const initCleanupTask = () => {
  // Cron schedule: '0 0 * * *' (At 00:00 every day)
  // For testing: '*/5 * * * * *' (Every 5 seconds)
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🧹 Running automatic workout cleanup task...");
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const result = await Workout.deleteMany({
        createdAt: { $lt: oneWeekAgo },
      });

      console.log(`✅ Cleanup successful: Deleted ${result.deletedCount} workout records older than ${oneWeekAgo.toDateString()}.`);
    } catch (error) {
      console.error("❌ Cleanup task failed:", error.message);
    }
  });

  console.log("🕒 Workout cleanup task scheduled: Every day at midnight.");
};

module.exports = initCleanupTask;
