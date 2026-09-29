import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RAGSource {
  collection: string;
  count: number;
}

export interface RAGGeneratedQuery {
  collection: string | null;
  operation: string | null;
  pipeline: unknown[] | null;
}

export interface RAGConversation {
  _id: string;
  question: string;
  answer: string;
  sources: RAGSource[];
  generatedQuery: RAGGeneratedQuery;
  queryResults?: unknown[] | null;
  error?: string | null;
  createdAt: string;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Mutation hook for asking a RAG question
 */
export const useRAGAsk = () => {
  const queryClient = useQueryClient();

  return useMutation<RAGConversation, Error, string>({
    mutationFn: async (question: string) => {
      const response = await api.post("/api/v1/rag/ask", { question });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ragHistory"] });
    },
  });
};

/**
 * Query hook to fetch RAG conversation history
 */
export const useRAGHistory = () => {
  return useQuery<RAGConversation[]>({
    queryKey: ["ragHistory"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/rag/history");
      return data.data;
    },
  });
};

/**
 * Mutation hook to clear RAG conversation history
 */
export const useClearRAGHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/v1/rag/history");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ragHistory"] });
    },
  });
};
