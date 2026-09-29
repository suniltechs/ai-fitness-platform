import { motion } from "framer-motion";
import { Target, Heart, Shield, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Goal-Driven",
    description: "Every program is built around your personal milestones.",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "A supportive environment where everyone belongs.",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Safety & Quality",
    description: "Premium equipment maintained to the highest standards.",
    color: "text-secondary",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Cutting-edge methods and technology for better results.",
    color: "text-primary",
  },
];

const AboutUs = () => {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop"
                alt="Gym environment"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl"
            >
              <div className="text-3xl md:text-4xl font-black text-primary">
                12+
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                Years of
                <br />
                Excellence
              </div>
            </motion.div>

            {/* Decorative Border */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-secondary/30 rounded-br-3xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-secondary font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              MORE THAN A GYM.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                A LIFESTYLE.
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-base md:text-lg">
              Founded in 2014, Dynamic Gym has grown from a single studio into a
              premier fitness destination. We believe that every person deserves
              access to world-class training, cutting-edge equipment, and a
              community that inspires greatness.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10 text-base md:text-lg">
              Our mission is simple: to help you become the strongest,
              healthiest, and most confident version of yourself. No matter
              where you start, we'll get you where you want to be.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="mt-0.5">
                    <value.icon className={`w-5 h-5 ${value.color}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">
                      {value.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
