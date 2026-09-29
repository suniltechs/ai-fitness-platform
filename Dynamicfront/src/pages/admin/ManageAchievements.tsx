import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  Loader2,
} from "lucide-react";
import api from "@/api/axios";
import toast from "react-hot-toast";

interface Milestone {
  _id: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption: string;
  order: number;
}

const ManageAchievements = () => {
  const [tab, setTab] = useState<"milestones" | "gallery">("milestones");

  // ─── Milestones State ──────────────────────────────────────────────────────
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null,
  );
  const [milestoneForm, setMilestoneForm] = useState({
    year: "",
    title: "",
    description: "",
  });
  const [savingMilestone, setSavingMilestone] = useState(false);

  // ─── Gallery State ─────────────────────────────────────────────────────────
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch Data ────────────────────────────────────────────────────────────
  const fetchMilestones = async () => {
    try {
      const { data } = await api.get("/api/v1/achievements/milestones");
      setMilestones(data.milestones);
    } catch {
      toast.error("Failed to load milestones");
    } finally {
      setLoadingMilestones(false);
    }
  };

  const fetchImages = async () => {
    try {
      const { data } = await api.get("/api/v1/achievements/gallery");
      setImages(data.images);
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchImages();
  }, []);

  // ─── Milestone Handlers ────────────────────────────────────────────────────
  const handleSaveMilestone = async () => {
    if (
      !milestoneForm.year ||
      !milestoneForm.title ||
      !milestoneForm.description
    ) {
      toast.error("All fields are required");
      return;
    }
    setSavingMilestone(true);
    try {
      if (editingMilestone) {
        await api.patch(
          `/api/v1/achievements/milestones/${editingMilestone._id}`,
          milestoneForm,
        );
        toast.success("Milestone updated!");
      } else {
        await api.post("/api/v1/achievements/milestones", milestoneForm);
        toast.success("Milestone created!");
      }
      resetMilestoneForm();
      fetchMilestones();
    } catch {
      toast.error("Failed to save milestone");
    } finally {
      setSavingMilestone(false);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    try {
      await api.delete(`/api/v1/achievements/milestones/${id}`);
      toast.success("Milestone deleted!");
      fetchMilestones();
    } catch {
      toast.error("Failed to delete milestone");
    }
  };

  const startEditMilestone = (m: Milestone) => {
    setEditingMilestone(m);
    setMilestoneForm({
      year: m.year,
      title: m.title,
      description: m.description,
    });
    setShowMilestoneForm(true);
  };

  const resetMilestoneForm = () => {
    setMilestoneForm({ year: "", title: "", description: "" });
    setEditingMilestone(null);
    setShowMilestoneForm(false);
  };

  // ─── Gallery Handlers ──────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    setUploading(true);
    try {
      await api.post("/api/v1/achievements/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image uploaded!");
      setCaption("");
      fetchImages();
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/api/v1/achievements/gallery/${id}`);
      toast.success("Image deleted!");
      fetchImages();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            Manage Achievements
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage milestones and gallery images displayed on the public
            Achievements page.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => setTab("milestones")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === "milestones"
              ? "bg-primary text-background"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Milestones
        </button>
        <button
          onClick={() => setTab("gallery")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === "gallery"
              ? "bg-primary text-background"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Gallery
        </button>
      </div>

      {/* ─── Milestones Tab ─────────────────────────────────────────────────── */}
      {tab === "milestones" && (
        <div className="space-y-4">
          {/* Add Button */}
          {!showMilestoneForm && (
            <button
              onClick={() => setShowMilestoneForm(true)}
              className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-background font-bold rounded-xl text-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          )}

          {/* Form */}
          {showMilestoneForm && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-sm">
                {editingMilestone ? "Edit Milestone" : "New Milestone"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">
                    Year
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.year}
                    onChange={(e) =>
                      setMilestoneForm((p) => ({ ...p, year: e.target.value }))
                    }
                    placeholder="e.g. 2014"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.title}
                    onChange={(e) =>
                      setMilestoneForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Dynamic Gym Founded"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">
                  Description
                </label>
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) =>
                    setMilestoneForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Brief description of this milestone..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveMilestone}
                  disabled={savingMilestone}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-xl text-sm transition flex items-center gap-2"
                >
                  {savingMilestone ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingMilestone ? "Update" : "Save"}
                </button>
                <button
                  onClick={resetMilestoneForm}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 border border-gray-700"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* List */}
          {loadingMilestones ? (
            <div className="text-center py-12 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading milestones...
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-2xl border border-gray-800">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-gray-600" />
              <p className="font-medium">No milestones yet</p>
              <p className="text-xs mt-1">
                Add your first milestone to showcase your journey.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((m) => (
                <div
                  key={m._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start justify-between gap-4 hover:border-gray-700 transition"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-black text-sm">
                        {m.year}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">
                        {m.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {m.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEditMilestone(m)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-primary transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(m._id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Gallery Tab ────────────────────────────────────────────────────── */}
      {tab === "gallery" && (
        <div className="space-y-4">
          {/* Upload Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold text-sm">Upload Image</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Optional caption..."
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-bold rounded-xl text-sm transition flex items-center gap-2 whitespace-nowrap"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? "Uploading..." : "Choose & Upload"}
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          {loadingImages ? (
            <div className="text-center py-12 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading gallery...
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-2xl border border-gray-800">
              <ImageIcon className="w-8 h-8 mx-auto mb-3 text-gray-600" />
              <p className="font-medium">No gallery images yet</p>
              <p className="text-xs mt-1">
                Upload images to showcase in the Gallery of Excellence.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-900 border border-gray-800"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex-1 min-w-0">
                      {img.caption && (
                        <p className="text-white text-xs font-medium truncate">
                          {img.caption}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteImage(img._id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAchievements;
