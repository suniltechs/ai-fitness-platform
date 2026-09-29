import { useState } from "react";
import {
  Instagram,
  Youtube,
  Facebook,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    navigate("/contact-us");
  };

  return (
    <footer
      id="contact"
      className="bg-background pt-24 pb-8 border-t border-white/5 relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-white/[0.03] to-secondary/10 border border-white/10 p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Stay In The <span className="text-primary">Loop</span>
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Subscribe for fitness tips, exclusive offers, and community
                updates.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 text-sm transition-colors"
                required
              />
              <button
                type="submit"
                className="px-5 py-3.5 bg-primary hover:bg-primary-dark text-background rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shrink-0"
              >
                <span className="hidden sm:inline">Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center group -ml-3">
              <div className="transition-all duration-300 -mr-3">
                <img src="/logo.png" alt="Dynamic Gym Logo" className="w-16 h-16 object-contain" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                DYNAMIC <span className="text-primary">GYM</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering athletes and fitness enthusiasts with world-class
              facilities, expert guidance, and an unstoppable community.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram", url: "https://www.instagram.com/dynamic_gym_2k14/" },
                { Icon: Youtube, label: "YouTube", url: "https://www.youtube.com" },
                { Icon: Facebook, label: "Facebook", url: "https://www.facebook.com" },
              ].map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background text-gray-400 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Achievements", to: "/achievements" },
                { label: "Services", to: "/services" },
                { label: "Membership", to: "/membership" },
                { label: "Student Login", to: "/login" },
                { label: "Register", to: "/register" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Help Center", to: "/contact-us" },
                // { label: "Safety & Rules", to: "#" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Privacy Policy", to: "/privacy" },
                // { label: "Community", to: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">
                  IOB Bank Floor, Nannilam District,
                  <br />
                  Thiruvarur - 610105
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-gray-400 text-sm">+91 9791957395</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-gray-400 text-sm">
                  gymbarathi@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Dynamic Gym. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 fill-accent text-accent animate-pulse" />{" "}
            by{" "}
            <a
              href="#"
              className="text-white hover:text-primary transition-colors"
            >
              Sunil Sowrirajan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
