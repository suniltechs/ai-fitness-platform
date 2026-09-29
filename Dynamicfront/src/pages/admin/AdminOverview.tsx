import { useMemo } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/features/auth/AuthProvider";
import { useStudentStats, useApprovedStudents } from "@/hooks/useStudents";
import { useAdminAttendance } from "@/hooks/useAttendance";
import { useAllWorkouts } from "@/hooks/useWorkouts";
import { useMyAnnouncements } from "@/hooks/useAnnouncements";
import {
  Users,
  Clock,
  Layers,
  Dumbbell,
  TrendingUp,
  Megaphone,
  UserCircle,
  ClipboardList,
  FolderDown,
  ArrowUpRight,
  Activity,
  Inbox,
  Brain
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

const BAR_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-amber-400",
  "bg-pink-500",
  "bg-purple-500",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-rose-400",
];

// ─── Component ───────────────────────────────────────────────────────────────
const AdminOverview = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: sl, error: se } = useStudentStats();
  const { data: attendance, isLoading: al } = useAdminAttendance();
  const { data: workouts, isLoading: wl } = useAllWorkouts();
  const { data: announcements, isLoading: nl } = useMyAnnouncements();
  const { data: studentsData, isLoading: stl } = useApprovedStudents();

  // Derived data
  const avgAttendance = useMemo(() => {
    if (!attendance || attendance.length === 0) return 0;
    const total = attendance.reduce(
      (sum, a) => sum + a.attendancePercentage,
      0,
    );
    return Math.round(total / attendance.length);
  }, [attendance]);

  const topAttendee = useMemo(() => {
    if (!attendance || attendance.length === 0) return null;
    return attendance.reduce((best, a) =>
      a.attendancePercentage > best.attendancePercentage ? a : best,
    );
  }, [attendance]);

  const activeWorkouts = useMemo(() => {
    if (!workouts) return [];
    return workouts
      .filter((w) => !w.endDate || new Date(w.endDate) >= new Date())
      .slice(0, 5);
  }, [workouts]);

  const batchDistribution = useMemo(() => {
    const students = studentsData?.students ?? [];
    const map: Record<string, number> = {};
    for (const s of students) {
      const b = s.batch || "Unassigned";
      map[b] = (map[b] || 0) + 1;
    }
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [studentsData]);

  const maxBatchCount = batchDistribution[0]?.count ?? 1;

  const newestMembers = useMemo(() => {
    const students = studentsData?.students ?? [];
    return [...students]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [studentsData]);

  const recentAnnouncements = useMemo(
    () => (announcements ?? []).slice(0, 3),
    [announcements],
  );

  const isLoading = sl;
  if (isLoading) return <LoadingSpinner />;
  if (se) return <ErrorAlert message="Failed to load dashboard stats" />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">
          {greeting()}, <span className="text-primary">{user?.name}</span>{" "}👋
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Here's what's happening at your gym today.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — Hero Stat Cards
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: stats?.totalStudents ?? 0,
            icon: <Users className="w-5 h-5" />,
            gradient: "from-primary/20 to-primary/5",
            iconBg: "bg-primary/20 text-primary",
            border: "hover:border-primary/40",
          },
          {
            label: "Pending Approvals",
            value: stats?.pendingApprovals ?? 0,
            icon: <Clock className="w-5 h-5" />,
            gradient: "from-amber-500/20 to-amber-500/5",
            iconBg: "bg-amber-500/20 text-amber-400",
            border: "hover:border-amber-500/40",
          },
          {
            label: "Active Batches",
            value: stats?.activeBatches ?? 0,
            icon: <Layers className="w-5 h-5" />,
            gradient: "from-emerald-500/20 to-emerald-500/5",
            iconBg: "bg-emerald-500/20 text-emerald-400",
            border: "hover:border-emerald-500/40",
          },
          {
            label: "Active Workouts",
            value: activeWorkouts.length,
            icon: <Dumbbell className="w-5 h-5" />,
            gradient: "from-secondary/20 to-secondary/5",
            iconBg: "bg-secondary/20 text-secondary",
            border: "hover:border-secondary/40",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-gray-900/80 border border-gray-800 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${card.border} group`}
          >
            {/* Background gradient */}
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
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 + 3 — Attendance Ring + Activity Feed
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Attendance Ring */}
        <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
            Attendance Overview
          </h3>

          {al ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col items-center">
              {/* SVG Ring Chart */}
              <div className="relative w-40 h-40 mb-6">
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
                    stroke="url(#attendanceGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${avgAttendance * 2.64} ${264 - avgAttendance * 2.64}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="attendanceGradient"
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
                  <span className="text-3xl font-black text-white">
                    {avgAttendance}%
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                    Avg Rate
                  </span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-950/50 rounded-xl p-3 text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    Top Attendee
                  </p>
                  <p className="text-xs font-bold text-emerald-400 truncate">
                    {topAttendee?.name ?? "—"}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    {topAttendee ? `${topAttendee.attendancePercentage}%` : ""}
                  </p>
                </div>
                <div className="bg-gray-950/50 rounded-xl p-3 text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    Total Tracked
                  </p>
                  <p className="text-xs font-bold text-primary">
                    {attendance?.length ?? 0}
                  </p>
                  <p className="text-[10px] text-gray-600">Students</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workout Activity Feed */}
        <div className="lg:col-span-3 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Recent Workout Activity
            </h3>
            <Link
              to="/admin/monitoring"
              className="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {wl ? (
            <LoadingSpinner />
          ) : activeWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                No active workouts
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeWorkouts.map((w) => {
                const student =
                  typeof w.assignedTo === "object" && w.assignedTo
                    ? w.assignedTo
                    : null;
                const completion = Math.round(w.completionStatus ?? 0);
                return (
                  <div
                    key={w._id}
                    className="flex items-center gap-4 p-3 bg-gray-950/40 rounded-xl hover:bg-gray-950/60 transition-all group"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-bold text-xs shrink-0">
                      {student?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {student?.name || "Unknown Student"}
                        </p>
                        {student?.batch && (
                          <span className="text-[9px] font-bold text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full uppercase">
                            {student.batch}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
                        <span
                          className={`text-[10px] font-bold ${completion === 100 ? "text-emerald-400" : "text-gray-500"}`}
                        >
                          {completion}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-600 font-medium">
                        {w.exercises.length} exercise
                        {w.exercises.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-[10px] text-gray-700 mt-0.5">
                        {timeAgo(w.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 + 5 — Announcements + Batch Distribution
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Announcements */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Latest Announcements
            </h3>
            <Link
              to="/admin/announcements"
              className="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {nl ? (
            <LoadingSpinner />
          ) : recentAnnouncements.length === 0 ? (
            <div className="text-center py-10">
              <Inbox className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                No announcements yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((a) => (
                <div
                  key={a._id}
                  className="p-4 bg-gray-950/40 rounded-xl hover:bg-gray-950/60 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      <Megaphone className="w-2.5 h-2.5" />
                      {a.target}
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium">
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {a.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Batch Distribution */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12" />
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
            Batch Distribution
          </h3>

          {stl ? (
            <LoadingSpinner />
          ) : batchDistribution.length === 0 ? (
            <div className="text-center py-10">
              <Layers className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                No batches found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {batchDistribution.slice(0, 6).map((batch, i) => (
                <div key={batch.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-300">
                      {batch.name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      {batch.count} student{batch.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-1000 ease-out`}
                      style={{
                        width: `${(batch.count / maxBatchCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — Newest Members
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Newest Members
          </h3>
          <Link
            to="/admin/students"
            className="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {stl ? (
          <LoadingSpinner />
        ) : newestMembers.length === 0 ? (
          <div className="text-center py-8">
            <UserCircle className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">No students yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {newestMembers.map((s) => (
              <Link
                key={s._id}
                to={`/admin/students/${s._id}`}
                className="flex items-center gap-3 p-3 bg-gray-950/40 rounded-xl hover:bg-gray-950/60 hover:border-primary/30 border border-transparent transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-gray-600 truncate">
                    {s.batch || "No batch"} · {timeAgo(s.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — Quick Actions
          ══════════════════════════════════════════════════════════════════════ */}
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "AI Assistant",
              desc: "Ask Anything",
              to: "/admin/ai-assistant",
              icon: <Brain className="w-5 h-5" />,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              label: "Students",
              desc: "Manage Members",
              to: "/admin/students",
              icon: <Users className="w-5 h-5" />,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Workouts",
              desc: "Assign Plans",
              to: "/admin/workouts",
              icon: <Dumbbell className="w-5 h-5" />,
              color: "text-secondary",
              bg: "bg-secondary/10",
            },
            {
              label: "Monitoring",
              desc: "Track Progress",
              to: "/admin/monitoring",
              icon: <TrendingUp className="w-5 h-5" />,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Attendance",
              desc: "View Records",
              to: "/admin/attendance",
              icon: <ClipboardList className="w-5 h-5" />,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Announce",
              desc: "Send Updates",
              to: "/admin/announcements",
              icon: <Megaphone className="w-5 h-5" />,
              color: "text-pink-400",
              bg: "bg-pink-500/10",
            },
            {
              label: "Import",
              desc: "Bulk Upload",
              to: "/admin/import-export",
              icon: <FolderDown className="w-5 h-5" />,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:border-gray-700 hover:scale-[1.03] transition-all duration-300 group text-center"
            >
              <div
                className={`w-10 h-10 rounded-xl ${action.bg} ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                {action.icon}
              </div>
              <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
