import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  FileText,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappNumber = "+919791957395";
    const text = `*New Inquiry from Dynamic Gym Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A*Message:* ${formData.message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    // Simulate a brief delay to show "Sending..." state
    await new Promise((resolve) => setTimeout(resolve, 800));

    window.open(whatsappUrl, "_blank");

    toast.success("Redirecting to WhatsApp...", {
      style: {
        background: "#111827",
        color: "#fff",
        border: "1px solid #374151",
      },
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfos = [
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      label: "Call Us",
      value: "+91 9791957395",
      description: "Mon-Sat, 5am - 10pm",
    },
    {
      icon: <Mail className="w-5 h-5 text-secondary" />,
      label: "Email Us",
      value: "gymbarathi@gmail.com",
      description: "Support within 24 hours",
    },
    {
      icon: <MapPin className="w-5 h-5 text-accent" />,
      label: "Visit Us",
      value: "IOB Bank Floor, Nannilam",
      description: "Thiruvarur, 610105",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80&auto=format&fit=crop"
            alt="Contact"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.25em] text-xs uppercase mb-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            CONTACT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              OUR TEAM
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg"
          >
            Have questions about memberships, training, or facilities? We're
            here to help you start your journey.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-20 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Info Col */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  Why <span className="text-primary">Connect</span> With Us?
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Whether you're a beginner looking for guidance or an athlete
                  wanting to level up, our expert team is ready to assist you.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {contactInfos.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-5 group hover:border-primary/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        {info.label}
                      </p>
                      <p className="text-lg font-bold text-white mb-0.5">
                        {info.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form Col */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-7 shadow-2xl"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Subject
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Membership Inquiry"
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" /> Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us more about how we can help..."
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-background rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-primary/20"
                  >
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
