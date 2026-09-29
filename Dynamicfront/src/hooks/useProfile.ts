import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  batch?: string;
  profilePicture?: string;
  gymName?: string;
  address?: string;
  contactPhone?: string;
}

interface UpdateProfilePayload {
  name?: string;
  profilePicture?: string;
  gymName?: string;
  address?: string;
  contactPhone?: string;
}

export const useProfile = () => {
  const qc = useQueryClient();

  const profile = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/auth/me");
      return data.user;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch("/api/v1/users/profile", payload);
      return data;
    },
    onSuccess: () => {
      // Update both the "profile" key and the global auth state if needed
      // Since "me" returns the user, we can invalidate it
      qc.invalidateQueries({ queryKey: ["profile"] });
      // Also potentially invalidate other keys that might have user info
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  return {
    profile: profile.data,
    isLoading: profile.isLoading,
    isError: profile.isError,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
    updateError: updateProfile.error,
  };
};
