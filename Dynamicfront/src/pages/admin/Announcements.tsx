import { useState, useMemo, type FormEvent } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import {
  useMyAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
} from "@/hooks/useAnnouncements";
import { useApprovedStudents, useBatches } from "@/hooks/useStudents";
import toast from "react-hot-toast";
import { Megaphone, Search, X, Trash2, Inbox } from "lucide-react";

type TargetMode = "all" | "batch" | "individual" | "both";

const Announcements = () => {
  const { data: announcements, isLoading, error } = useMyAnnouncements();
  const createMutation = useCreateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const { data: studentData, isLoading: studentsLoading } =
    useApprovedStudents();
  const { data: batchList, isLoading: batchesLoading } = useBatches();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<TargetMode>("all");
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentNameMap, setStudentNameMap] = useState<Record<string, string>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Student helpers
  const allStudents = useMemo(() => studentData?.students ?? [], [studentData]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return allStudents;
    const q = searchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.batch && s.batch.toLowerCase().includes(q)),
    );
  }, [allStudents, searchQuery]);

  // Batch helpers
  const batchStudentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of allStudents) {
      if (s.batch) map[s.batch] = (map[s.batch] || 0) + 1;
    }
    return map;
  }, [allStudents]);

  // Selection toggles
  const toggleBatch = (batch: string) =>
    setSelectedBatches((prev) =>
      prev.includes(batch) ? prev.filter((b) => b !== batch) : [...prev, batch],
    );

  const toggleStudent = (id: string, name: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
    setStudentNameMap((prev) => ({ ...prev, [id]: name }));
  };

  const removePill = (type: "batch" | "student", value: string) => {
    if (type === "batch")
      setSelectedBatches((prev) => prev.filter((b) => b !== value));
    else setSelectedStudentIds((prev) => prev.filter((s) => s !== value));
  };

  const totalSelected = selectedBatches.length + selectedStudentIds.length;

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    if (target !== "all" && totalSelected === 0) {
      toast.error("Please select at least one target student or batch");
      return;
    }

    createMutation.mutate(
      {
        title,
        message,
        target,
        batches: target === "batch" || target === "both" ? selectedBatches : [],
        assignedTo:
          target === "individual" || target === "both"
            ? selectedStudentIds
            : [],
      },
      {
        onSuccess: () => {
          toast.success("Announcement sent!");
          setTitle("");
          setMessage("");
          setSelectedBatches([]);
          setSelectedStudentIds([]);
          setStudentNameMap({});
          setTarget("all");
        },
        onError: () => toast.error("Failed to create announcement"),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Announcement deleted"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  const showBatchPanel = target === "batch" || target === "both";
  const showStudentPanel = target === "individual" || target === "both";
  const leftPanelCount = (showBatchPanel ? 1 : 0) + (showStudentPanel ? 1 : 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Announcements</h2>
      <p className="text-gray-400 mb-6">Create and manage gym announcements.</p>

      {/* ── Selection Summary Pills ── */}
      {target !== "all" && totalSelected > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center bg-gray-900/50 p-3 rounded-xl border border-gray-800">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-1">
            Reaching:
          </span>
          {selectedBatches.map((b) => (
            <span
              key={`b-${b}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20"
            >
              Batch: {b}
              <button
                type="button"
                onClick={() => removePill("batch", b)}
                className="hover:text-white transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedStudentIds.map((id) => (
            <span
              key={`s-${id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/20"
            >
              {studentNameMap[id] || "Student"}
              <button
                type="button"
                onClick={() => removePill("student", id)}
                className="hover:text-white transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div
        className={`grid gap-8 ${
          leftPanelCount > 0
            ? leftPanelCount === 2
              ? "grid-cols-1 lg:grid-cols-4"
              : "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {/* ── Student Selection Panel ── */}
        {showStudentPanel && (
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col max-h-[500px]">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Select Students
            </h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {studentsLoading ? (
                <LoadingSpinner />
              ) : (
                filteredStudents.map((student) => (
                  <label
                    key={student._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedStudentIds.includes(student._id)
                        ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                        : "bg-gray-800/30 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student._id)}
                      onChange={() => toggleStudent(student._id, student.name)}
                      className="hidden"
                    />
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {student.name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {student.batch || "No Batch"}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Batch Selection Panel ── */}
        {showBatchPanel && (
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col max-h-[500px]">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Select Batches
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {batchesLoading ? (
                <LoadingSpinner />
              ) : (
                batchList?.map((batch) => (
                  <label
                    key={batch}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedBatches.includes(batch)
                        ? "bg-emerald-600/10 border-emerald-500/50 ring-1 ring-emerald-500/20"
                        : "bg-gray-800/30 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch)}
                      onChange={() => toggleBatch(batch)}
                      className="hidden"
                    />
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {batch.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {batch}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {batchStudentCounts[batch] || 0} students
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Create Form ── */}
        <form
          onSubmit={handleCreate}
          className={`space-y-6 ${
            leftPanelCount === 2
              ? "lg:col-span-2"
              : leftPanelCount === 1
                ? "lg:col-span-2"
                : ""
          }`}
        >
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-500" />

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="p-2 bg-primary/20 rounded-lg text-primary">
                <Megaphone className="w-5 h-5" />
              </span>{" "}
              New Announcement
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gym Holiday Notice"
                  className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["all", "batch", "individual", "both"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTarget(t);
                          if (t === "all") {
                            setSelectedBatches([]);
                            setSelectedStudentIds([]);
                          }
                        }}
                        className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          target === t
                            ? "bg-primary border-primary text-background shadow-lg shadow-primary/20"
                            : "bg-gray-950/50 border-gray-800 text-gray-500 hover:border-gray-700"
                        }`}
                      >
                        {t === "individual" ? "Students" : t}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Message Details
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your announcement here..."
                  className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full mt-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary disabled:opacity-50 text-background text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              {createMutation.isPending
                ? "Broadcasting..."
                : target === "all"
                  ? "Publish to Everyone"
                  : `Publish to ${totalSelected} Target${totalSelected !== 1 ? "s" : ""}`}
            </button>
          </div>

          {/* ── Recent Announcements ── */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Broadcast History
            </h3>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert message="Failed to load announcements" />}

            <div className="space-y-3">
              {announcements?.map((a) => (
                <div
                  key={a._id}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                          {a.target}
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {a.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                        {a.message}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {announcements?.length === 0 && (
                <div className="text-center py-12 bg-gray-950/20 border border-dashed border-gray-800 rounded-2xl">
                  <Inbox className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    Clear History
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Announcements;
