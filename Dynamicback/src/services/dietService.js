const Diet = require("../models/Diet");
const mongoose = require("mongoose");

// ─── Add Daily Diet (Student) ────────────────────────────────────────────────
const addDiet = async (studentId, data) => {
  const { calories, protein, carbs, fat, date } = data;

  const diet = await Diet.create({
    studentId,
    calories,
    protein,
    carbs,
    fat,
    date: date || new Date(),
  });

  return {
    message: "Diet log added successfully",
    data: diet,
  };
};

// ─── Get My Diet Logs (Student) ──────────────────────────────────────────────
const getMyDiet = async (studentId) => {
  const logs = await Diet.find({ studentId }).sort({ date: -1 });

  return {
    message: "Diet logs fetched successfully",
    data: logs,
  };
};

// ─── Macro Summary (Aggregation) ─────────────────────────────────────────────
const getMacroSummary = async (studentId) => {
  const objectId = new mongoose.Types.ObjectId(studentId);

  const pipeline = [
    { $match: { studentId: objectId } },
    {
      $group: {
        _id: "$studentId",
        avgCalories: { $avg: "$calories" },
        avgProtein: { $avg: "$protein" },
        avgCarbs: { $avg: "$carbs" },
        avgFat: { $avg: "$fat" },
        totalEntries: { $sum: 1 },
        totalProteinGrams: { $sum: "$protein" },
        totalCarbsGrams: { $sum: "$carbs" },
        totalFatGrams: { $sum: "$fat" },
      },
    },
    {
      $project: {
        _id: 0,
        avgCalories: { $round: ["$avgCalories", 0] },
        avgProtein: { $round: ["$avgProtein", 1] },
        avgCarbs: { $round: ["$avgCarbs", 1] },
        avgFat: { $round: ["$avgFat", 1] },
        totalEntries: 1,
        macroPercentages: {
          $let: {
            vars: {
              totalCalFromMacros: {
                $add: [
                  { $multiply: ["$totalProteinGrams", 4] }, // 4 cal/g protein
                  { $multiply: ["$totalCarbsGrams", 4] }, // 4 cal/g carbs
                  { $multiply: ["$totalFatGrams", 9] }, // 9 cal/g fat
                ],
              },
            },
            in: {
              protein: {
                $cond: {
                  if: { $eq: ["$$totalCalFromMacros", 0] },
                  then: 0,
                  else: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              { $multiply: ["$totalProteinGrams", 4] },
                              "$$totalCalFromMacros",
                            ],
                          },
                          100,
                        ],
                      },
                      1,
                    ],
                  },
                },
              },
              carbs: {
                $cond: {
                  if: { $eq: ["$$totalCalFromMacros", 0] },
                  then: 0,
                  else: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              { $multiply: ["$totalCarbsGrams", 4] },
                              "$$totalCalFromMacros",
                            ],
                          },
                          100,
                        ],
                      },
                      1,
                    ],
                  },
                },
              },
              fat: {
                $cond: {
                  if: { $eq: ["$$totalCalFromMacros", 0] },
                  then: 0,
                  else: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              { $multiply: ["$totalFatGrams", 9] },
                              "$$totalCalFromMacros",
                            ],
                          },
                          100,
                        ],
                      },
                      1,
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  ];

  const result = await Diet.aggregate(pipeline);

  return {
    message: "Macro summary fetched successfully",
    data: result[0] || null,
  };
};

module.exports = {
  addDiet,
  getMyDiet,
  getMacroSummary,
};
