import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/features/auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  User,
  Mail,
  Lock,
  Phone,
  Users,
  Calendar,
  MapPin,
  Info,
  Activity,
  Ruler,
  Weight as WeightIcon,
  Droplet,
  Clock,
  Briefcase,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Typography } from "antd";

const { Text, Link: AntLink } = Typography;

// --- Components ---

const SearchableDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon?: any;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="text-xs font-medium text-gray-400 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer flex items-center justify-between hover:border-gray-600 transition"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span className={value ? "text-white" : "text-gray-500"}>
            {value || placeholder}
          </span>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-2 overflow-hidden"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border-none rounded-lg text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition flex items-center justify-between ${
                      value === opt
                        ? "bg-primary/20 text-primary"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {opt}
                    {value === opt && <Check className="w-3 h-3" />}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 text-xs italic">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    batch: "",
    gender: "",
    fatherName: "",
    dob: "",
    age: "",
    height: "",
    weight: "",
    fitnessGoals: [] as string[],
    entryAmount: "",
    bloodGroup: "",
    emergencyContact: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-calculate age if DOB changes
    if (name === "dob" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setForm((prev) => ({ ...prev, age: age.toString() }));
    }
  };

  const handleGoalToggle = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }));
  };

  const { refetchUser } = useAuth();
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Step 3 Validation
    if (
      !form.height ||
      !form.weight ||
      !form.bloodGroup ||
      !form.batch ||
      !form.emergencyContact ||
      !form.entryAmount ||
      form.fitnessGoals.length === 0
    ) {
      setError(
        "Please fill all required fields, including at least one fitness goal",
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/api/v1/auth/register", form);
      setSuccess(data.message);

      // Update auth state so ProtectedRoute knows we're logged in
      refetchUser();

      setTimeout(() => {
        navigate("/waiting-approval");
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || "Registration failed");
        setStep(1); // Go back to step 1 to fix errors if they exist
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const batches = ["Morning 6AM", "Morning 8AM", "Evening 5PM", "Evening 7PM"];
  const fitnessGoals = [
    "weight gain",
    "weight loss",
    "Body building",
    "weight lifting",
    "power lifting",
    "boxing",
    "silambam",
  ];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const nextStep = () => {
    // Basic validation before proceeding
    if (step === 1) {
      if (!form.name || !form.email || !form.password || !form.phone) {
        setError(
          "Please fill all required fields in Step 1 (Name, Email, Phone, Password)",
        );
        return;
      }
    } else if (step === 2) {
      if (!form.fatherName || !form.gender || !form.dob || !form.address) {
        setError(
          "Please fill all required fields in Step 2 (Father's Name, Gender, DOB, Address)",
        );
        return;
      }
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> 1. Account Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 ml-1">
                      Contact No <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 ml-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-background font-bold rounded-xl transition flex items-center justify-center gap-2 group"
            >
              Continue to Personal Details
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> 2. Personal Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Father name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="fatherName"
                      required
                      value={form.fatherName}
                      onChange={handleChange}
                      placeholder="Enter Father's Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    DOB <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input
                      type="date"
                      name="dob"
                      required
                      value={form.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 group border border-gray-700"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-[2] py-3.5 bg-primary hover:bg-primary-dark text-background font-bold rounded-xl transition flex items-center justify-center gap-2 group"
              >
                Continue to Fitness Details
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> 3. Fitness & Batch Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      name="height"
                      required
                      value={form.height}
                      onChange={handleChange}
                      placeholder="175"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <WeightIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      name="weight"
                      required
                      value={form.weight}
                      onChange={handleChange}
                      placeholder="70"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>

                <SearchableDropdown
                  label="Blood Group"
                  placeholder="Select Blood Group"
                  options={bloodGroups}
                  value={form.bloodGroup}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, bloodGroup: val }))
                  }
                  icon={Droplet}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <select
                      name="batch"
                      required
                      value={form.batch}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none"
                    >
                      <option value="">Select a batch</option>
                      {batches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Emergency Call <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      name="emergencyContact"
                      required
                      value={form.emergencyContact}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Entry Fee (₹)
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      name="entryAmount"
                      value={form.entryAmount}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  General Fitness Selection{" "}
                  <span className="text-red-500">*</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fitnessGoals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all ${
                        form.fitnessGoals.includes(goal)
                          ? "bg-primary border-primary text-background shadow-lg shadow-primary/20"
                          : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                      }`}
                    >
                      <span className="flex-shrink-0">
                        {form.fitnessGoals.includes(goal) ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-600" />
                        )}
                      </span>
                      <span className="truncate">{goal}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 group border border-gray-700"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background font-bold rounded-xl transition flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <Check className="w-4 h-4 outline-none" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white tracking-tight"
          >
            Dynamic <span className="text-primary">Gym</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2"
          >
            Start your fitness journey today. Step {step} of 3
          </motion.p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-3xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-primary mb-8 flex items-center gap-2 group transition-colors text-xs font-semibold w-fit relative z-10"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </form>

          <p className="text-center text-gray-500 text-xs font-medium mt-10">
            Forgot something?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-bold transition decoration-primary/30 underline decoration-2 underline-offset-4"
            >
              Back to Login
            </Link>
          </p>
          <div className="mt-6 text-center border-t border-white/5 pt-6">
            <Text className="text-gray-500 text-[10px] uppercase tracking-widest">
              By registering, you agree to our{" "}
              <AntLink
                href="/terms"
                className="!text-primary hover:underline font-bold"
              >
                Terms
              </AntLink>{" "}
              &{" "}
              <AntLink
                href="/privacy"
                className="!text-primary hover:underline font-bold"
              >
                Privacy Policy
              </AntLink>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
