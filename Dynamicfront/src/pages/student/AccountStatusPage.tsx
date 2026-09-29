import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Mail, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const AccountStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");

  const isDeleted = status === "deleted"; // Kept for safety but should not be reached from login

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="mb-8 flex justify-center">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center relative ${isDeleted ? "bg-red-500/10" : "bg-primary/10"}`}
          >
            <div
              className={`absolute inset-0 rounded-2xl blur-lg opacity-50 ${isDeleted ? "bg-red-500/20" : "bg-primary/20"}`}
            />
            {isDeleted ? (
              <AlertTriangle className="w-10 h-10 text-red-500 relative z-10" />
            ) : (
              <ShieldAlert className="w-10 h-10 text-primary relative z-10" />
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
          {isDeleted ? "Account Not Found" : "Account Deactivated"}
        </h1>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
          {isDeleted
            ? "Your account has been permanently removed from our system. If you believe this is an error, please register again or contact our support team."
            : "Your account has been temporarily deactivated by an administrator. This could be due to membership expiration or other administrative reasons."}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-white text-black hover:bg-gray-200 py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <a
            href="mailto:support@dynamicgym.com"
            className="w-full bg-gray-800 text-white hover:bg-gray-700 py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-white/5"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
            Dynamic Gym Management System <br />
            Security & Administration
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountStatusPage;
