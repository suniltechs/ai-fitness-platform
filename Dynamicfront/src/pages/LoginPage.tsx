import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import api from "@/api/axios";
import { Typography } from "antd";
import { ArrowLeft } from "lucide-react";

const { Text, Link: AntLink } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/v1/auth/student-login", { email, password });
      await refetchUser();
      navigate("/student", { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";

      if (errorMessage === "ACCOUNT_DEACTIVATED") {
        navigate("/account-status?status=deactivated");
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Dynamic <span className="text-primary">Gym</span>
          </h1>
          <p className="text-gray-400 mt-2">Student Sign In</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-primary mb-2 flex items-center gap-2 group transition-colors text-xs font-semibold w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="mt-4 text-center">
              <Text className="text-gray-500 text-xs">
                By continuing, you agree to our{" "}
                <AntLink
                  href="/terms"
                  className="!text-primary hover:underline"
                >
                  Terms & Conditions
                </AntLink>{" "}
                and{" "}
                <AntLink
                  href="/privacy"
                  className="!text-primary hover:underline"
                >
                  Privacy Policy
                </AntLink>
              </Text>
            </div>
          </form>

          {/* Register link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            New student?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
