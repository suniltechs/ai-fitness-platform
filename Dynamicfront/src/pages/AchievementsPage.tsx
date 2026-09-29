import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Users,
  Star,
  Calendar,
  Loader2,
  ImageOff,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";
import api from "@/api/axios";

// ─── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ─── Static Stats ────────────────────────────────────────────────────────────
const stats = [
  {
    icon: Trophy,
    value: 45,
    suffix: "+",
    label: "Awards Won",
    color: "text-primary",
  },
  {
    icon: Users,
    value: 2500,
    suffix: "+",
    label: "Members Transformed",
    color: "text-secondary",
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    color: "text-accent",
  },
  {
    icon: Medal,
    value: 120,
    suffix: "+",
    label: "Competition Wins",
    color: "text-primary",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────
interface Milestone {
  _id: string;
  year: string;
  title: string;
  description: string;
}

interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
const AchievementsPage = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const { data } = await api.get("/api/v1/achievements/milestones");
        setMilestones(data.milestones);
      } catch {
        console.error("Failed to fetch milestones");
      } finally {
        setLoadingMilestones(false);
      }
    };

    const fetchGallery = async () => {
      try {
        const { data } = await api.get("/api/v1/achievements/gallery");
        setGalleryImages(data.images);
      } catch {
        console.error("Failed to fetch gallery");
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchMilestones();
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=80&auto=format&fit=crop"
            alt="Achievements"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/10 blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
          >
            Our Journey
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            OUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              ACHIEVEMENTS
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg"
          >
            A decade of dedication, transformation, and excellence. Here's what
            we've accomplished together.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline — Dynamic Milestones */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              OUR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                MILESTONES
              </span>
            </h2>
          </div>

          {loadingMilestones ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p className="font-medium">Milestones coming soon</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px" />

              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 mb-12 last:mb-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background -translate-x-1/2 mt-1.5 z-10" />

                  {/* Content */}
                  <div
                    className={`ml-10 md:ml-0 md:w-[45%] ${
                      i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`${
                            i % 2 === 0 ? "md:order-last md:ml-auto" : ""
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-primary font-bold text-sm">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-[45%]" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery — Dynamic Images */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              GALLERY OF{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                EXCELLENCE
              </span>
            </h2>
          </div>

          {loadingGallery ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ImageOff className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p className="font-medium">Gallery coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || `Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AchievementsPage;
