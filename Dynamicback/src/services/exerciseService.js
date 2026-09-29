const Exercise = require("../models/Exercise");

/**
 * Get all unique exercise names
 */
const getAllExercises = async () => {
  const exercises = await Exercise.find().sort({ name: 1 });
  return {
    message: "Exercises fetched successfully",
    data: exercises.map((e) => e.name),
  };
};

/**
 * Bulk save new exercises
 * @param {string[]} names - Array of exercise names to save
 */
const saveExercises = async (names) => {
  if (!names || names.length === 0) return;

  // Clean and deduplicate names
  const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))];

  // Bulk upsert to avoid duplicate errors
  const operations = uniqueNames.map((name) => ({
    updateOne: {
      filter: { name: new RegExp(`^${name}$`, "i") }, // Case-insensitive check
      update: { $setOnInsert: { name } },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await Exercise.bulkWrite(operations);
  }
};

module.exports = {
  getAllExercises,
  saveExercises,
};
