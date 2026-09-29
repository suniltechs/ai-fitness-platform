import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

interface DietEntry {
  _id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

interface MacroSummary {
  macroPercentages: {
    protein: number;
    carbs: number;
    fat: number;
  };
  totals: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  entries: number;
}

interface AddDietInput {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ─── My Diet Logs (Student) ──────────────────────────────────────────────────
export const useMyDiet = () =>
  useQuery<DietEntry[]>({
    queryKey: ["myDiet"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/diet/my");
      return data.data;
    },
  });

// ─── Macro Summary (Student) ─────────────────────────────────────────────────
export const useDietMacros = () =>
  useQuery<MacroSummary>({
    queryKey: ["dietMacros"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/diet/macros");
      return data.data;
    },
  });

// ─── Add Diet Entry (Student) ────────────────────────────────────────────────
export const useAddDiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddDietInput) => {
      const { data } = await api.post("/api/v1/diet", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myDiet"] });
      qc.invalidateQueries({ queryKey: ["dietMacros"] });
    },
  });
};
