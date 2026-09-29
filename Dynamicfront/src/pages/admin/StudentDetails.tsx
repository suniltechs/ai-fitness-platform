import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useStudent,
  useUpdateStudentAdmin,
  useBatches,
} from "@/hooks/useStudents";
import {
  User,
  Scale,
  MapPin,
  Dumbbell,
  ChevronLeft,
  Phone,
  Sparkles,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import toast from "react-hot-toast";
import { useStudentProgressSummary } from "@/hooks/useAI";

const StudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, error } = useStudent(id || "");
  const updateMutation = useUpdateStudentAdmin();
  const { data: batches } = useBatches();
  const { data: aiSummary, isLoading: aiLoading } = useStudentProgressSummary(id || "");

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>(null);

  // Constants for form
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const fitnessGoals = [
    "weight gain",
    "weight loss",
    "Body building",
    "weight lifting",
    "power lifting",
    "boxing",
    "silambam",
  ];

  useEffect(() => {
    if (student) {
      setForm({
        ...student,
        dob: student.dob
          ? new Date(student.dob).toISOString().split("T")[0]
          : "",
      });
    }
  }, [student]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !student)
    return <ErrorAlert message="Failed to load student details" />;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate age if DOB changes
      if (name === "dob") {
        const birthDate = new Date(value);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          updated.age = age;
        }
      }
      return updated;
    });
  };

  const handleGoalToggle = (goal: string) => {
    setForm((prev: any) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g: string) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }));
  };

  const handleSave = () => {
    if (!id) return;

    // Convert numeric fields
    const numericFields = ["age", "height", "weight", "entryAmount"];
    const submitData = { ...form };
    numericFields.forEach((field) => {
      if (submitData[field]) submitData[field] = Number(submitData[field]);
    });

    updateMutation.mutate(
      { id, data: submitData },
      {
        onSuccess: () => {
          toast.success("Student updated successfully!");
          setIsEditing(false);
        },
        onError: () => toast.error("Failed to update student"),
      },
    );
  };

  const sections = [
    {
      title: "Personal Information",
      icon: <User className="w-4 h-4" />,
      fields: [
        {
          label: "Name",
          value: student.name,
          edit: (
            <input
              type="text"
              name="name"
              value={form?.name || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ),
        },
        {
          label: "Father Name",
          value: student.fatherName || "Not provided",
          edit: (
            <input
              type="text"
              name="fatherName"
              value={form?.fatherName || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ),
        },
        {
          label: "Gender",
          value: student.gender || "Not provided",
          edit: (
            <select
              name="gender"
              value={form?.gender || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          ),
        },
        {
          label: "DOB",
          value: student.dob
            ? new Date(student.dob).toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not provided",
          edit: (
            <input
              type="date"
              name="dob"
              value={form?.dob || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition [color-scheme:dark]"
            />
          ),
        },
        {
          label: "Age",
          value: student.age ? `${student.age} Years` : "Not provided",
          edit: (
            <input
              type="number"
              name="age"
              value={form?.age || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ),
        },
      ],
    },
    {
      title: "Physical Metrics",
      icon: <Scale className="w-4 h-4" />,
      fields: [
        {
          label: "Height",
          value: student.height ? `${student.height} cm` : "Not provided",
          edit: (
            <div className="relative">
              <input
                type="number"
                name="height"
                value={form?.height || ""}
                onChange={handleInputChange}
                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                cm
              </span>
            </div>
          ),
        },
        {
          label: "Weight",
          value: student.weight ? `${student.weight} kg` : "Not provided",
          edit: (
            <div className="relative">
              <input
                type="number"
                name="weight"
                value={form?.weight || ""}
                onChange={handleInputChange}
                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                kg
              </span>
            </div>
          ),
        },
        {
          label: "Blood Group",
          value: student.bloodGroup || "Not provided",
          edit: (
            <select
              name="bloodGroup"
              value={form?.bloodGroup || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          ),
        },
      ],
    },
    {
      title: "Contact & Address",
      icon: <MapPin className="w-4 h-4" />,
      fields: [
        {
          label: "Email",
          value: student.email,
          edit: (
            <input
              type="email"
              name="email"
              value={form?.email || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ),
        },
        {
          label: "Contact No",
          value: student.phone || "Not provided",
          edit: (
            <input
              type="text"
              name="phone"
              value={form?.phone || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ),
        },
        {
          label: "Emergency Call",
          value: student.emergencyContact ? (
            <div className="flex items-center justify-between w-full">
              <span>{student.emergencyContact}</span>
              <a
                href={`tel:${student.emergencyContact}`}
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
          edit: (
            <input
              type="text"
              name="emergencyContact"
              value={form?.emergencyContact || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ),
        },
        {
          label: "Address",
          value: student.address || "Not provided",
          className: "col-span-2",
          edit: (
            <textarea
              name="address"
              value={form?.address || ""}
              onChange={handleInputChange}
              rows={2}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
            />
          ),
        },
      ],
    },
    {
      title: "Gym Enrollment",
      icon: <Dumbbell className="w-4 h-4" />,
      fields: [
        {
          label: "Current Batch",
          value: student.batch || "Not provided",
          edit: (
            <select
              name="batch"
              value={form?.batch || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">Select Batch</option>
              {batches?.map((b: string) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          ),
        },
        {
          label: "Entry Amount",
          value: student.entryAmount
            ? `₹${student.entryAmount}`
            : "Not provided",
          edit: (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ₹
              </span>
              <input
                type="number"
                name="entryAmount"
                value={form?.entryAmount || ""}
                onChange={handleInputChange}
                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl pl-8 pr-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
          ),
        },
        {
          label: "General Fitness Selection",
          value: student.fitnessGoals?.length
            ? student.fitnessGoals.join(", ")
            : "No goals specified",
          className: "col-span-2",
          edit: (
            <div className="flex flex-wrap gap-2 pt-1">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold transition-all ${
                    form?.fitnessGoals?.includes(goal)
                      ? "bg-primary border-primary text-background"
                      : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Student List
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="p-2 bg-primary/20 rounded-xl text-primary">
              <User className="w-6 h-6" />
            </span>
            Student Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Viewing profile for{" "}
            <span className="text-primary font-medium">{student.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
              student.status === "approved"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {student.status}
          </span>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-primary-dark text-background px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition"
            >
              Edit Details
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm({
                    ...student,
                    dob: student.dob
                      ? new Date(student.dob).toISOString().split("T")[0]
                      : "",
                  });
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🪄 AI Progress Report */}
      <div className="mb-8 bg-gradient-to-br from-indigo-900/30 via-gray-900/40 to-gray-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-500" />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            AI Progress Report
          </h3>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ml-auto">
            Beta
          </span>
        </div>
        <div className="relative z-10 text-gray-300 text-sm leading-relaxed">
          {aiLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span>Analyzing student progress...</span>
            </div>
          ) : aiSummary ? (
            <p>{aiSummary}</p>
          ) : (
            <p className="text-gray-500 italic">No sufficient data to generate a report yet.</p>
          )}
        </div>
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
                    {isEditing ? (
                      <div className="min-h-[44px] flex items-center">
                        {field.edit}
                      </div>
                    ) : (
                      <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-inner flex items-center min-h-[44px]">
                        {field.value || "—"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDetails;
