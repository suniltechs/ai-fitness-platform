import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("admin" | "student")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ─── Not authenticated → Login ──────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ─── Role mismatch → Unauthorized ──────────────────────────────────────
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ─── Handle Pending Students ───────────────────────────────────────────
  if (user.role === "student") {
    const isWaitingPage = location.pathname === "/waiting-approval";

    if (user.status === "pending" && !isWaitingPage) {
      return <Navigate to="/waiting-approval" replace />;
    }

    if (user.status === "approved" && isWaitingPage) {
      return <Navigate to="/student" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
