import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "0",
    description: "Perfect for casual gym-goers tracking basics.",
    features: [
      "Workout Tracking",
      "Attendance Log",
      "BMI Calculator",
      "Mobile Access",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "3000",
    description: "Ideal for serious athletes and gym owners.",
    features: [
      "Everything in Basic",
      "Diet & Macro Tracking",
      "Unlimited Workouts",
      "Admin Dashboard",
      "Announcements",
    ],
    buttonText: "Go Pro Now",
    highlight: true,
  },
  {
    name: "Premium",
    price: "10000",
    description: "Custom solutions for large gym enterprises.",
    features: [
      "Everything in Pro",
      "Custom Branding",
      "Multiple Branch Admin",
      "API Access",
      "Priority Support",
    ],
    buttonText: "Contact Sales",
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-bold tracking-widest text-sm uppercase mb-4"
          >
            Invest in yourself
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            CHOOSE YOUR <span className="text-primary italic">STRENGTH</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-[40px] border flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? "bg-white/10 border-primary shadow-2xl shadow-primary/10 scale-105 z-20"
                  : "bg-white/5 border-white/10 grayscale-[0.5] hover:grayscale-0"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-background px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div
                      className={`p-1 rounded-full ${plan.highlight ? "bg-primary" : "bg-white/10"}`}
                    >
                      <Check
                        className={`w-3 h-3 ${plan.highlight ? "text-background" : "text-primary"}`}
                      />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-black transition-all transform active:scale-95 ${
                  plan.highlight
                    ? "bg-primary text-background hover:bg-primary-dark shadow-lg shadow-primary/20"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                {plan.buttonText}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Secure Payment
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
