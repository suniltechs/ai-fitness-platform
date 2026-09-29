import { useState, type ChangeEvent } from "react";
import { useImportStudents } from "@/hooks/useStudents";
import api from "@/api/axios";
import toast from "react-hot-toast";
import { FileDown, FileText, FileUp } from "lucide-react";

const ImportExport = () => {
  const [file, setFile] = useState<File | null>(null);
  const importMutation = useImportStudents();
  const [exporting, setExporting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Please select an Excel file first");
      return;
    }
    importMutation.mutate(file, {
      onSuccess: (data) => {
        toast.success(data.message || "Import successful!");
        setFile(null);
      },
      onError: () => toast.error("Import failed. Check file format."),
    });
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get("/api/v1/users/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "student_progress.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded!");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Import / Export</h2>
      <p className="text-gray-400 mb-8">Bulk student operations via Excel.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Import Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <FileDown className="w-5 h-5 text-primary" /> Import Students
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload an Excel file with columns: Name, Email, Phone, Batch
          </p>

          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center mb-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="cursor-pointer text-primary hover:text-primary/80 font-medium"
            >
              {file ? (
                <span className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> {file.name}
                </span>
              ) : (
                "Click to choose file"
              )}
            </label>
          </div>

          <button
            onClick={handleImport}
            disabled={!file || importMutation.isPending}
            className="w-full py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-medium rounded-lg transition"
          >
            {importMutation.isPending ? "Importing..." : "Import Students"}
          </button>
        </div>

        {/* Export Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-emerald-400" /> Export Progress
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Download student progress including attendance, workouts, and
            metrics.
          </p>

          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center mb-4">
            <p className="text-gray-400 text-sm">
              Generates an Excel file with all active students and their
              progress data.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
          >
            {exporting ? "Exporting..." : "Download Export"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
