import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreens from "@/components/SplashScreens";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Vision from "@/components/Vision";
import SkillsSection from "@/components/SkillsSection";
import TalentSection from "@/components/TalentSection";
import PlatformSections from "@/components/PlatformSections";
import JourneySection from "@/components/JourneySection";
import DashboardPreview from "@/components/DashboardPreview";
import FeaturesSection from "@/components/FeaturesSection";
import AdvancedFeatures from "@/components/AdvancedFeatures";
import WhyBestVersion from "@/components/WhyBestVersion";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import MentorsCommunity from "@/components/MentorsCommunity";
import Opportunities from "@/components/Opportunities";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("bv_splash_seen");
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("bv_splash_seen", "1");
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreens onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <Vision />
          <SkillsSection />
          <TalentSection />
          <PlatformSections />
          <JourneySection />
          <DashboardPreview />
          <FeaturesSection />
          <AdvancedFeatures />
          <WhyBestVersion />
          <VideoSection />
          <Testimonials />
          <MentorsCommunity />
          <Opportunities />
          <FAQ />
          <CTASection />
          <Footer />
          <AIChatbot />
        </div>
      )}
    </>
  );
};

export default Index;
