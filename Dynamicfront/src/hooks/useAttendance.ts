import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

interface AttendanceRecord {
  _id: string;
  studentId: string;
  date: string;
  status: string;
  createdAt: string;
}

interface AdminAttendanceRecord {
  _id: string;
  name: string;
  email: string;
  batch?: string;
  totalPresent: number;
  attendancePercentage: number;
}

// ─── My Attendance (Student) ─────────────────────────────────────────────────
export const useMyAttendance = () =>
  useQuery<AttendanceRecord[]>({
    queryKey: ["myAttendance"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/attendance/my");
      return data.data.records;
    },
  });

// ─── Mark Attendance (Student) ───────────────────────────────────────────────
export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/v1/attendance");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myAttendance"] });
    },
  });
};

// ─── Admin Attendance Monitor ────────────────────────────────────────────────
export const useAdminAttendance = (batch?: string) =>
  useQuery<AdminAttendanceRecord[]>({
    queryKey: ["adminAttendance", batch],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/attendance/admin", {
        params: { batch },
      });
      return data.data;
    },
  });
