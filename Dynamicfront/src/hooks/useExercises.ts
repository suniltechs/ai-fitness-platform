import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

/**
 * Hook to fetch all unique exercise names for autocomplete
 */
export const useExercises = () =>
  useQuery<string[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/exercises");
      return data.data;
    },
    // We want this to be available but stay fairly static
    staleTime: 5 * 60 * 1000, 
  });
