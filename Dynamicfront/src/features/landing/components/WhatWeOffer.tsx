import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  Users,
  Apple,
  HeartPulse,
  Flame,
  StretchHorizontal,
} from "lucide-react";

const offerings = [
  {
    title: "Personal Training",
    description:
      "One-on-one sessions with certified trainers who design custom programs tailored to your goals.",
    icon: Dumbbell,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderHover: "group-hover:border-primary/40",
  },
  {
    title: "Group Classes",
    description:
      "High-energy group workouts including HIIT, spin, boxing, and functional training.",
    icon: Users,
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
    borderHover: "group-hover:border-secondary/40",
  },
  {
    title: "Nutrition Planning",
    description:
      "Expert nutritionists craft meal plans and macro tracking to fuel your performance.",
    icon: Apple,
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    borderHover: "group-hover:border-accent/40",
  },
  {
    title: "Cardio Zone",
    description:
      "State-of-the-art treadmills, bikes, and rowing machines for peak cardiovascular fitness.",
    icon: HeartPulse,
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
    borderHover: "group-hover:border-secondary/40",
  },
  {
    title: "Strength Training",
    description:
      "Fully equipped free weights area, power racks, and cable machines for serious lifters.",
    icon: Flame,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderHover: "group-hover:border-primary/40",
  },
  {
    title: "Silambam & Yoga",
    description:
      "Dedicated studio for yoga, silambam, and mobility classes to balance your training.",
    icon: StretchHorizontal,
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    borderHover: "group-hover:border-accent/40",
  },
];

const WhatWeOffer = () => {
  const navigate = useNavigate();
  return (
    <section
      id="offers"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
          >
            Our Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            WHAT WE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              OFFER
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-base md:text-lg"
          >
            Everything you need to build the body and mindset of a champion, all
            under one roof.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => navigate("/contact-us")}
              className={`group relative p-7 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 ${item.borderHover} transition-all duration-500 overflow-hidden cursor-pointer`}
            >
              {/* Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  <item.icon
                    className={`w-7 h-7 ${item.iconColor} transition-colors`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>

                {/* Arrow Indicator */}
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">
                  <span>Learn more</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
