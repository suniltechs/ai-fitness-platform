import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

interface MetricEntry {
  _id: string;
  weight: number;
  bmi: number;
  date: string;
}

interface MetricSummary {
  metrics: MetricEntry[];
  summary: {
    weightTrend: number;
    avgBmi: number;
    latestStats: MetricEntry;
    totalEntries: number;
  };
}

interface AddMetricInput {
  weight: number;
  bmi?: number;
}

// ─── My Metrics (Student) ────────────────────────────────────────────────────
export const useMyMetrics = () =>
  useQuery<MetricSummary>({
    queryKey: ["myMetrics"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/metrics/my");
      return data.data;
    },
  });

// ─── Add Metric (Student) ────────────────────────────────────────────────────
export const useAddMetric = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddMetricInput) => {
      const { data } = await api.post("/api/v1/metrics", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myMetrics"] });
    },
  });
};

// ─── Delete Metric (Student) ─────────────────────────────────────────────────
export const useDeleteMetric = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/v1/metrics/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myMetrics"] });
    },
  });
};
