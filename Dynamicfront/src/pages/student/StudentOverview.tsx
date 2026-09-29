import { useMemo } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/features/auth/AuthProvider";
import { useMyWorkouts } from "@/hooks/useWorkouts";
import { useMyMetrics } from "@/hooks/useMetrics";
import { useMyAttendance } from "@/hooks/useAttendance";
import { useMyAnnouncements } from "@/hooks/useAnnouncements";
import {
  Dumbbell,
  Scale,
  ClipboardList,
  Layers,
  Apple,
  TrendingUp,
  Megaphone,
  ArrowUpRight,
  TrendingDown,
  Activity,
  Calendar,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Component ───────────────────────────────────────────────────────────────
const StudentOverview = () => {
  const { user } = useAuth();
  const { data: workouts, isLoading: wl } = useMyWorkouts();
  const { data: metrics, isLoading: ml } = useMyMetrics();
  const { data: attendance, isLoading: al } = useMyAttendance();
  const { data: announcements, isLoading: nl } = useMyAnnouncements();

  // Derived data
  const stats = useMemo(() => {
    const active =
      workouts?.filter((w) => !w.endDate || new Date(w.endDate) >= new Date())
        .length ?? 0;

    const latestW = metrics?.summary?.latestStats?.weight ?? 0;
    const trend = metrics?.summary?.weightTrend ?? 0;
    const totalPresent = attendance?.length ?? 0;

    // Calculate personal attendance percentage (mock target of 30 days)
    const targetDays = 30;
    const attendanceRate = Math.min(
      Math.round((totalPresent / targetDays) * 100),
      100,
    );

    return { active, latestW, trend, totalPresent, attendanceRate };
  }, [workouts, metrics, attendance]);

  const recentWorkouts = useMemo(() => {
    return (workouts ?? [])
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [workouts]);

  const latestAnnouncements = useMemo(() => {
    return (announcements ?? []).slice(0, 2);
  }, [announcements]);

  const isLoading = wl || ml || al || nl;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {greeting()}, <span className="text-primary">{user?.name}</span>{" "}👋
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Ready to crush your fitness goals today?
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-2xl px-4 py-2 self-start md:self-auto">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      {/* ── SECTION 1 — Hero Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Workouts",
            value: stats.active,
            icon: <Dumbbell className="w-5 h-5" />,
            gradient: "from-primary/20 to-primary/5",
            iconBg: "bg-primary/20 text-primary",
            border: "hover:border-primary/40",
          },
          {
            label: "Current Weight",
            value: stats.latestW ? `${stats.latestW} kg` : "—",
            icon: <Scale className="w-5 h-5" />,
            gradient: "from-cyan-500/20 to-cyan-500/5",
            iconBg: "bg-cyan-500/20 text-cyan-400",
            border: "hover:border-cyan-500/40",
            extra: stats.trend !== 0 && (
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold ${stats.trend < 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {stats.trend < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {Math.abs(stats.trend)}kg
              </span>
            ),
          },
          {
            label: "Days Present",
            value: stats.totalPresent,
            icon: <ClipboardList className="w-5 h-5" />,
            gradient: "from-emerald-500/20 to-emerald-500/5",
            iconBg: "bg-emerald-500/20 text-emerald-400",
            border: "hover:border-emerald-500/40",
          },
          {
            label: "My Batch",
            value: user?.batch || "N/A",
            icon: <Layers className="w-5 h-5" />,
            gradient: "from-purple-500/20 to-purple-500/5",
            iconBg: "bg-purple-500/20 text-purple-400",
            border: "hover:border-purple-500/40",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-gray-900/80 border border-gray-800 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${card.border} group`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {card.label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {card.value}
                </p>
                {card.extra}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION 2 — Attendance & Workouts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Attendance Ring */}
        <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
            Monthly Consistency
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6 group">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#studentAttendanceGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.attendanceRate * 2.64} ${264 - stats.attendanceRate * 2.64}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient
                    id="studentAttendanceGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ccff00" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white group-hover:scale-110 transition-transform">
                  {stats.attendanceRate}%
                </span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                  Consistency
                </span>
              </div>
            </div>
            <div className="bg-gray-950/50 rounded-xl p-4 w-full text-center border border-gray-800/50">
              <p className="text-xs text-gray-400">
                You've been present{" "}
                <span className="text-white font-bold">
                  {stats.totalPresent}
                </span>{" "}
                days this month.
              </p>
              <Link
                to="/student/attendance"
                className="inline-flex items-center gap-1 text-[10px] text-primary font-bold uppercase mt-2 hover:underline"
              >
                View Attendance History <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Workout Progress Feed */}
        <div className="lg:col-span-3 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Your Current Workouts
            </h3>
            <Link
              to="/student/workouts"
              className="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                No workouts assigned yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkouts.map((w) => {
                const completion = Math.round(w.completionStatus ?? 0);
                return (
                  <div
                    key={w._id}
                    className="p-4 bg-gray-950/40 border border-gray-800/30 rounded-xl hover:bg-gray-950/60 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">
                            Workout Plan
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {w.exercises.length} Exercises ·{" "}
                            {timeAgo(w.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-black ${completion === 100 ? "text-emerald-400" : "text-primary"}`}
                      >
                        {completion}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.max(completion, 2)}%`,
                          background:
                            completion === 100
                              ? "#34d399"
                              : "linear-gradient(90deg, #ccff00, #00d4ff)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 3 — Announcements & Quick Nav ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Announcements */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-3xl -mr-12 -mt-12" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Announcements
            </h3>
            <Link
              to="/student/announcements"
              className="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {latestAnnouncements.length === 0 ? (
            <div className="text-center py-10">
              <Megaphone className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                Clear for now!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestAnnouncements.map((a) => (
                <div
                  key={a._id}
                  className="p-4 bg-gray-950/40 border border-gray-800/30 rounded-xl hover:bg-gray-950/60 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase text-[9px]">
                      {a.target}
                    </span>
                    <span className="text-gray-600 font-medium">
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {a.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {a.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Nav Redesigned */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Diet Log",
                to: "/student/diet",
                icon: <Apple className="w-5 h-5 text-emerald-400" />,
                bg: "bg-emerald-500/10",
                desc: "Nutrition",
              },
              {
                label: "BMI Tracker",
                to: "/student/bmi",
                icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
                bg: "bg-cyan-500/10",
                desc: "Vitals",
              },
              {
                label: "Workouts",
                to: "/student/workouts",
                icon: <Dumbbell className="w-5 h-5 text-primary" />,
                bg: "bg-primary/10",
                desc: "Training",
              },
              {
                label: "Attendance",
                to: "/student/attendance",
                icon: <ClipboardList className="w-5 h-5 text-amber-400" />,
                bg: "bg-amber-500/10",
                desc: "Check-in",
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:border-primary/30 hover:scale-[1.03] transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-[10px] text-gray-600 uppercase tracking-tighter">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
