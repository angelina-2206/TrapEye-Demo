"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SandboxSection from "@/components/SandboxSection";
import ScannerSection from "@/components/ScannerSection";
import TechSection from "@/components/TechSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import CyberBot from "@/components/CyberBot";

const Starfield = dynamic(() => import("@/components/Starfield"), { ssr: false });

const SECTIONS = ["hero", "features", "sandbox", "scanner", "tech", "how-it-works"] as const;
type SectionId = (typeof SECTIONS)[number];

/* Section colour map for the transition flash */
const SECTION_COLORS: Record<SectionId, string> = {
  hero: "#00d9ff",
  features: "#00d9ff",
  sandbox: "#ef4444",
  scanner: "#10b981",
  tech: "#10b981",
  "how-it-works": "#f59e0b",
};

/* Transition overlay animation variants */
const overlayVariants = {
  initial: { scaleY: 0, originY: 0 },
  animate: {
    scaleY: [0, 1, 1, 0],
    originY: [0, 0, 1, 1],
    transition: { duration: 0.6, times: [0, 0.35, 0.65, 1], ease: "easeInOut" as const },
  },
};

/* Section content entrance — scale up + fade in */
const sectionVariants = {
  initial: { opacity: 0, y: 40, scale: 0.97, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [transitionColor, setTransitionColor] = useState("#00d9ff");
  const [showOverlay, setShowOverlay] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  const navigate = useCallback(
    (id: SectionId) => {
      if (id === activeSection) return;

      /* Trigger the overlay flash */
      setTransitionColor(SECTION_COLORS[id]);
      setShowOverlay(true);

      /* After the overlay covers the screen, swap section */
      setTimeout(() => {
        setActiveSection(id);
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }, 220);

      /* Remove overlay once animation completes */
      setTimeout(() => setShowOverlay(false), 650);
    },
    [activeSection]
  );

  return (
    <>
      <Starfield />
      <Navbar
        activeSection={activeSection}
        onNavigate={navigate}
        onHoverStart={() => setNavHovered(true)}
        onHoverEnd={() => setNavHovered(false)}
      />

      {/* ── Transition overlay ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="transition-overlay"
            className="fixed inset-0 z-[100] pointer-events-none"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{
              background: `linear-gradient(180deg, ${transitionColor}15 0%, ${transitionColor}40 50%, ${transitionColor}15 100%)`,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            {/* Horizontal scan line */}
            <motion.div
              className="absolute left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${transitionColor}, transparent)`,
                boxShadow: `0 0 20px ${transitionColor}80, 0 0 60px ${transitionColor}40`,
              }}
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {/* Corner flash accents */}
            <motion.div
              className="absolute top-0 left-0 w-32 h-32"
              style={{
                background: `radial-gradient(circle at 0% 0%, ${transitionColor}30 0%, transparent 70%)`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-32 h-32"
              style={{
                background: `radial-gradient(circle at 100% 100%, ${transitionColor}30 0%, transparent 70%)`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`relative z-[1] min-h-screen ${navHovered ? "page-blur" : "page-no-blur"}`}>
        <AnimatePresence mode="wait">
          {activeSection === "hero" && (
            <motion.div key="hero" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <HeroSection onNavigate={navigate} />
            </motion.div>
          )}
          {activeSection === "features" && (
            <motion.div key="features" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <FeaturesSection />
            </motion.div>
          )}
          {activeSection === "sandbox" && (
            <motion.div key="sandbox" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <SandboxSection />
            </motion.div>
          )}
          {activeSection === "scanner" && (
            <motion.div key="scanner" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <ScannerSection />
            </motion.div>
          )}
          {activeSection === "tech" && (
            <motion.div key="tech" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <TechSection />
            </motion.div>
          )}
          {activeSection === "how-it-works" && (
            <motion.div key="how-it-works" variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <HowItWorksSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <CyberBot />
    </>
  );
}
