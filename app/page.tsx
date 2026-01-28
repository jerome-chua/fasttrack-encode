"use client";

import Navigation from "@/components/home/Navigation";
import HeroSection from "@/components/home/HeroSection";
import ActivityTrackerSection from "@/components/home/ActivityTrackerSection";
import PhoneMockupSection from "@/components/home/PhoneMockupSection";
import WeightProgressSection from "@/components/home/WeightProgressSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-fasttrack-white">
      <Navigation />
      <div className="h-20" />
      <HeroSection />
      <ActivityTrackerSection />
      <PhoneMockupSection />
      <WeightProgressSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}