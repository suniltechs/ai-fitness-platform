import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

interface Exercise {
  name: string;
  reps: number;
  sets: number;
}

interface Workout {
  _id: string;
  exercises: Exercise[];
  assignedTo?: string | { _id: string; name: string; email: string; batch?: string };
  assignedBy?: string | { _id: string; name: string };
  batch?: string;
  startDate: string;
  endDate?: string;
  completedExercises: string[];
  completionStatus: number;
  createdAt: string;
}

interface AssignWorkoutInput {
  assignedTo?: string[];
  batches?: string[];
  exercises: Exercise[];
  startDate: string;
  endDate?: string;
}

// ─── Get My Workouts (Student) ───────────────────────────────────────────────
export const useMyWorkouts = () =>
  useQuery<Workout[]>({
    queryKey: ["myWorkouts"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/workouts/my");
      return data.data;
    },
  });

// ─── Assign Workout (Admin) ─────────────────────────────────────────────────
export const useAssignWorkout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AssignWorkoutInput) => {
      const { data } = await api.post("/api/v1/workouts", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myWorkouts"] });
    },
  });
};

// ─── Get All Workouts (Admin) ────────────────────────────────────────────────
export const useAllWorkouts = () =>
  useQuery<Workout[]>({
    queryKey: ["allWorkouts"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/workouts");
      return data.data;
    },
  });

// ─── Mark Exercise Complete (Student) ────────────────────────────────────────
export const useMarkExerciseComplete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workoutId,
      exerciseName,
    }: {
      workoutId: string;
      exerciseName: string;
    }) => {
      const { data } = await api.patch(
        `/api/v1/workouts/${workoutId}/complete`,
        { exerciseName }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myWorkouts"] });
    },
  });
};
