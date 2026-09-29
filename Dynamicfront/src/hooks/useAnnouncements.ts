import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  target: "all" | "batch" | "individual" | "both";
  batches?: string[];
  assignedTo?: string[];
  createdAt: string;
}

interface CreateAnnouncementInput {
  title: string;
  message: string;
  target: "all" | "batch" | "individual" | "both";
  batches?: string[];
  assignedTo?: string[];
}

// ─── My Announcements (Student) ──────────────────────────────────────────────
export const useMyAnnouncements = () =>
  useQuery<Announcement[]>({
    queryKey: ["myAnnouncements"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/announcements/my");
      return data.data;
    },
  });

// ─── Create Announcement (Admin) ─────────────────────────────────────────────
export const useCreateAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAnnouncementInput) => {
      const { data } = await api.post("/api/v1/announcements", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myAnnouncements"] });
    },
  });
};

// ─── Delete Announcement (Admin) ─────────────────────────────────────────────
export const useDeleteAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/v1/announcements/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myAnnouncements"] });
    },
  });
};
