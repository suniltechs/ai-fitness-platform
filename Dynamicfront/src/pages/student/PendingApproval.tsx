import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";

const PendingApproval = () => {
  const { user, logout, refetchUser } = useAuth();
  const navigate = useNavigate();
  const socketRef = useSocket();

  useEffect(() => {
    if (user?.status === "approved") {
      navigate("/student", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("statusUpdated", (data: { status: string; message: string }) => {
      if (data.status === "approved") {
        toast.success(data.message || "Your account has been approved!");
        refetchUser();
      }
    });

    return () => {
      socket.off("statusUpdated");
    };
  }, [socketRef, refetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          {/* Pulsing Icon */}
          <div className="relative mb-8 inline-block">
            <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 mx-auto">
              <span className="text-4xl animate-bounce">⏳</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Account Under Review
          </h1>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Welcome,{" "}
            <span className="text-white font-medium">{user?.name}</span>! Your
            registration has been received. Our team is currently reviewing your
            details for access to the gym dashboard.
          </p>

          {/* Onboarding Info for Imported Students */}
          {/* <div className="mb-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-left">
            <h4 className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider mb-2">
              <span>🛡️</span> First-time Login?
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              If your account was imported by an admin, your default password is{" "}
              <span className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">
                Gym@1234
              </span>
              . For your security, please update your password in the{" "}
              <span className="text-gray-300 font-medium">Profile</span> section
              once your account is approved.
            </p>
          </div> */}

          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex items-center gap-4 text-left">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              <div>
                <p className="text-sm font-medium text-white">
                  Status: Pending
                </p>
                <p className="text-xs text-gray-500">
                  Usually takes 1-2 business days
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => refetchUser()}
                className="py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700 active:scale-[0.98]"
              >
                Check Now
              </button>
              <button
                onClick={() => logout()}
                className="py-3 px-6 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-semibold rounded-xl transition-all border border-red-500/20 active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>
          </div>

          <p className="mt-12 text-gray-500 text-sm">
            You'll be automatically redirected once approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
