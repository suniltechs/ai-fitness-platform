import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { useMyAttendance, useMarkAttendance } from "@/hooks/useAttendance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { PartyPopper, CheckCircle2, Check, BarChart2 } from "lucide-react";

const MyAttendance = () => {
  const { data: attendance, isLoading, error } = useMyAttendance();
  const markAttendance = useMarkAttendance();

  const handleMarkToday = () => {
    markAttendance.mutate(undefined, {
      onSuccess: () =>
        toast.success(
          <div className="flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-emerald-400" />
            <span>Attendance marked for today!</span>
          </div>,
        ),
      onError: (err: any) =>
        toast.error(
          err?.response?.data?.message || "Failed to mark attendance",
        ),
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load attendance" />;

  // Build monthly chart data
  const monthMap = new Map<string, number>();
  attendance?.forEach((record) => {
    const month = new Date(record.date).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    monthMap.set(month, (monthMap.get(month) || 0) + 1);
  });

  const chartData = Array.from(monthMap.entries()).map(([month, count]) => ({
    month,
    days: count,
  }));

  // Check if already marked today
  const today = new Date().toISOString().split("T")[0];
  const markedToday = attendance?.some((r) => r.date.split("T")[0] === today);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">My Attendance</h2>
      <p className="text-gray-400 mb-6">Your gym attendance history.</p>

      {/* Mark Today */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Today's Attendance</h3>
          <p className="text-sm text-gray-400 mt-1">
            {markedToday ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                You've already marked attendance today!
              </span>
            ) : (
              "Mark your attendance for today's gym session."
            )}
          </p>
        </div>
        <button
          onClick={handleMarkToday}
          disabled={markedToday || markAttendance.isPending}
          className={`px-6 py-2.5 rounded-lg font-medium transition ${
            markedToday
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {markAttendance.isPending ? (
            "Marking..."
          ) : markedToday ? (
            <span className="flex items-center gap-1.5">
              Marked <Check className="w-4 h-4" />
            </span>
          ) : (
            "Mark Present"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Monthly Attendance
            </h3>
            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Trend Analysis
              </span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="attendanceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />
                <XAxis
                  dataKey="month"
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
                  cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-950/90 backdrop-blur-md border border-gray-800 px-4 py-3 rounded-xl shadow-2xl">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">
                            {payload[0].payload.month}
                          </p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-white">
                              {payload[0].value}
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              Days
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="days"
                  fill="url(#attendanceGradient)"
                  radius={[6, 6, 2, 2]}
                  barSize={32}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <BarChart2 className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                No attendance data yet.
              </p>
            </div>
          )}
        </div>

        {/* Recent History */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent History</h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {attendance?.slice(0, 20).map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
              >
                <span className="text-sm">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  Present
                </span>
              </div>
            ))}
            {(!attendance || attendance.length === 0) && (
              <p className="text-gray-500 text-sm">No records yet.</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              Total Days:{" "}
              <span className="text-white font-bold">
                {attendance?.length ?? 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
