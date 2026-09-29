import { useState, type FormEvent } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { useMyMetrics, useAddMetric } from "@/hooks/useMetrics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { Scale } from "lucide-react";

const MyMetrics = () => {
  const { data, isLoading, error } = useMyMetrics();
  const addMetric = useAddMetric();

  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addMetric.mutate(
      {
        weight: Number(weight),
        ...(bmi && { bmi: Number(bmi) }),
      },
      {
        onSuccess: () => {
          toast.success("Metrics recorded!");
          setWeight("");
          setBmi("");
        },
        onError: () => toast.error("Failed to save metrics"),
      },
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load metrics" />;

  const chartData =
    data?.metrics
      ?.slice()
      .reverse()
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weight: entry.weight,
        bmi: entry.bmi,
      })) ?? [];

  const summary = data?.summary;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Body Metrics</h2>
      <p className="text-gray-400 mb-6">Track your weight and BMI over time.</p>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Current Weight</p>
            <p className="text-xl font-bold text-cyan-400 mt-1">
              {summary.latestStats?.weight ?? "—"} kg
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Avg BMI</p>
            <p className="text-xl font-bold text-primary mt-1">
              {summary.avgBmi ?? "—"}
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Weight Trend</p>
            <p
              className={`text-xl font-bold mt-1 ${
                (summary.weightTrend ?? 0) <= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {summary.weightTrend > 0 ? "+" : ""}
              {summary.weightTrend?.toFixed(1) ?? "—"}%
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Entries</p>
            <p className="text-xl font-bold text-purple-400 mt-1">
              {summary.totalEntries ?? 0}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Charts */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Weight Trend
            </h3>
            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Body Progress
              </span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="weightGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-950/90 backdrop-blur-md border border-gray-800 px-4 py-3 rounded-xl shadow-2xl">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-2">
                            {payload[0].payload.date}
                          </p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-xs text-gray-400">
                                Weight
                              </span>
                              <span className="text-sm font-black text-cyan-400">
                                {payload[0].value} kg
                              </span>
                            </div>
                            {payload[1]?.value && (
                              <div className="flex items-center justify-between gap-4 border-t border-gray-800 pt-1.5">
                                <span className="text-xs text-gray-400">
                                  BMI
                                </span>
                                <span className="text-sm font-black text-purple-400">
                                  {payload[1].value}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGradient)"
                  activeDot={{
                    r: 6,
                    stroke: "#06b6d4",
                    strokeWidth: 2,
                    fill: "#111827",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bmi"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                  activeDot={{ r: 4, fill: "#8b5cf6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Scale className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                No data yet. Log your first metric!
              </p>
            </div>
          )}
        </div>

        {/* Add Metric Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Log New Entry</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  BMI
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={addMetric.isPending}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-medium rounded-lg transition"
            >
              {addMetric.isPending ? "Saving..." : "Log Metrics"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyMetrics;
