import { createLazyFileRoute } from "@tanstack/react-router";
import Navbar from "../features/velora/Navbar";
import Footer from "../features/velora/Footer";
import HeroSection from "../features/velora/HeroSection";
import AboutSection from "../features/velora/AboutSection";
import ServicesSection from "../features/velora/ServicesSection";
import ProcessSection from "../features/velora/ProcessSection";
import CtaSection from "../features/velora/CtaSection";
import "./velora.css";

export const Route = createLazyFileRoute("/velora")({
  component: Velora,
});

function Velora() {
  return (
    <div className="bg-cream text-dark">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
