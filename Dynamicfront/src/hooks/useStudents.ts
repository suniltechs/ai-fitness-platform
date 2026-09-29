import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import type { User } from "@/types/user";
import toast from "react-hot-toast";

interface StatsData {
  totalStudents: number;
  pendingApprovals: number;
  activeBatches: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  batch?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

interface StudentListResponse {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export const useStudentStats = () =>
  useQuery<StatsData>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/users/stats");
      return data.data;
    },
  });

// ─── Student List ────────────────────────────────────────────────────────────
export const useStudents = (filters: {
  name?: string;
  status?: string;
  batch?: string;
  gender?: string;
  bloodGroup?: string;
  isActive?: boolean | string;
  page?: number;
  limit?: number;
}) =>
  useQuery<StudentListResponse>({
    queryKey: ["students", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.status) params.append("status", filters.status);
      if (filters.batch) params.append("batch", filters.batch);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.bloodGroup) params.append("bloodGroup", filters.bloodGroup);
      if (filters.isActive !== undefined) params.append("isActive", String(filters.isActive));
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));
      const { data } = await api.get(`/api/v1/users?${params}`);
      return data.data;
    },
  });

// ─── Approve Student ─────────────────────────────────────────────────────────
export const useApproveStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/api/v1/users/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
};

// ─── Delete Student ──────────────────────────────────────────────────────────
export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/v1/users/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
};

// ─── Approved Students (for pickers) ─────────────────────────────────────────
export const useApprovedStudents = () =>
  useQuery<StudentListResponse>({
    queryKey: ["students", { status: "approved", limit: 100 }],
    queryFn: async () => {
      const { data } = await api.get(
        "/api/v1/users?status=approved&limit=100"
      );
      return data.data;
    },
  });

// ─── Batch Names (for pickers) ───────────────────────────────────────────────
export const useBatches = () =>
  useQuery<string[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/users/batches");
      return data.data;
    },
  });

// ─── Import Students ─────────────────────────────────────────────────────────
export const useImportStudents = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/api/v1/users/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
};

// ─── Single Student ─────────────────────────────────────────────────────────
export const useStudent = (id: string) =>
  useQuery<User>({
    queryKey: ["students", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

// ─── Update Student by Admin ────────────────────────────────────────────────
export const useUpdateStudentAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const { data: response } = await api.patch(`/api/v1/users/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["students", variables.id] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
};

// ─── Reactivate Student ─────────────────────────────────────────────────────
export const useReactivateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/api/v1/users/${id}/reactivate`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Student reactivated successfully");
    },
  });
};

// ─── Permanent Delete Student ───────────────────────────────────────────────
export const usePermanentDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/v1/users/${id}/permanent`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Student permanently deleted");
    },
  });
};
