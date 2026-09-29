import BMICalculator from "@/features/student/components/BMICalculator";
import { useMyMetrics, useDeleteMetric } from "@/hooks/useMetrics";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { Trash2, Clock, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

const BMICalculatorPage = () => {
  const { data: metricsData, isLoading } = useMyMetrics();
  const deleteMetric = useDeleteMetric();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteMetric.mutate(id, {
        onSuccess: () => toast.success("Record deleted"),
        onError: () => toast.error("Failed to delete record"),
      });
    }
  };

  const getBmiCategory = (bmi: number | undefined) => {
    if (bmi === undefined || bmi === null)
      return { label: "N/A", color: "text-gray-500" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (bmi <= 24.9) return { label: "Normal", color: "text-emerald-400" };
    if (bmi <= 29.9) return { label: "Overweight", color: "text-orange-400" };
    return { label: "Obese", color: "text-red-400" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-2">BMI Calculator</h2>
          <p className="text-gray-400 leading-relaxed">
            Calculate your Body Mass Index (BMI) to understand your weight
            status relative to your height. Track your progress regularly for
            the best results.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <BMICalculator />

          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Understanding BMI</h3>
            <div className="space-y-3">
              {[
                {
                  label: "Underweight",
                  range: "Below 18.5",
                  color: "bg-blue-400",
                },
                {
                  label: "Normal Weight",
                  range: "18.5 – 24.9",
                  color: "bg-emerald-400",
                },
                {
                  label: "Overweight",
                  range: "25.0 – 29.9",
                  color: "bg-orange-400",
                },
                { label: "Obese", range: "30.0 or more", color: "bg-red-400" },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                    <span className="text-sm font-medium text-gray-300">
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs font-mono">
                    {cat.range}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 italic leading-relaxed">
              Note: BMI is a screening tool, not a diagnostic one. It doesn't
              measure body fat directly or account for muscle mass vs fat.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Recent History
              </h3>
              {metricsData?.metrics && (
                <span className="px-2 py-0.5 bg-gray-800 rounded text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {metricsData.metrics.length} Records
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800">
              {isLoading ? (
                <div className="flex items-center justify-center p-20">
                  <LoadingSpinner />
                </div>
              ) : !metricsData?.metrics || metricsData.metrics.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                  <BarChart2 className="w-10 h-10 text-gray-700" />
                  <div>
                    <p className="text-white font-medium">No records yet</p>
                    <p className="text-gray-500 text-sm">
                      Save your first BMI calculation to see the history.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-800/50">
                  {metricsData.metrics.map((m) => {
                    const cat = getBmiCategory(m.bmi);
                    return (
                      <div
                        key={m._id}
                        className="px-6 py-4 hover:bg-gray-800/30 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center bg-gray-800 rounded-lg p-2 min-w-[50px]">
                              <p className="text-lg font-bold text-white leading-none">
                                {m.bmi}
                              </p>
                              <p className="text-[9px] text-gray-500 uppercase mt-1 font-black">
                                BMI
                              </p>
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${cat.color}`}>
                                {cat.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(
                                  new Date(m.date),
                                  "MMM d, yyyy • h:mm a",
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">
                                {m.weight}{" "}
                                <span className="text-gray-500 text-xs">
                                  kg
                                </span>
                              </p>
                              <div className="mt-1 flex gap-1 justify-end">
                                <div
                                  className={`w-1 h-3 rounded-full ${m.bmi < 18.5 ? "bg-blue-400" : "bg-gray-800"}`}
                                />
                                <div
                                  className={`w-1 h-3 rounded-full ${m.bmi >= 18.5 && m.bmi <= 24.9 ? "bg-emerald-400" : "bg-gray-800"}`}
                                />
                                <div
                                  className={`w-1 h-3 rounded-full ${m.bmi >= 25 && m.bmi <= 29.9 ? "bg-orange-400" : "bg-gray-800"}`}
                                />
                                <div
                                  className={`w-1 h-3 rounded-full ${m.bmi >= 30 ? "bg-red-400" : "bg-gray-800"}`}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(m._id)}
                              disabled={deleteMetric.isPending}
                              className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculatorPage;
