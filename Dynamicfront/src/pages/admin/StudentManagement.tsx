import { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import {
  ChevronRight,
  Trash2,
  RefreshCcw,
  AlertTriangle,
  Search,
} from "lucide-react";
import {
  useStudents,
  useApproveStudent,
  useDeleteStudent,
  useReactivateStudent,
  usePermanentDeleteStudent,
} from "@/hooks/useStudents";
import toast from "react-hot-toast";

const StudentManagement = () => {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [isActive, setIsActive] = useState<string>("true");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useStudents({
    name: nameSearch,
    status,
    batch,
    gender,
    bloodGroup,
    isActive,
    page,
    limit: 10,
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const batches = ["Morning 6AM", "Morning 8AM", "Evening 5PM", "Evening 7PM"];
  const genders = ["Male", "Female", "Others"];

  const approveMutation = useApproveStudent();
  const deleteMutation = useDeleteStudent();
  const reactivateMutation = useReactivateStudent();
  const permanentDeleteMutation = usePermanentDeleteStudent();

  const handleApprove = (id: string) => {
    approveMutation.mutate(id, {
      onSuccess: () => toast.success("Student approved!"),
      onError: () => toast.error("Failed to approve student"),
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to deactivate this student?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Student deactivated"),
      onError: () => toast.error("Failed to deactivate student"),
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Student Management</h2>
      <p className="text-gray-400 mb-6">Manage gym members and approvals.</p>

      {/* Filter Section */}
      <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-4 sm:p-6 mb-8 group transition-all hover:border-gray-700/60 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Refine List
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">
                Apply multiple filters to narrow results
              </p>
            </div>
          </div>
          {(nameSearch ||
            status ||
            batch ||
            gender ||
            bloodGroup ||
            isActive !== "true") && (
            <button
              onClick={() => {
                setNameSearch("");
                setStatus("");
                setBatch("");
                setGender("");
                setBloodGroup("");
                setIsActive("true");
                setPage(1);
              }}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-primary hover:text-primary/80 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border border-gray-700/50"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Name Search */}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">
            Search by Name
          </label>
          <div className="relative group/search mt-1.5">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 group-focus-within/search:text-primary transition" />
            </div>
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => {
                setNameSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Type a student name..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-600 group-hover/search:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">
              Status
            </label>
            <div className="relative group/select">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 outline-none transition appearance-none cursor-pointer group-hover/select:border-gray-600"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]">
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>

          {/* Batch Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">
              Batch
            </label>
            <div className="relative group/select">
              <select
                value={batch}
                onChange={(e) => {
                  setBatch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 outline-none transition appearance-none cursor-pointer group-hover/select:border-gray-600"
              >
                <option value="">All Batches</option>
                {batches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]">
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">
              Gender
            </label>
            <div className="relative group/select">
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 outline-none transition appearance-none cursor-pointer group-hover/select:border-gray-600"
              >
                <option value="">All Genders</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]">
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>

          {/* Blood Group Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">
              Blood Group
            </label>
            <div className="relative group/select">
              <select
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 outline-none transition appearance-none cursor-pointer group-hover/select:border-gray-600"
              >
                <option value="">All Groups</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]">
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>
          {/* Account Type Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">
              Account
            </label>
            <div className="relative group/select">
              <select
                value={isActive}
                onChange={(e) => {
                  setIsActive(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-xl text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 outline-none transition appearance-none cursor-pointer group-hover/select:border-gray-600"
              >
                <option value="true">Active Only</option>
                <option value="false">Deactivated</option>
                <option value="">All (Incl. Inactive)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]">
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Failed to load students" />}

      {data && (
        <>
          {/* Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    Batch
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        to={`/admin/students/${student._id}`}
                        className="text-primary hover:text-primary/80 hover:underline transition"
                      >
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{student.email}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {student.batch || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        {student.status === "pending" && (
                          <button
                            onClick={() => handleApprove(student._id)}
                            disabled={approveMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg text-xs font-medium transition disabled:opacity-50"
                          >
                            <ChevronRight className="w-3.5 h-3.5 rotate-[-90deg] text-emerald-400" />
                            Approve
                          </button>
                        )}
                        {student.isActive ? (
                          <button
                            onClick={() => handleDelete(student._id)}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-xs font-medium transition disabled:opacity-50 underline decoration-dotted underline-offset-4"
                            title="Soft delete (Deactivate)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Reactivate this student account?",
                                )
                              ) {
                                reactivateMutation.mutate(student._id);
                              }
                            }}
                            disabled={reactivateMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-xs font-medium transition disabled:opacity-50"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            Reactivate
                          </button>
                        )}
                        {!student.isActive && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "DANGER: This will PERMANENTLY delete all student data. Are you sure?",
                                )
                              ) {
                                permanentDeleteMutation.mutate(student._id);
                              }
                            }}
                            disabled={permanentDeleteMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1 bg-red-900/40 text-red-100 hover:bg-red-600 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition disabled:opacity-50 border border-red-500/20"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Permanent Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
              <p className="text-sm text-gray-500">
                Page {data.pagination.page} of {data.pagination.totalPages} (
                {data.pagination.total} students)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page >= data.pagination.totalPages}
                  className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentManagement;
