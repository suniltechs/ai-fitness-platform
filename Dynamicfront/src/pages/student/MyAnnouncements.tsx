import React from "react";
import { useMyAnnouncements } from "@/hooks/useAnnouncements";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { Megaphone, Inbox, Clock, Users, User, Layers } from "lucide-react";

const targetConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  all: {
    label: "Everyone",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    icon: <Users className="w-3 h-3" />,
  },
  batch: {
    label: "Batch",
    color: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    icon: <Layers className="w-3 h-3" />,
  },
  individual: {
    label: "You",
    color: "bg-primary/15 text-primary border-primary/20",
    icon: <User className="w-3 h-3" />,
  },
  both: {
    label: "Targeted",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    icon: <Users className="w-3 h-3" />,
  },
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MyAnnouncements = () => {
  const { data: announcements, isLoading, error } = useMyAnnouncements();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Announcements</h2>
      <p className="text-gray-400 mb-8">
        Stay up to date with the latest updates from your gym.
      </p>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Failed to load announcements" />}

      {!isLoading && !error && announcements?.length === 0 && (
        <div className="text-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl">
          <Inbox className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-600">
            No announcements yet
          </p>
          <p className="text-xs text-gray-700 mt-1">
            When your gym posts updates, they'll appear here.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {announcements?.map((a, idx) => {
          const cfg = targetConfig[a.target] || targetConfig.all;
          return (
            <div
              key={a._id}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all group relative overflow-hidden"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start gap-4 relative">
                {/* Icon */}
                <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl bg-primary/10 items-center justify-center text-primary mt-0.5">
                  <Megaphone className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <Clock className="w-3 h-3" />
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                    {a.title}
                  </h3>

                  {/* Message */}
                  <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed whitespace-pre-line">
                    {a.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAnnouncements;
