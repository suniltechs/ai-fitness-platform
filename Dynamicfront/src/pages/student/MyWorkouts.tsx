import { useState } from "react";
import { CheckSquare, Square, CheckCircle2, Sparkles, X, Loader2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { useMyWorkouts, useMarkExerciseComplete } from "@/hooks/useWorkouts";
import { useGenerateAIPlan } from "@/hooks/useAI";
import toast from "react-hot-toast";

const MyWorkouts = () => {
  const { data: workouts, isLoading, error } = useMyWorkouts();
  const markComplete = useMarkExerciseComplete();
  const generateAIPlan = useGenerateAIPlan();
  
  const [showAIModal, setShowAIModal] = useState(false);
  const [goal, setGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [restrictions, setRestrictions] = useState("");

  const handleComplete = (workoutId: string, exerciseName: string) => {
    markComplete.mutate(
      { workoutId, exerciseName },
      {
        onSuccess: () =>
          toast.success(
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{exerciseName} completed!</span>
            </div>,
          ),
        onError: () => toast.error("Failed to mark complete"),
      },
    );
  };

  const handleGenerateAI = () => {
    generateAIPlan.mutate(
      { goal, fitnessLevel, restrictions },
      {
        onSuccess: () => {
          toast.success("AI Plan generated successfully!");
          setShowAIModal(false);
          setGoal("");
          setRestrictions("");
        },
        onError: () => toast.error("Failed to generate AI plan"),
      }
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Failed to load workouts" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">My Workouts</h2>
          <p className="text-gray-400">
            Your assigned workout plans. Tap exercises to mark them complete.
          </p>
        </div>
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-xl transition font-medium w-full sm:w-auto shrink-0 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Plan
        </button>
      </div>

      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> AI Plan Generator
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Goal</label>
                <input 
                  type="text" 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Lose 5kg in 2 months"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fitness Level</label>
                <select 
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Dietary Restrictions</label>
                <input 
                  type="text" 
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  placeholder="e.g. Vegan, No nuts"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={generateAIPlan.isPending}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generateAIPlan.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Magic Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {workouts?.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
          No workouts assigned yet. Check back later!
        </div>
      )}

      <div className="space-y-6">
        {workouts?.map((workout) => {
          const completionPct = Math.round(
            (workout.completedExercises.length / workout.exercises.length) *
              100,
          );
          const isCompleted = completionPct === 100;
          const expiryTime =
            new Date(workout.createdAt).getTime() + 24 * 60 * 60 * 1000;
          const isExpired = Date.now() > expiryTime && !isCompleted;
          const isActive = !isExpired && !isCompleted;

          return (
            <div
              key={workout._id}
              className={`bg-gray-900 border rounded-xl overflow-hidden ${
                isActive || isCompleted
                  ? "border-gray-800"
                  : "border-gray-800/50 opacity-60"
              }`}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isCompleted
                          ? "bg-primary/20 text-primary"
                          : isActive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-700 text-gray-500"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : isActive
                          ? "Active"
                          : "Expired"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Assigned:{" "}
                      {new Date(workout.startDate).toLocaleDateString()}
                      {isCompleted && workout.endDate && (
                        <span className="ml-2">
                          • Completed:{" "}
                          {new Date(workout.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Progress</p>
                  <p className="text-lg font-bold text-primary">
                    {completionPct}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-800">
                <div
                  className="h-1 bg-primary transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              {/* Exercises */}
              <div className="p-4 space-y-2">
                {workout.exercises.map((exercise) => {
                  const isDone = workout.completedExercises.includes(
                    exercise.name,
                  );
                  return (
                    <div
                      key={exercise.name}
                      className={`flex items-center justify-between p-3 rounded-lg transition ${
                        isDone
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-gray-800/50 border border-gray-700/30 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {isDone ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-500" />
                          )}
                        </span>
                        <div>
                          <p
                            className={`font-medium ${
                              isDone
                                ? "text-emerald-400 line-through"
                                : "text-white"
                            }`}
                          >
                            {exercise.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                        </div>
                      </div>
                      {!isDone && isActive && (
                        <button
                          onClick={() =>
                            handleComplete(workout._id, exercise.name)
                          }
                          disabled={markComplete.isPending}
                          className="px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-xs font-medium transition disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyWorkouts;
