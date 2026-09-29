import { useAuth } from "@/features/auth/AuthProvider";
import {
  User,
  Scale,
  MapPin,
  Phone,
  Dumbbell,
  Info,
  Mail,
  Lock,
  Key,
  Check,
  // AlertCircle,
} from "lucide-react";
import { useState } from "react";
import api from "@/api/axios";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/v1/auth/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: "Personal Information",
      icon: <User className="w-4 h-4" />,
      fields: [
        { label: "Name", value: user.name },
        { label: "Father Name", value: user.fatherName || "Not provided" },
        { label: "Gender", value: user.gender || "Not provided" },
        {
          label: "DOB",
          value: user.dob
            ? new Date(user.dob).toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not provided",
        },
        {
          label: "Age",
          value: user.age ? `${user.age} Years` : "Not provided",
        },
      ],
    },
    {
      title: "Physical Metrics",
      icon: <Scale className="w-4 h-4" />,
      fields: [
        {
          label: "Height",
          value: user.height ? `${user.height} cm` : "Not provided",
        },
        {
          label: "Weight",
          value: user.weight ? `${user.weight} kg` : "Not provided",
        },
        { label: "Blood Group", value: user.bloodGroup || "Not provided" },
      ],
    },
    {
      title: "Contact & Address",
      icon: <MapPin className="w-4 h-4" />,
      fields: [
        { label: "Email", value: user.email },
        { label: "Contact No", value: user.phone || "Not provided" },
        {
          label: "Emergency Call",
          value: user.emergencyContact ? (
            <div className="flex items-center justify-between w-full">
              <span>{user.emergencyContact}</span>
              <a
                href={`tel:${user.emergencyContact}`}
                className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
                title="Call Emergency Number"
              >
                <span>
                  <Phone className="w-3 h-3" />
                </span>{" "}
                Call now
              </a>
            </div>
          ) : (
            "Not provided"
          ),
        },
        {
          label: "Address",
          value: user.address || "Not provided",
          className: "col-span-2",
        },
      ],
    },
    {
      title: "Gym Enrollment",
      icon: <Dumbbell className="w-4 h-4" />,
      fields: [
        { label: "Current Batch", value: user.batch || "Not provided" },
        {
          label: "Entry Amount",
          value: user.entryAmount ? `₹${user.entryAmount}` : "Not provided",
        },
        {
          label: "General Fitness Selection",
          value: user.fitnessGoals?.length
            ? user.fitnessGoals.join(", ")
            : "No goals specified",
          className: "col-span-2",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="p-2 bg-primary/20 rounded-xl text-primary">
            <User className="w-6 h-6" />
          </span>
          My Profile
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your personal and gym-related information in a read-only format.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="px-6 py-4 bg-gray-800/20 border-b border-gray-800 flex items-center gap-3">
              <span className="text-lg">{section.icon}</span>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                {section.title}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className={`space-y-1.5 ${field.className || ""}`}
                  >
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
                      {field.label}
                    </label>
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-inner">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Password Settings Section */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 bg-gray-800/20 border-b border-gray-800 flex items-center gap-3">
            <span className="text-lg text-primary">
              <Lock className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
              Password Settings
            </h3>
          </div>
          <div className="p-6">
            <form
              onSubmit={handlePasswordChange}
              className="max-w-md space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        oldPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full md:w-auto px-8 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black shadow-lg shadow-primary/20 shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
            Need to update your details?
          </h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Please contact the gym administration to make any corrections to
            your profile information.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <a
              href="tel:+919791957395"
              className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-primary transition-colors bg-gray-900/40 px-3 py-1.5 rounded-lg border border-gray-800"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              +91 9791957395
            </a>
            <a
              href="mailto:gymbarathi@gmail.com"
              className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-primary transition-colors bg-gray-900/40 px-3 py-1.5 rounded-lg border border-gray-800"
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              gymbarathi@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
