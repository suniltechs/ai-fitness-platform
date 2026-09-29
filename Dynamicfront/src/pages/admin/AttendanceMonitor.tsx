import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAdminAttendance } from "@/hooks/useAttendance";

const AttendanceMonitor = () => {
  const [batch, setBatch] = useState<string>("");
  const { data, isLoading, error } = useAdminAttendance(batch || undefined);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Attendance Monitor</h2>
      <p className="text-gray-400 mb-6">
        Track student attendance across batches.
      </p>

      {/* Batch Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by batch name..."
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-sm"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Failed to load attendance data" />}

      {data && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Student
                </th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Batch
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Days Present
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr
                  key={record._id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
                >
                  <td className="px-4 py-3 font-medium">{record.name}</td>
                  <td className="px-4 py-3 text-gray-400">{record.email}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {record.batch || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {record.totalPresent}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.attendancePercentage >= 75
                          ? "bg-emerald-500/20 text-emerald-400"
                          : record.attendancePercentage >= 50
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {record.attendancePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No attendance data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceMonitor;
