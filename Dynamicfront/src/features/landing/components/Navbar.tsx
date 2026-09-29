import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const sectionLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#offers" },
    { name: "Trainers", href: "#trainers" },
    { name: "About", href: "#about" },
  ];

  const pageLinks = [
    { name: "Achievements", to: "/achievements" },
    { name: "Services", to: "/services" },
    { name: "Membership", to: "/membership" },
    { name: "Contact Us", to: "/contact-us" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="transition-all duration-300 -mr-3">
              <img src="/logo.png" alt="Dynamic Gym Logo" className="w-16 h-16 object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              DYNAMIC <span className="text-primary">GYM</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {isHome &&
              sectionLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300"
                >
                  {link.name}
                </a>
              ))}
            {pageLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary hover:bg-primary-dark text-background px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {isHome &&
                sectionLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}

              <div className="border-t border-white/5 pt-2 mt-2">
                {pageLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-all ${
                      location.pathname === link.to
                        ? "text-primary bg-primary/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link
                  to="/login"
                  className="flex justify-center items-center px-4 py-3 text-white border border-white/10 rounded-xl font-medium hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex justify-center items-center px-4 py-3 bg-primary text-background rounded-xl font-bold hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
