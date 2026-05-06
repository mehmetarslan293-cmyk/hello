"use client";



import { MeshBackground } from "./MeshBackground";

import { GlassNavbar } from "./GlassNavbar";

import { HeroSection } from "./HeroSection";

import { ApproachSection } from "./ApproachSection";

import { FeaturedStrip } from "./FeaturedStrip";

import { ProcessSteps } from "./ProcessSteps";

import { BentoFeatures } from "./BentoFeatures";

import { CTASection } from "./CTASection";

import { StudioFooter } from "./StudioFooter";



export function InfluencerMarketplace() {

  return (

    <div className="relative min-h-screen">

      <MeshBackground />

      <div className="grain-overlay" aria-hidden />

      <GlassNavbar />

      <main className="relative z-[2]">

        <HeroSection />

        <ApproachSection />

        <FeaturedStrip />

        <ProcessSteps />

        <BentoFeatures />

        <CTASection />

      </main>

      <StudioFooter />

    </div>

  );

}

