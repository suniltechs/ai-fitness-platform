import { useState, type FormEvent } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useMyDiet, useDietMacros, useAddDiet } from "@/hooks/useDiet";
import { useRecommendDiet } from "@/hooks/useAI";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { Apple, Sparkles, X, Utensils, Info } from "lucide-react";

const MyDiet = () => {
  const { data: entries, isLoading: dl } = useMyDiet();
  const { data: macros, isLoading: ml } = useDietMacros();
  const addDiet = useAddDiet();

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  // AI Recommender State
  const [showAIModal, setShowAIModal] = useState(false);
  const [preferences, setPreferences] = useState("");
  const [allergies, setAllergies] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const recommendDiet = useRecommendDiet();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addDiet.mutate(
      {
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
      },
      {
        onSuccess: () => {
          toast.success("Diet entry logged!");
          setCalories("");
          setProtein("");
          setCarbs("");
          setFat("");
        },
        onError: () => toast.error("Failed to log diet"),
      },
    );
  };

  const handleGenerateDiet = (e: FormEvent) => {
    e.preventDefault();
    recommendDiet.mutate(
      { preferences, allergies },
      {
        onSuccess: (data) => {
          setAiResult(data);
          toast.success("Diet plan generated!");
        },
        onError: () => toast.error("Failed to generate diet plan"),
      }
    );
  };

  const fillFormWithMacros = () => {
    if (!aiResult?.macros) return;
    setCalories(aiResult.macros.calories.toString());
    setProtein(aiResult.macros.protein.toString());
    setCarbs(aiResult.macros.carbs.toString());
    setFat(aiResult.macros.fat.toString());
    toast.success("Macros loaded into the form!");
    setShowAIModal(false);
  };

  if (dl || ml) return <LoadingSpinner />;

  const pieData = macros?.macroPercentages
    ? [
        { name: "Protein", value: Math.round(macros.macroPercentages.protein) },
        { name: "Carbs", value: Math.round(macros.macroPercentages.carbs) },
        { name: "Fat", value: Math.round(macros.macroPercentages.fat) },
      ]
    : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Diet Tracker</h2>
          <p className="text-gray-400">
            Log daily meals and track your macronutrient distribution.
          </p>
        </div>
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition whitespace-nowrap w-full sm:w-auto shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Get AI Recommendation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Macro Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Macro Distribution
            </h3>
          </div>

          {pieData.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    <linearGradient
                      id="colorProtein"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#eef7adff" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#dffd00ff"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient id="colorCarbs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b9ca82ff" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#809e1cff"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#02f9e0ff" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#005C53"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData}
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    <Cell fill="url(#colorProtein)" />
                    <Cell fill="url(#colorCarbs)" />
                    <Cell fill="url(#colorFat)" />
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-950/90 backdrop-blur-md border border-gray-800 px-4 py-3 rounded-xl shadow-2xl">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">
                              {payload[0].name}
                            </p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-black text-white">
                                {payload[0].value}%
                              </span>
                              <span className="text-xs font-bold text-gray-400">
                                of total
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Summary Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-20">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Total
                </span>
                <span className="text-2xl font-black text-white leading-none">
                  {macros?.totals?.totalCalories || 0}
                </span>
                <span className="text-[10px] font-bold text-primary mt-1">
                  kcal
                </span>
              </div>

              {/* Legend Summary */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="flex flex-col items-center p-2 rounded-xl bg-gray-800/20 border border-gray-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-1" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Protein
                  </span>
                  <span className="text-xs font-black text-white">
                    {macros?.macroPercentages?.protein.toFixed(0)}%
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-gray-800/20 border border-gray-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-1" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Carbs
                  </span>
                  <span className="text-xs font-black text-white">
                    {macros?.macroPercentages?.carbs.toFixed(0)}%
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-gray-800/20 border border-gray-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mb-1" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Fat
                  </span>
                  <span className="text-xs font-black text-white">
                    {macros?.macroPercentages?.fat.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Apple className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                No diet data yet. Log your first meal!
              </p>
            </div>
          )}
        </div>

        {/* Add Diet Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Log Today's Meal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Calories
                </label>
                <input
                  type="number"
                  required
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g. 2200"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    required
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    required
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    required
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={addDiet.isPending}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-medium rounded-lg transition"
              >
                {addDiet.isPending ? "Saving..." : "Log Diet"}
              </button>
            </div>
          </form>

          {/* Recent Entries */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Recent Entries
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {entries?.slice(0, 5).map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 text-sm"
                >
                  <span className="text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className="text-white font-medium">
                    {entry.calories} cal
                  </span>
                  <span className="text-gray-500 text-xs">
                    P{entry.protein} C{entry.carbs} F{entry.fat}
                  </span>
                </div>
              ))}
              {(!entries || entries.length === 0) && (
                <p className="text-gray-500 text-sm">No entries yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Diet Recommender Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => {
                setShowAIModal(false);
                setAiResult(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Utensils className="w-5 h-5" />
                </span>
                AI Diet Recommender
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Get a personalized 1-day meal plan based on your goals and preferences.
              </p>
            </div>

            <div className="p-6">
              {!aiResult ? (
                <form onSubmit={handleGenerateDiet} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Dietary Preferences
                    </label>
                    <input
                      type="text"
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      placeholder="e.g., Vegetarian, High Protein, Keto, Indian"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Allergies or Restrictions
                    </label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g., Peanuts, Dairy, Gluten-free"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={recommendDiet.isPending}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex justify-center items-center gap-2 mt-4"
                  >
                    {recommendDiet.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Meal Plan
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Results Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Breakfast</h4>
                      <p className="text-sm text-gray-200">{aiResult.breakfast}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Lunch</h4>
                      <p className="text-sm text-gray-200">{aiResult.lunch}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Snacks</h4>
                      <p className="text-sm text-gray-200">{aiResult.snacks}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dinner</h4>
                      <p className="text-sm text-gray-200">{aiResult.dinner}</p>
                    </div>
                  </div>

                  <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Estimated Daily Macros
                      </h4>
                      <div className="flex gap-4 text-sm font-bold text-white">
                        <span>{aiResult.macros.calories} kcal</span>
                        <span className="text-gray-400">•</span>
                        <span>{aiResult.macros.protein}g Protein</span>
                        <span className="text-gray-400">•</span>
                        <span>{aiResult.macros.carbs}g Carbs</span>
                        <span className="text-gray-400">•</span>
                        <span>{aiResult.macros.fat}g Fat</span>
                      </div>
                    </div>
                    <button
                      onClick={fillFormWithMacros}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition whitespace-nowrap"
                    >
                      Use These Macros
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setAiResult(null)}
                    className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
                  >
                    Generate Another Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDiet;
