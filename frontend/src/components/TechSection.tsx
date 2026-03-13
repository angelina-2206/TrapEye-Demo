"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const technologies = [
  {
    category: "ML Model",
    name: "XGBoost",
    description: "Gradient-boosted decision trees for high-accuracy threat classification.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="#7b61ff" strokeWidth="1.5" opacity="0.8" />
        <circle cx="12" cy="12" r="4" fill="#7b61ff" opacity="0.3" />
      </svg>
    ),
    color: "#7b61ff",
  },
  {
    category: "Threat Intel",
    name: "VirusTotal API",
    description: "Real-time global malware and phishing database integration.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V8l8-4z" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M12 9v6M10 12h4" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    ),
    color: "#ef4444",
  },
  {
    category: "Vision",
    name: "Forensic CNN",
    description: "Deep learning models for pixel-level artifact detection.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00d9ff" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="#00d9ff" strokeWidth="1.5" />
        <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="#00d9ff" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    color: "#00d9ff",
  },
  {
    category: "Text",
    name: "NLP Checkers",
    description: "Transformer models for bias and manipulation detection.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h10M4 18h14" stroke="#10b981" strokeWidth="1.5" />
        <path d="M17 10l3 3-3 3" stroke="#10b981" strokeWidth="1.5" />
      </svg>
    ),
    color: "#10b981",
  },
  {
    category: "Data",
    name: "Stream Engine",
    description: "High-throughput asynchronous data processing pipeline.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 10s4-4 8 0 8 4 8 4M4 14s4-4 8 0 8 4 8 4" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="#f59e0b" />
      </svg>
    ),
    color: "#f59e0b",
  },
  {
    category: "Framework",
    name: "XAI System",
    description: "Transparent reasoning and confidence scoring generation.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l8 18H4L12 3z" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M12 10v6M12 18v.01" stroke="#e2e8f0" strokeWidth="2" />
      </svg>
    ),
    color: "#e2e8f0",
  },
];

export default function TechSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="tech"
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "120px" }}
    >
      <div className="section-container w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="section-label mb-6" style={{ color: "#10b981" }}>
            Powered By
          </div>
          <h2 className="section-heading font-bold mb-10" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            Technology <span className="gradient-text">Stack</span>
          </h2>
          <p className="section-desc text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Built on cutting-edge AI and security infrastructure for enterprise-grade threat detection.
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="glass-card p-10 flex items-start gap-6 cursor-pointer"
              style={{
                background: "rgba(10, 14, 26, 0.4)",
                border: "1px solid rgba(30, 45, 69, 0.3)",
                opacity: hovered !== null && hovered !== i ? 0.35 : 1,
                filter: hovered !== null && hovered !== i ? "blur(1.5px)" : "none",
                transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: "easeOut" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}25` }}
              >
                {tech.icon}
              </div>
              <div>
                <div className="stat-value text-[0.6rem] uppercase tracking-widest mb-4" style={{ color: tech.color }}>
                  {tech.category}
                </div>
                <h3 className="section-heading text-base font-semibold mb-4" style={{ color: "#e2e8f0" }}>
                  {tech.name}
                </h3>
                <p className="section-desc text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
