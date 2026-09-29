import { AlertTriangle } from "lucide-react";

const ErrorAlert = ({
  message = "Something went wrong",
}: {
  message?: string;
}) => (
  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
    <AlertTriangle className="w-4 h-4" /> {message}
  </div>
);

export default ErrorAlert;
