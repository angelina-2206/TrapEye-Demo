"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

type SectionId = "hero" | "features" | "sandbox" | "scanner" | "tech" | "how-it-works";

interface HeroProps {
  onNavigate: (id: SectionId) => void;
}

export default function HeroSection({ onNavigate }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.6 });

    tl.fromTo(
      badgeRef.current,
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
    )
      .fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
  }, []);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px" }}
    >
      {/* Radial background accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 45%, rgba(0, 217, 255, 0.025) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 65% 55%, rgba(123, 97, 255, 0.02) 0%, transparent 60%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.015) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,217,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
        }}
      />
      {/* Styles for keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-fast-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}} />

      <div 
        className="section-container relative z-10"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%"
        }}
      >
        {/* Status badge */}
        <div ref={badgeRef} style={{ display: "flex", justifyContent: "center", width: "100%", margin: "0 auto 20px auto" }}>
          <motion.div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              fontWeight: 600,
              alignSelf: "center",
              marginLeft: "auto",
              marginRight: "auto"
            }}
            whileHover={{ scale: 1.04, borderColor: "rgba(0, 217, 255, 0.25)" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#10b981",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
                animation: "custom-fast-pulse 2s ease-in-out infinite",
              }}
            />
            <span style={{ color: "#94a3b8" }}>
              ACTIVE THREAT MONITORING
            </span>
          </motion.div>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="font-bold mb-16 leading-[0.95]"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontFamily: "var(--font-brand), 'Ramabhadra', sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          <span
            style={{
              color: "#e2e8f0",
              textShadow: "0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(0,217,255,0.08)",
            }}
          >
            Trap
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #00d9ff, #7b61ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 25px rgba(0, 217, 255, 0.35)) drop-shadow(0 0 50px rgba(123, 97, 255, 0.2))",
            }}
          >
            Eye
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="section-desc text-base md:text-lg max-w-xl mx-auto mb-20 leading-relaxed"
        >
          Next-generation cybersecurity detection platform.{" "}
          <span style={{ color: "#00d9ff" }}>Deepfake analysis</span>,{" "}
          <span style={{ color: "#7b61ff" }}>fake news verification</span>, and{" "}
          <span style={{ color: "#10b981" }}>URL threat scanning</span> — powered
          by explainable AI.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("features")}
          >
            Explore Features
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("sandbox")}
          >
            View Sandbox
          </motion.button>
        </div>
      </div>
    </section>
  );
}
