import { useState, useRef } from "react";
import { X, Upload, Star, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/api/axios";

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialForm = ({ isOpen, onClose }: TestimonialFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    review: "",
  });
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a profile picture");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("review", formData.review);
    data.append("rating", rating.toString());
    data.append("image", image);

    setIsSubmitting(true);
    try {
      await api.post("/api/v1/testimonials", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(
        "Testimonial submitted successfully! Waiting for approval.",
      );
      setFormData({ name: "", role: "", review: "" });
      setRating(5);
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit testimonial",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
          Share Your <span className="text-primary">Story</span>
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          Tell us about your experience and inspire others.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-700 hover:border-primary/50 flex flex-col items-center justify-center bg-gray-950/50 overflow-hidden group transition-colors"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                      Change
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary uppercase tracking-widest text-center px-2 leading-tight">
                    Upload Photo
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
                Role / Title
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. Member, Athlete"
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-primary fill-primary"
                        : "text-gray-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-0.5">
              Your Review
            </label>
            <textarea
              required
              rows={4}
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              placeholder="Tell us what you loved..."
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Testimonial"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialForm;
