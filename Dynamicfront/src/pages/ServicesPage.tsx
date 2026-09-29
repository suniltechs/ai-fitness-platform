import { motion } from "framer-motion";
import {
  Dumbbell,
  Users,
  Apple,
  HeartPulse,
  Flame,
  StretchHorizontal,
  Footprints,
  Waves,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";

const services = [
  {
    title: "Personal Training",
    description:
      "One-on-one sessions with certified trainers who design custom programs tailored specifically to your goals, fitness level, and schedule. Get undivided attention and accelerated results.",
    icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80&auto=format&fit=crop",
    color: "from-primary/20",
  },
  {
    title: "Group Fitness Classes",
    description:
      "High-energy group sessions including HIIT, spin, boxing, and functional training. Experience the power of community-driven workouts that push you further.",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop",
    color: "from-secondary/20",
  },
  {
    title: "Nutrition Coaching",
    description:
      "Expert sports nutritionists craft personalized meal plans, macro tracking systems, and supplementation guides to fuel your body.",
    icon: Apple,
    image:
      "https://images.unsplash.com/photo-1617170007444-368999506742?w=600&q=80&auto=format&fit=crop",
    color: "from-accent/20",
  },
  {
    title: "Cardio & Endurance",
    description:
      "State-of-the-art treadmills, assault bikes, rowers, and SkiErgs. Structured endurance programs for runners, cyclists, and athletes of all levels.",
    icon: HeartPulse,
    image:
      "https://images.unsplash.com/photo-1758520705189-a6b56a7ae832?w=600&q=80&auto=format&fit=crop",
    color: "from-secondary/20",
  },
  {
    title: "Strength & Powerlifting",
    description:
      "Competition-grade power racks, platforms, and specialty bars. Programs designed for beginners to competitive powerlifters.",
    icon: Flame,
    image:
      "https://images.unsplash.com/photo-1534368270820-9de3d8053204?w=600&q=80&auto=format&fit=crop",
    color: "from-primary/20",
  },
  {
    title: "Yoga & Mindfulness",
    description:
      "Dedicated heated studio for yoga, pilates, and meditation. Restore balance, improve flexibility, and strengthen the mind-body connection.",
    icon: StretchHorizontal,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop",
    color: "from-accent/20",
  },
  {
    title: "Sports Performance",
    description:
      "Speed, agility, and plyometric training for competitive athletes. Sport-specific conditioning that gives you the edge on game day.",
    icon: Footprints,
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80&auto=format&fit=crop",
    color: "from-primary/20",
  },
  {
    title: "Recovery & Wellness",
    description:
      "Sauna, cold plunge, foam rolling stations, and sports massage. Optimize your recovery to train harder and stay injury-free.",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80&auto=format&fit=crop",
    color: "from-secondary/20",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80&auto=format&fit=crop"
            alt="Services"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-secondary font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10"
          >
            What We Do
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            OUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              SERVICES
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg"
          >
            Comprehensive fitness solutions designed for every goal, every
            level, and every lifestyle.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${service.color} to-transparent opacity-30`}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">
                      <span>Learn more</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-primary/10 via-white/[0.03] to-secondary/10 border border-white/10 p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                READY TO{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  GET STARTED?
                </span>
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-base md:text-lg">
                Choose a plan that fits your goals and start training with the
                best. Your first week is on us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/membership"
                  className="px-8 py-4 bg-primary hover:bg-primary-dark text-background font-black rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
                >
                  View Membership Plans
                </Link>
                <Link
                  to="/contact-us"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
                >
                  Book Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
