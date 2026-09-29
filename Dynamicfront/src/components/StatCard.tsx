import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: ReactNode;
}

const colorMap: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  red: "text-red-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  pink: "text-pink-400",
};

const StatCard = ({ label, value, color = "primary", icon }: StatCardProps) => (
  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <p className="text-gray-400 text-sm">{label}</p>
      {icon && (
        <span className={`${colorMap[color] || "text-primary"} opacity-70`}>
          {icon}
        </span>
      )}
    </div>
    <p
      className={`text-3xl font-bold mt-2 ${colorMap[color] || "text-primary"}`}
    >
      {value}
    </p>
  </div>
);

export default StatCard;
