"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="15" r="8" stroke="#00d9ff" strokeWidth="1.5" opacity="0.8" />
        <path d="M8 35c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#00d9ff" strokeWidth="1.5" opacity="0.6" />
        <path d="M28 10l4-4M28 6l4 4" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
        <circle cx="30" cy="8" r="6" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    title: "Deepfake Detection",
    description: "Advanced AI-powered analysis detects face swaps, GAN-generated images, and digital manipulations with forensic-level precision.",
    color: "#00d9ff",
    stats: "99.1% accuracy",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <rect x="5" y="5" width="30" height="30" rx="4" stroke="#7b61ff" strokeWidth="1.5" opacity="0.6" />
        <path d="M10 15h20M10 20h15M10 25h20M10 30h10" stroke="#7b61ff" strokeWidth="1.5" opacity="0.5" />
        <path d="M30 22l4 4-4 4" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
      </svg>
    ),
    title: "Fake News Analysis",
    description: "Multi-factor credibility scoring analyzes source reliability, emotional manipulation, bias detection, and factual consistency.",
    color: "#7b61ff",
    stats: "5-factor analysis",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <path d="M5 20h6l4-8 4 16 4-12 4 8h8" stroke="#10b981" strokeWidth="1.5" opacity="0.8" />
        <circle cx="32" cy="24" r="6" stroke="#10b981" strokeWidth="1" opacity="0.4" />
        <path d="M30 22l4 4-4 4" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    title: "URL Threat Scanner",
    description: "Real-time scanning across 70+ antivirus engines with AI-powered phishing pattern recognition and domain reputation analysis.",
    color: "#10b981",
    stats: "70+ AV engines",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="12" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
        <circle cx="20" cy="20" r="6" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
        <circle cx="20" cy="20" r="2" fill="#f59e0b" opacity="0.9" />
        <path d="M20 4v4M20 32v4M4 20h4M32 20h4" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    title: "Explainable AI",
    description: "Every detection comes with transparent, factor-by-factor reasoning — understand exactly why a threat was flagged.",
    color: "#f59e0b",
    stats: "Full transparency",
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 5, rotateX: -y * 5, duration: 0.3, ease: "power2.out" });
  };
  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3.out" });
  };
  return (
    <div ref={ref} className={className} style={{ perspective: "1000px", transformStyle: "preserve-3d" }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

export default function FeaturesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="features"
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "120px" }}
    >
      <div className="section-container w-full flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="section-label mb-6" style={{ color: "#00d9ff" }}>
            Security Modules
          </div>
          <h2
            className="section-heading font-bold mb-10"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            Multi-Layer <span className="gradient-text">Protection</span>
          </h2>
          <p className="section-desc text-base md:text-lg leading-relaxed" style={{ maxWidth: "750px", width: "100%", margin: "0 auto", textAlign: "center" }}>
            Four integrated AI modules working together to shield against the most sophisticated digital threats.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard>
                <div
                  className="glass-card p-12 cursor-pointer h-full text-center flex flex-col items-center"
                  style={{
                    opacity: hovered !== null && hovered !== i ? 0.35 : 1,
                    filter: hovered !== null && hovered !== i ? "blur(1.5px)" : "none",
                    transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 mx-auto"
                    style={{ background: `${f.color}08`, border: `1px solid ${f.color}18` }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="section-heading text-xl mb-6 text-center" style={{ color: "#e2e8f0", fontWeight: 700 }}>
                    {f.title}
                  </h3>
                  <p className="section-desc text-sm mb-10 text-center" style={{ lineHeight: 1.6, maxWidth: "100%" }}>{f.description}</p>
                  <div className="flex justify-center w-full">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: f.color }} />
                      <span className="stat-value text-[0.65rem] tracking-[0.12em] uppercase" style={{ color: f.color }}>
                        {f.stats}
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 100% 0%, ${f.color}06 0%, transparent 70%)` }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
