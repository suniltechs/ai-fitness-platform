import { useState, useEffect } from "react";
import { useAddMetric } from "@/hooks/useMetrics";
import toast from "react-hot-toast";
import { Scale, Save } from "lucide-react";

const BMICalculator = () => {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<{
    label: string;
    color: string;
  } | null>(null);

  const { mutate: addMetric, isPending } = useAddMetric();

  useEffect(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      const calculatedBmi = parseFloat((w / (h * h)).toFixed(1));
      setBmi(calculatedBmi);

      if (calculatedBmi < 18.5) {
        setCategory({ label: "Underweight", color: "text-blue-400" });
      } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
        setCategory({ label: "Normal", color: "text-emerald-400" });
      } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
        setCategory({ label: "Overweight", color: "text-orange-400" });
      } else {
        setCategory({ label: "Obese", color: "text-red-400" });
      }
    } else {
      setBmi(null);
      setCategory(null);
    }
  }, [height, weight]);

  const handleSave = () => {
    if (!bmi || !weight) return;

    addMetric(
      {
        weight: parseFloat(weight),
        bmi: bmi,
      },
      {
        onSuccess: () => {
          toast.success("BMI record saved successfully!");
        },
        onError: () => {
          toast.error("Failed to save BMI record.");
        },
      },
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all hover:border-primary/30">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-10 -mt-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">BMI Calculator</h3>
          <p className="text-xs text-gray-400">Track your Body Mass Index</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="Age"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Gender
            </label>
            <div className="flex bg-gray-800/50 border border-gray-700 rounded-xl p-0.5">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                  gender === "male"
                    ? "bg-primary text-background shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                  gender === "female"
                    ? "bg-primary text-background shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="e.g., 175"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="e.g., 70"
            />
          </div>
        </div>

        {/* Result Area */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Your Result
              </p>
              {bmi ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{bmi}</span>
                  <span
                    className={`text-sm font-bold ${category?.color} px-2 py-0.5 bg-gray-800 rounded-lg border border-gray-700/50`}
                  >
                    {category?.label}
                  </span>
                </div>
              ) : (
                <span className="text-gray-600 italic text-sm">
                  Waiting for inputs...
                </span>
              )}
            </div>

            {/* Visual Scale */}
            {bmi && (
              <div className="flex items-center gap-1.5 h-1.5">
                <div
                  className={`w-3 h-1.5 rounded-full ${bmi < 18.5 ? "bg-blue-400" : "bg-gray-800"}`}
                />
                <div
                  className={`w-3 h-1.5 rounded-full ${bmi >= 18.5 && bmi <= 24.9 ? "bg-emerald-400" : "bg-gray-800"}`}
                />
                <div
                  className={`w-3 h-1.5 rounded-full ${bmi >= 25 && bmi <= 29.9 ? "bg-orange-400" : "bg-gray-800"}`}
                />
                <div
                  className={`w-3 h-1.5 rounded-full ${bmi >= 30 ? "bg-red-400" : "bg-gray-800"}`}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!bmi || isPending}
            className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-800 disabled:text-gray-600 text-background font-bold rounded-xl transition shadow-lg shadow-primary/20 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Result
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
