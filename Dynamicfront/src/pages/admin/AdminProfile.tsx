import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import type { UserProfile } from "@/hooks/useProfile";
import { toast } from "react-hot-toast";
import { User, Info } from "lucide-react";

const AdminProfile = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    gymName: "",
    address: "",
    contactPhone: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        gymName: profile.gymName || "",
        address: profile.address || "",
        contactPhone: profile.contactPhone || "",
        profilePicture: profile.profilePicture || "",
      });
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update profile",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Admin <span className="text-primary">Profile</span>
          </h2>
          <p className="text-gray-400 mt-1 font-medium">
            Manage your personal and gym business information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Section */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
              Account Details
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="profile-upload"
                  className="w-32 h-32 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 cursor-pointer relative"
                >
                  {formData.profilePicture ? (
                    <>
                      <img
                        src={formData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-bold text-white uppercase tracking-tighter">
                          Update
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-600 group-hover:text-primary transition-colors">
                      <User className="w-10 h-10" />
                      <span className="text-[10px] font-bold uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                </label>
                <div className="mt-3 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                    Avatar Preview
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      value={profile?.email}
                      disabled
                      className="w-full bg-gray-950/30 border border-gray-800/50 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <p className="text-xs text-primary/80 leading-relaxed">
                    <span className="font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Tip:
                    </span>
                    Click the avatar bucket to upload a local photo. Recommended
                    size: 1:1 ratio, max 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gym Section */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/20 text-primary">
            <h3 className="text-sm font-bold uppercase tracking-widest">
              Gym Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Gym Name
              </label>
              <input
                type="text"
                name="gymName"
                value={formData.gymName}
                onChange={handleChange}
                placeholder="e.g. Iron Paradise Gym"
                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Physical Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the full address of your gym"
                rows={3}
                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/20 text-primary">
            <h3 className="text-sm font-bold uppercase tracking-widest">
              Contact Details
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-2 max-w-md">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className={`
              px-8 py-3 bg-primary hover:bg-primary-dark text-background font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95
              ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
