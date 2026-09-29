import { useMemo } from "react";
import { useAllWorkouts } from "@/hooks/useWorkouts";

interface StudentGroup {
  id: string;
  name: string;
  email: string;
  batch?: string;
  latestWorkout: any;
}

const WorkoutMonitoring = () => {
  const { data: allWorkouts, isLoading: workoutsLoading } = useAllWorkouts();

  const groupedWorkouts = useMemo(() => {
    if (!allWorkouts) return [];

    const groups: Record<string, StudentGroup> = {};

    allWorkouts.forEach((workout) => {
      const student =
        typeof workout.assignedTo === "object" ? workout.assignedTo : null;
      if (!student) return;

      const studentId = student._id;

      if (!groups[studentId]) {
        groups[studentId] = {
          id: studentId,
          name: student.name,
          email: student.email,
          batch: student.batch,
          latestWorkout: workout,
        };
      } else {
        // Keep the latest workout based on createdAt
        if (
          new Date(workout.createdAt) >
          new Date(groups[studentId].latestWorkout.createdAt)
        ) {
          groups[studentId].latestWorkout = workout;
        }
      }
    });

    return Object.values(groups).sort(
      (a, b) =>
        new Date(b.latestWorkout.createdAt).getTime() -
        new Date(a.latestWorkout.createdAt).getTime(),
    );
  }, [allWorkouts]);

  return (
    <div className="max-w-[1600px] mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Workout Monitoring
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time tracking of student progress and exercise completion.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Live Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden sm:block bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        {workoutsLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : groupedWorkouts.length === 0 ? (
          <div className="bg-gray-800/20 py-20 text-center text-gray-500 text-sm">
            No active workout sessions found.
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-950/50 border-b border-gray-800">
                  <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[35%]">
                    Student Details
                  </th>
                  <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[45%]">
                    Progress Overview
                  </th>
                  <th className="px-8 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right w-[20%]">
                    Final Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {groupedWorkouts.map((group) => {
                  const workout = group.latestWorkout;
                  const total = workout.exercises.length;
                  const done = workout.completedExercises.length;
                  const isCompleted = done === total && total > 0;
                  const isOngoing = done > 0 && done < total;

                  const statusText = isCompleted
                    ? "Completed"
                    : isOngoing
                      ? "Ongoing"
                      : "Pending";
                  const statusColor = isCompleted
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : isOngoing
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20";

                  return (
                    <tr
                      key={group.id}
                      className="hover:bg-gray-800/25 transition-all duration-200 group"
                    >
                      <td className="px-8 py-5 align-top">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-sm font-bold text-primary border border-primary/10 group-hover:border-primary/40 transition-colors">
                            {group.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                              {group.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] text-gray-500">
                                {group.batch || "Staff"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 align-top">
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                              {done} of {total} Exercises
                            </span>
                            <span
                              className={`text-[11px] font-black ${isCompleted ? "text-emerald-400" : "text-white"}`}
                            >
                              {workout.completionStatus}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/30">
                            <div
                              className={`h-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
                                isCompleted
                                  ? "bg-emerald-500"
                                  : isOngoing
                                    ? "bg-amber-500"
                                    : "bg-primary shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                              }`}
                              style={{ width: `${workout.completionStatus}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-gray-500 mt-2.5 flex items-center gap-1.5 font-medium whitespace-nowrap">
                            <span className="opacity-70">⏱️</span>
                            Started{" "}
                            {new Date(workout.createdAt).toLocaleDateString(
                              [],
                              { month: "short", day: "numeric" },
                            )}{" "}
                            at{" "}
                            {new Date(workout.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right align-top">
                        <div className="inline-flex mt-1">
                          <span
                            className={`items-center px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View (Hidden on Desktop) */}
      <div className="sm:hidden space-y-4">
        {workoutsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : groupedWorkouts.length === 0 ? (
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl py-12 text-center text-gray-500 text-sm">
            No active workout sessions found.
          </div>
        ) : (
          groupedWorkouts.map((group) => {
            const workout = group.latestWorkout;
            const total = workout.exercises.length;
            const done = workout.completedExercises.length;
            const isCompleted = done === total && total > 0;
            const isOngoing = done > 0 && done < total;

            const statusText = isCompleted
              ? "Completed"
              : isOngoing
                ? "Ongoing"
                : "Pending";
            const statusColor = isCompleted
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : isOngoing
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : "bg-primary/10 text-primary border-primary/20";

            return (
              <div
                key={group.id}
                className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 shadow-lg active:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-sm font-bold text-primary border border-primary/10">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {group.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        {group.batch || "Staff"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${statusColor}`}
                  >
                    {statusText}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Progress
                    </span>
                    <span className="text-[10px] text-white font-bold">
                      {done}/{total} Done ({workout.completionStatus}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/30">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isCompleted
                          ? "bg-emerald-500"
                          : isOngoing
                            ? "bg-amber-500"
                            : "bg-primary shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                      }`}
                      style={{ width: `${workout.completionStatus}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-600 font-medium flex items-center gap-1.5">
                    <span className="opacity-70">⏱️</span>
                    {new Date(workout.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(workout.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WorkoutMonitoring;
