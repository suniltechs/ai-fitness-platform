import { motion } from "framer-motion";
import { Instagram, Twitter } from "lucide-react";
import masterImg from "@/assets/master.jpeg";

const trainers = [
  {
    name: "Dr.B.Barathi",
    specialty: "Founder & Master",
    bio: "15+ years transforming lives with strength programs.",
    image: masterImg,
    socials: {
      instagram: "https://www.instagram.com/dr.barathi_official_/",
      twitter: "",
    },
  },
  {
    name: "Sarah Williams",
    specialty: "Yoga & Pilates",
    bio: "Certified yoga master helping clients find balance, flexibility, and inner peace.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop",
    socials: { instagram: "#", twitter: "#" },
  },
  {
    name: "David Chen",
    specialty: "HIIT & CrossFit",
    bio: "Former competitive athlete specializing in high-intensity metabolic training.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80&auto=format&fit=crop",
    socials: { instagram: "#", twitter: "#" },
  },
  {
    name: "Emily Rodriguez",
    specialty: "Nutrition & Wellness",
    bio: "Sports nutritionist crafting personalized meal plans for peak performance.",
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80&auto=format&fit=crop",
    socials: { instagram: "#", twitter: "#" },
  },
];

const Trainers = () => {
  return (
    <section
      id="trainers"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-secondary font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10"
          >
            Meet The Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            EXPERT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              TRAINERS
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-base md:text-lg"
          >
            Our world-class coaches bring decades of combined experience to help
            you reach your full potential.
          </motion.p>
        </div>

        {/* Trainer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-secondary/30 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-[420px] sm:h-80 overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                {/* Social Links Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {trainer.socials.instagram &&
                    trainer.socials.instagram !== "#" && (
                      <a
                        href={trainer.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  {trainer.socials.twitter &&
                    trainer.socials.twitter !== "#" && (
                      <a
                        href={trainer.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-background/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                  {trainer.specialty}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {trainer.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {trainer.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
