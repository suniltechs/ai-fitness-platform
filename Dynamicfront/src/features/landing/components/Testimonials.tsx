import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import api from "@/api/axios";
import TestimonialForm from "@/components/testimonials/TestimonialForm";

interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  imageUrl: string;
  rating: number;
  review: string;
}

const fallbackTestimonials = [
  {
    _id: "1",
    name: "James Parker",
    role: "Competitive Bodybuilder",
    imageUrl: "https://i.pravatar.cc/150?u=james",
    rating: 5,
    review:
      "Dynamic Gym completely changed my training approach. The personalized programs and expert guidance helped me win my first regional competition in just 8 months.",
  },
  {
    _id: "2",
    name: "Priya Sharma",
    role: "Marathon Runner",
    imageUrl: "https://i.pravatar.cc/150?u=priya",
    rating: 5,
    review:
      "The trainers here understand endurance athletics like no one else. I shaved 20 minutes off my marathon time thanks to their conditioning programs.",
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get("/api/v1/testimonials/public");
      if (data.success && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
      setTestimonials(fallbackTestimonials);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const paginate = useCallback(
    (dir: number) => {
      if (testimonials.length === 0) return;
      setDirection(dir);
      setCurrent(
        (prev) => (prev + dir + testimonials.length) % testimonials.length,
      );
    },
    [testimonials.length],
  );

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate, testimonials.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  if (isLoading) {
    return (
      <section className="py-24 md:py-32 bg-background relative flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </section>
    );
  }

  const t = testimonials[current];

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Deco */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Info & Nav */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block text-accent font-bold tracking-[0.25em] text-[10px] uppercase mb-6 px-4 py-2 rounded-full bg-accent/5 border border-accent/10"
            >
              Real Stories
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8"
            >
              WHAT OUR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                MEMBERS
              </span>{" "}
              SAY
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg mb-8 max-w-md mx-auto lg:mx-0"
            >
              Join thousands of athletes who transformed their lives with our
              proven training methodology and world-class community.
            </motion.p>

            {/* Share Your Story Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black font-bold tracking-[0.2em] rounded-full transition-all duration-300 transform hover:scale-105 group text-xs uppercase shadow-xl backdrop-blur-sm"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Share Your Story
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            {testimonials.length > 1 && (
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => paginate(-1)}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background hover:scale-110 transition-all duration-300 group"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background hover:scale-110 transition-all duration-300 group"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Dots */}
                <div className="flex gap-2 ml-4">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1);
                        setCurrent(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === current
                          ? "w-10 bg-primary"
                          : "w-3 bg-white/10 hover:bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Testimonial Card */}
          {testimonials.length > 0 && (
            <div className="lg:col-span-7 relative">
              {/* Decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative min-h-[400px] flex items-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <div className="group relative rounded-[40px] bg-white/[0.03] border border-white/10 p-10 md:p-16 backdrop-blur-xl overflow-hidden hover:border-primary/30 transition-colors duration-500">
                      {/* Animated Border Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Quote Icon */}
                      <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Quote className="w-24 h-24 text-primary" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex gap-1 mb-8">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-primary fill-primary"
                            />
                          ))}
                        </div>

                        <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium italic leading-[1.4] mb-12">
                          "{t.review}"
                        </p>

                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                            <img
                              src={t.imageUrl}
                              alt={t.name}
                              className="w-16 h-16 rounded-full border-2 border-primary/50 object-cover relative z-10 bg-gray-900"
                            />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white tracking-tight">
                              {t.name}
                            </h4>
                            <p className="text-primary font-bold text-sm tracking-widest uppercase mt-0.5">
                              {t.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Navigation */}
              {testimonials.length > 1 && (
                <div className="flex lg:hidden items-center justify-center gap-6 mt-12">
                  <button
                    onClick={() => paginate(-1)}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === current ? "w-6 bg-primary" : "w-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => paginate(1)}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TestimonialForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
        }}
      />
    </section>
  );
};

export default Testimonials;
