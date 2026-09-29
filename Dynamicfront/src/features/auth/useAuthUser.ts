import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { User } from "@/types/user";

interface MeResponse {
  success: boolean;
  user: User;
}

export const useAuthUser = () => {
  return useQuery<User>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const { data } = await api.get<MeResponse>("/api/v1/auth/me");
      return data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
