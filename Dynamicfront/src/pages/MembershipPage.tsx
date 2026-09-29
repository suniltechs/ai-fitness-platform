import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Crown,
  Rocket,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";

const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    price: "3000",
    description: "Perfect for beginners starting their fitness journey.",
    features: [
      "Gym Floor Access",
      "Basic Equipment Usage",
      "Locker Room Access",
      "1 Group Class / Week",
      "Mobile App Access",
    ],
    buttonText: "Get Started",
    highlight: false,
    gradient: "from-white/5 to-white/[0.02]",
    borderColor: "border-white/10",
  },
  {
    name: "Pro",
    icon: Crown,
    price: "5000",
    description: "For dedicated athletes who want the full experience.",
    features: [
      "Everything in Starter",
      "Unlimited Group Classes",
      "Personal Trainer (2x/month)",
      "Nutrition Consultation",
      "Sauna & Recovery Zone",
      "Guest Pass (1/month)",
      "Priority Booking",
    ],
    buttonText: "Go Pro",
    highlight: true,
    gradient: "from-primary/10 to-secondary/5",
    borderColor: "border-primary/30",
  },
  {
    name: "Elite",
    icon: Rocket,
    price: "10000",
    description: "The ultimate package for those who demand the best.",
    features: [
      "Everything in Pro",
      "Unlimited PT Sessions",
      "Custom Meal Plans",
      "Recovery & Massage",
      "Exclusive Member Events",
      "Multi-Location Access",
      "24/7 Gym Access",
      "Dedicated Account Manager",
    ],
    buttonText: "Go Elite",
    highlight: false,
    gradient: "from-secondary/10 to-accent/5",
    borderColor: "border-secondary/20",
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. You'll only pay the prorated difference when upgrading.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Absolutely! We offer a 7-day free trial for all new members. No credit card required. Experience everything EliteFit has to offer before committing.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "You can cancel anytime with no cancellation fees. Simply notify us 30 days before your next billing date. We believe in earning your membership every month.",
  },
  {
    question: "Do you offer student or corporate discounts?",
    answer:
      "Yes! We provide 15% off for students with valid ID and customized corporate packages. Contact our team for group rates and special enterprise plans.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, UPI, bank transfers, and digital wallets. All payments are processed securely through our encrypted payment system.",
  },
];

const MembershipPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&auto=format&fit=crop"
            alt="Membership"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-accent font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-accent/5 border border-accent/10"
          >
            Invest In Yourself
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            MEMBERSHIP{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              PLANS
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg"
          >
            Choose the plan that matches your ambition. Every plan includes a
            7-day free trial.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 md:p-10 rounded-3xl border flex flex-col transition-all duration-500 bg-gradient-to-b ${plan.gradient} ${plan.borderColor} ${
                  plan.highlight
                    ? "scale-100 md:scale-105 shadow-2xl shadow-primary/10 z-10"
                    : "hover:border-white/20"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.highlight ? "bg-primary/20" : "bg-white/5"
                      }`}
                    >
                      <plan.icon
                        className={`w-5 h-5 ${
                          plan.highlight ? "text-primary" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl md:text-5xl font-black text-white">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3.5 mb-8 flex-grow">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <div
                        className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                          plan.highlight ? "bg-primary" : "bg-white/10"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            plan.highlight ? "text-background" : "text-primary"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Link
                  to="/register"
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all duration-300 hover:scale-[1.02] active:scale-95 block ${
                    plan.highlight
                      ? "bg-primary text-background hover:bg-primary-dark shadow-lg shadow-primary/20"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {plan.buttonText}
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> 7-Day Free Trial
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              FREQUENTLY{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ASKED
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-semibold text-sm md:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
            className="rounded-3xl bg-gradient-to-r from-accent/10 via-white/[0.03] to-primary/10 border border-white/10 p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                STILL{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                  UNSURE?
                </span>
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-base md:text-lg">
                Book a free consultation with our team. We'll help you find the
                perfect plan for your goals and budget.
              </p>
              <button
                onClick={() => navigate("/contact-us")}
                className="inline-flex px-10 py-4 bg-white text-background font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/10"
              >
                Book Free Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MembershipPage;
