import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

interface GeneratePlanDTO {
  goal?: string;
  fitnessLevel?: string;
  restrictions?: string;
}

export const useGenerateAIPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GeneratePlanDTO) => {
      const response = await api.post("/api/v1/ai/generate-plan", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myWorkouts"] });
      queryClient.invalidateQueries({ queryKey: ["myDiet"] });
    },
  });
};

export interface ChatMessage {
  _id: string;
  role: "user" | "model" | "system";
  content: string;
  createdAt: string;
}

export const useChatHistory = () => {
  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/ai/chat/history");
      return data.data;
    },
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post("/api/v1/ai/chat/message", { message });
      return response.data.data;
    },
    onMutate: async (newMessage: string) => {
      await queryClient.cancelQueries({ queryKey: ["chatHistory"] });
      const previousHistory = queryClient.getQueryData<ChatMessage[]>(["chatHistory"]);
      if (previousHistory) {
        queryClient.setQueryData<ChatMessage[]>(["chatHistory"], [
          ...previousHistory,
          {
            _id: `temp-${Date.now()}`,
            role: "user",
            content: newMessage,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return { previousHistory };
    },
    onError: (_err, _newMessage, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(["chatHistory"], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });
};

export const useSuggestExercises = () => {
  return useMutation({
    mutationFn: async (data: { studentIds?: string[]; batches?: string[] }) => {
      const response = await api.post("/api/v1/ai/suggest-exercises", data);
      return response.data.data;
    },
  });
};

export const useStudentProgressSummary = (studentId: string) => {
  return useQuery<string>({
    queryKey: ["studentProgressSummary", studentId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/ai/admin/student-summary/${studentId}`);
      return data.data;
    },
    enabled: !!studentId,
  });
};

export const useRecommendDiet = () => {
  return useMutation({
    mutationFn: async (data: { preferences?: string; allergies?: string }) => {
      const response = await api.post("/api/v1/ai/diet-recommendation", data);
      return response.data.data;
    },
  });
};
