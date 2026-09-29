import Navbar from "@/features/landing/components/Navbar";
import Hero from "@/features/landing/components/Hero";
import WhatWeOffer from "@/features/landing/components/WhatWeOffer";
import Trainers from "@/features/landing/components/Trainers";
import Testimonials from "@/features/landing/components/Testimonials";
import AboutUs from "@/features/landing/components/AboutUs";
import Footer from "@/features/landing/components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Navbar />
      <main>
        <Hero />
        <WhatWeOffer />
        <Trainers />
        <Testimonials />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
