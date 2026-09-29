import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Star,
  RefreshCw,
} from "lucide-react";
import api from "@/api/axios";
import { toast } from "react-hot-toast";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get("/api/v1/testimonials");
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTestimonials();
  };

  const handleUpdateStatus = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    try {
      await api.patch(`/api/v1/testimonials/${id}/status`, { status });
      toast.success(`Testimonial ${status} successfully`);
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t)),
      );
    } catch (error) {
      console.error(`Failed to update status to ${status}`, error);
      toast.error(`Failed to mark as ${status}`);
    }
  };

  const handleReject = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to reject and permanently delete this testimonial?",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/v1/testimonials/${id}`);
      toast.success("Testimonial rejected and deleted");
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to reject testimonial", error);
      toast.error("Failed to reject testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await api.delete(`/api/v1/testimonials/${id}`);
      toast.success("Testimonial deleted successfully");
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete testimonial", error);
      toast.error("Failed to delete testimonial");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Testimonials</h1>
          <p className="text-gray-400 mt-1">
            Review, approve, or reject user testimonials.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Review</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {testimonials.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No testimonials found.</p>
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr
                    key={testimonial._id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-800"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {testimonial.role}
                          </div>
                          <div className="text-[10px] text-gray-600 mt-0.5">
                            {format(
                              new Date(testimonial.createdAt),
                              "MMM d, yyyy",
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < testimonial.rating
                                  ? "text-primary fill-primary"
                                  : "text-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className="line-clamp-2 text-gray-300"
                          title={testimonial.review}
                        >
                          "{testimonial.review}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          testimonial.status === "approved"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : testimonial.status === "rejected"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {testimonial.status.charAt(0).toUpperCase() +
                          testimonial.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {testimonial.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(testimonial._id, "approved")
                            }
                            className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {testimonial.status !== "rejected" && (
                          <button
                            onClick={() => handleReject(testimonial._id)}
                            className="p-1.5 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"
                            title="Reject & Delete"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2 border-l border-gray-800 pl-4"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;
