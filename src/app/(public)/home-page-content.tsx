"use client";

import {
  FeaturedFieldsSection,
  FooterSection,
  ForOwnersSection,
  HowItWorksSection,
  LandingHeroSection,
  SponsorsSection,
} from "@/components/landing";

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-foreground">
      <LandingHeroSection />
      <HowItWorksSection />
      <FeaturedFieldsSection />
      <ForOwnersSection />
      <SponsorsSection />
      <FooterSection />
    </div>
  );
}
