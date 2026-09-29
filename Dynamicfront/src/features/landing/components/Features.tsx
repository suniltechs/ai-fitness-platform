import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Bell,
  Layers,
} from "lucide-react";

const featureList = [
  {
    title: "Workout Tracking",
    description:
      "Detailed logging of your daily routines with sets, reps, and weights.",
    icon: TrendingUp,
    color: "from-primary/20 to-transparent",
  },
  {
    title: "Attendance Monitoring",
    description: "Real-time check-ins and performance history for gym members.",
    icon: Calendar,
    color: "from-secondary/20 to-transparent",
  },
  {
    title: "BMI & Metrics",
    description: "Advanced BMI calculator and body metric tracking over time.",
    icon: BarChart3,
    color: "from-accent/20 to-transparent",
  },
  {
    title: "Diet Tracking",
    description:
      "Log your nutrition and monitor macros to reach your weight goals.",
    icon: Layers,
    color: "from-primary/20 to-transparent",
  },
  {
    title: "Notifications",
    description: "Instant updates on announcements, schedules, and reminders.",
    icon: Bell,
    color: "from-secondary/20 to-transparent",
  },
  {
    title: "Admin Dashboard",
    description:
      "Complete control for gym owners to manage students and staff.",
    icon: Users,
    color: "from-accent/20 to-transparent",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest text-sm uppercase mb-4"
          >
            Capabilities
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            POWERTRAIN YOUR{" "}
            <span className="text-secondary italic">PROGRESS</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative p-8 rounded-[32px] bg-white/5 border border-white/10 overflow-hidden"
            >
              {/* Card Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-background" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
