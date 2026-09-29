import { useState, useMemo, type FormEvent } from "react";
import { useAssignWorkout } from "@/hooks/useWorkouts";
import { useApprovedStudents, useBatches } from "@/hooks/useStudents";
import { useExercises } from "@/hooks/useExercises";
import toast from "react-hot-toast";
import { X, Sparkles } from "lucide-react";
import { useSuggestExercises } from "@/hooks/useAI";

interface ExerciseInput {
  name: string;
  reps: number;
  sets: number;
}

type AssignMode = "batch" | "student" | "both";

const AssignWorkout = () => {
  const [assignType, setAssignType] = useState<AssignMode>("student");
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentNameMap, setStudentNameMap] = useState<Record<string, string>>(
    {},
  );
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", reps: 10, sets: 3 },
  ]);

  const mutation = useAssignWorkout();
  const { data: studentData, isLoading: studentsLoading } =
    useApprovedStudents();
  const { data: batchList, isLoading: batchesLoading } = useBatches();
  const { data: knownExercises } = useExercises();
  const suggestAI = useSuggestExercises();

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

  // Exercise helpers
  const addExercise = () =>
    setExercises([...exercises, { name: "", reps: 10, sets: 3 }]);

  const removeExercise = (index: number) =>
    setExercises(exercises.filter((_, i) => i !== index));

  const updateExercise = (
    index: number,
    field: keyof ExerciseInput,
    value: string | number,
  ) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

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

  const selectAllStudents = () => {
    const ids = filteredStudents.map((s) => s._id);
    setSelectedStudentIds(ids);
    const map: Record<string, string> = {};
    for (const s of filteredStudents) map[s._id] = s.name;
    setStudentNameMap((prev) => ({ ...prev, ...map }));
  };

  const deselectAllStudents = () => setSelectedStudentIds([]);

  const selectAllBatches = () =>
    setSelectedBatches(batchList ? [...batchList] : []);

  const deselectAllBatches = () => setSelectedBatches([]);

  const removePill = (type: "batch" | "student", value: string) => {
    if (type === "batch")
      setSelectedBatches((prev) => prev.filter((b) => b !== value));
    else setSelectedStudentIds((prev) => prev.filter((s) => s !== value));
  };

  // Total selected count
  const totalSelected = selectedBatches.length + selectedStudentIds.length;

  const handleAISuggest = () => {
    if (totalSelected === 0) {
      toast.error("Please select at least one student or batch first");
      return;
    }

    suggestAI.mutate(
      { studentIds: selectedStudentIds, batches: selectedBatches },
      {
        onSuccess: (data) => {
          if (data && data.length > 0) {
            setExercises(data);
            toast.success("Exercises suggested by AI!");
          }
        },
        onError: () => toast.error("Failed to get AI suggestions"),
      },
    );
  };

  // Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validExercises = exercises.filter((ex) => ex.name.trim());
    if (validExercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }

    const showBatches = assignType === "batch" || assignType === "both";
    const showStudents = assignType === "student" || assignType === "both";

    if (showBatches && selectedBatches.length === 0 && !showStudents) {
      toast.error("Please select at least one batch");
      return;
    }
    if (showStudents && selectedStudentIds.length === 0 && !showBatches) {
      toast.error("Please select at least one student");
      return;
    }
    if (
      showBatches &&
      showStudents &&
      selectedBatches.length === 0 &&
      selectedStudentIds.length === 0
    ) {
      toast.error("Please select at least one batch or student");
      return;
    }

    const payload: {
      assignedTo?: string[];
      batches?: string[];
      exercises: ExerciseInput[];
      startDate: string;
      endDate?: string;
    } = {
      exercises: validExercises,
      startDate,
    };

    if (showStudents && selectedStudentIds.length > 0)
      payload.assignedTo = selectedStudentIds;
    if (showBatches && selectedBatches.length > 0)
      payload.batches = selectedBatches;

    mutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success(data?.message || `Workout assigned successfully!`);
        setSelectedBatches([]);
        setSelectedStudentIds([]);
        setStudentNameMap({});
        setStartDate(today);
        setExercises([{ name: "", reps: 10, sets: 3 }]);
      },
      onError: () => toast.error("Failed to assign workout"),
    });
  };

  // Determine which panels to show
  const showBatchPanel = assignType === "batch" || assignType === "both";
  const showStudentPanel = assignType === "student" || assignType === "both";
  const leftPanelCount = (showBatchPanel ? 1 : 0) + (showStudentPanel ? 1 : 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Assign Workout</h2>
      <p className="text-gray-400 mb-6">
        Create and assign workout plans to students or batches.
      </p>

      {/* ── Selected Pills ── */}
      {totalSelected > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wide mr-1">
            Selected:
          </span>
          {selectedBatches.map((b) => (
            <span
              key={`b-${b}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              {b}
              <button
                type="button"
                onClick={() => removePill("batch", b)}
                className="ml-0.5 hover:text-red-300 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {selectedStudentIds.map((id) => (
            <span
              key={`s-${id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              {studentNameMap[id] || id.slice(-6)}
              <button
                type="button"
                onClick={() => removePill("student", id)}
                className="ml-0.5 hover:text-red-300 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div
        className={`grid gap-6 ${
          leftPanelCount > 0
            ? leftPanelCount === 2
              ? "grid-cols-1 lg:grid-cols-4"
              : "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {/* ── Student Panel ── */}
        {showStudentPanel && (
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col max-h-[calc(100vh-260px)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Students
              </h3>
              <button
                type="button"
                onClick={
                  selectedStudentIds.length === filteredStudents.length
                    ? deselectAllStudents
                    : selectAllStudents
                }
                className="text-[10px] font-medium text-primary hover:text-primary/80 transition"
              >
                {selectedStudentIds.length === filteredStudents.length &&
                filteredStudents.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, batch…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Student list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  {searchQuery
                    ? "No students match your search."
                    : "No approved students found."}
                </p>
              ) : (
                filteredStudents.map((student) => (
                  <label
                    key={student._id}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                      selectedStudentIds.includes(student._id)
                        ? "bg-primary/15 ring-1 ring-primary/50"
                        : "bg-gray-800/50 hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student._id)}
                      onChange={() => toggleStudent(student._id, student.name)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary focus:ring-offset-0 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">
                          {student.name}
                        </span>
                        {student.batch && (
                          <span className="text-[10px] font-medium bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                            {student.batch}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {student.email}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>

            {/* Count */}
            {!studentsLoading && (
              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-800">
                {selectedStudentIds.length} selected · {filteredStudents.length}{" "}
                {searchQuery ? "found" : "total"}
              </p>
            )}
          </div>
        )}

        {/* ── Batch Panel ── */}
        {showBatchPanel && (
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col max-h-[calc(100vh-260px)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Batches
              </h3>
              <button
                type="button"
                onClick={
                  selectedBatches.length === (batchList?.length ?? 0)
                    ? deselectAllBatches
                    : selectAllBatches
                }
                className="text-[10px] font-medium text-primary hover:text-primary/80 transition"
              >
                {selectedBatches.length === (batchList?.length ?? 0)
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
              {batchesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !batchList || batchList.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  No batches found.
                </p>
              ) : (
                batchList.map((batch) => (
                  <label
                    key={batch}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                      selectedBatches.includes(batch)
                        ? "bg-emerald-600/15 ring-1 ring-emerald-500/50"
                        : "bg-gray-800/50 hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch)}
                      onChange={() => toggleBatch(batch)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <span className="flex-1 text-sm font-medium text-white">
                      {batch}
                    </span>
                    <span className="text-[10px] font-medium bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      {batchStudentCounts[batch] || 0} students
                    </span>
                  </label>
                ))
              )}
            </div>

            {!batchesLoading && batchList && (
              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-800">
                {selectedBatches.length} of {batchList.length} selected
              </p>
            )}
          </div>
        )}

        {/* ── Workout Form ── */}
        <div
          className={
            leftPanelCount === 2
              ? "lg:col-span-2"
              : leftPanelCount === 1
                ? "lg:col-span-2"
                : ""
          }
        >
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-xl p-7"
          >
            {/* Assignment Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assign To
              </label>
              <div className="flex gap-3">
                {(
                  [
                    ["student", "Students"],
                    ["batch", "Batches"],
                    ["both", "Both"],
                  ] as const
                ).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setAssignType(type as AssignMode);
                      if (type === "batch") {
                        setSelectedStudentIds([]);
                        setStudentNameMap({});
                      }
                      if (type === "student") setSelectedBatches([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      assignType === type
                        ? "bg-primary text-background"
                        : "bg-gray-800 text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-6 sm:w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Exercises */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">
                  Exercises
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAISuggest}
                    disabled={suggestAI.isPending}
                    className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {suggestAI.isPending ? "Suggesting..." : "Suggest with AI"}
                  </button>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="px-3 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-xs font-medium transition"
                  >
                    + Add Exercise
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-3 sm:items-center bg-gray-800/50 rounded-lg p-3"
                  >
                    <input
                      type="text"
                      list="exercise-suggestions"
                      placeholder="Exercise name"
                      value={ex.name}
                      onChange={(e) =>
                        updateExercise(i, "name", e.target.value)
                      }
                      className="w-full sm:flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
                    />

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 uppercase font-medium min-w-[32px]">
                          Reps
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={ex.reps}
                          onChange={(e) =>
                            updateExercise(i, "reps", Number(e.target.value))
                          }
                          className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          title="Reps"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 uppercase font-medium min-w-[32px]">
                          Sets
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={ex.sets}
                          onChange={(e) =>
                            updateExercise(i, "sets", Number(e.target.value))
                          }
                          className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          title="Sets"
                        />
                      </div>

                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(i)}
                          className="sm:hidden ml-auto text-red-400 hover:text-red-300 text-sm p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(i)}
                        className="hidden sm:block text-red-400 hover:text-red-300 text-sm p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <datalist id="exercise-suggestions">
                {knownExercises?.map((name: string) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <p className="text-xs text-gray-500 mt-2">
                Fields: Name | Reps | Sets
              </p>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-semibold rounded-lg transition"
            >
              {mutation.isPending
                ? "Assigning..."
                : totalSelected > 0
                  ? `Assign Workout (${totalSelected} target${totalSelected !== 1 ? "s" : ""})`
                  : "Assign Workout"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignWorkout;
