const Metric = require("../models/Metric");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

// ─── Add Metrics (Student) ───────────────────────────────────────────────────
const addMetrics = async (studentId, data) => {
  const { weight, bmi, date } = data;

  const metric = await Metric.create({
    studentId,
    weight,
    bmi,
    date: date || new Date(),
  });

  return {
    message: "Metrics added successfully",
    data: metric,
  };
};

// ─── Get My Metrics (Student) ────────────────────────────────────────────────
const getMyMetrics = async (studentId) => {
  const metrics = await Metric.find({ studentId }).sort({ date: -1 });

  // Also compute summary via aggregation
  const summary = await getMetricsSummary(studentId);

  return {
    message: "Metrics fetched successfully",
    data: {
      metrics,
      summary,
    },
  };
};

// ─── Admin View Metrics ──────────────────────────────────────────────────────
const getStudentMetrics = async (studentId) => {
  const metrics = await Metric.find({ studentId }).sort({ date: -1 });

  if (metrics.length === 0) {
    throw new ApiError(404, "No metrics found for this student");
  }

  const summary = await getMetricsSummary(studentId);

  return {
    message: "Student metrics fetched successfully",
    data: {
      metrics,
      summary,
    },
  };
};

// ─── Aggregation: Metrics Summary ────────────────────────────────────────────
const getMetricsSummary = async (studentId) => {
  const objectId = new mongoose.Types.ObjectId(studentId);

  const pipeline = [
    { $match: { studentId: objectId } },
    { $sort: { date: -1 } },
    {
      $group: {
        _id: "$studentId",
        avgBmi: { $avg: "$bmi" },
        latestWeight: { $first: "$weight" },
        latestBmi: { $first: "$bmi" },
        latestDate: { $first: "$date" },
        oldestWeight: { $last: "$weight" },
        oldestDate: { $last: "$date" },
        totalEntries: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        weightTrend: {
          $cond: {
            if: { $eq: ["$oldestWeight", 0] },
            then: 0,
            else: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ["$latestWeight", "$oldestWeight"] },
                        "$oldestWeight",
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
        avgBmi: { $round: ["$avgBmi", 1] },
        avgBmi: { $round: ["$avgBmi", 1] },
        latestStats: {
          weight: "$latestWeight",
          bmi: "$latestBmi",
          date: "$latestDate",
        },
        totalEntries: 1,
      },
    },
  ];

  const result = await Metric.aggregate(pipeline);
  return result[0] || null;
};

// ─── Delete Metrics (Student) ────────────────────────────────────────────────
const deleteMetric = async (studentId, metricId) => {
  const metric = await Metric.findOne({ _id: metricId, studentId });

  if (!metric) {
    throw new ApiError(404, "Metric record not found or unauthorized");
  }

  await Metric.findByIdAndDelete(metricId);

  return {
    message: "Metric record deleted successfully",
  };
};

module.exports = {
  addMetrics,
  getMyMetrics,
  getStudentMetrics,
  getMetricsSummary,
  deleteMetric,
};
