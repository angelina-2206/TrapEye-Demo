"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Input Detection",
    desc: "Submit any content — URLs, images, or news articles. Our system immediately begins threat classification and multi-layer preprocessing.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v16M4 12h16" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="#00d9ff" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    color: "#00d9ff",
  },
  {
    num: "02",
    title: "AI Analysis Engine",
    desc: "Gemini AI processes inputs through specialized detection pipelines — facial forensics, NLP credibility scoring, and domain threat intelligence.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="6" stroke="#7b61ff" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="10" stroke="#7b61ff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <circle cx="12" cy="12" r="2" fill="#7b61ff" />
      </svg>
    ),
    color: "#7b61ff",
  },
  {
    num: "03",
    title: "Threat Scoring",
    desc: "Multi-factor confidence scoring with cross-validation across 70+ AV engines. Each detection factor gets an independent confidence score.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 20h16M6 16v4M12 10v10M18 4v16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "#10b981",
  },
  {
    num: "04",
    title: "XAI Report",
    desc: "Transparent, explainable results with factor-by-factor breakdowns. Understand exactly why a threat was detected — complete AI reasoning transparency.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="#f59e0b" strokeWidth="1.5" />
        <path d="M9 7h6M9 11h6M9 15h4" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    color: "#f59e0b",
  },
];

export default function HowItWorksSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "120px" }}
    >
      <div className="section-container w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-28"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="section-label mb-6" style={{ color: "#f59e0b" }}>
            Operational Flow
          </div>
          <h2 className="section-heading font-bold mb-10" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-desc text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From input submission to detailed XAI forensic breakdown.
          </p>
        </motion.div>

        {/* Steps - Clean vertical layout */}
        <div className="max-w-4xl mx-auto space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              className="flex gap-10 items-start"
              initial={{ x: index % 2 === 0 ? -40 : 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15, ease: "easeOut" }}
              style={{
                opacity: hovered !== null && hovered !== index ? 0.35 : 1,
                filter: hovered !== null && hovered !== index ? "blur(1.5px)" : "none",
                transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Step number circle */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: "#050510",
                    border: `2px solid ${step.color}40`,
                    boxShadow: `0 0 20px ${step.color}15`,
                  }}
                  whileHover={{ scale: 1.1, borderColor: step.color }}
                >
                  <span className="stat-value text-lg" style={{ color: step.color }}>
                    {step.num}
                  </span>
                </motion.div>
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="w-px flex-1 mt-3"
                    style={{
                      minHeight: "48px",
                      background: `linear-gradient(to bottom, ${step.color}30, ${steps[index + 1].color}30)`,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                  />
                )}
              </div>

              {/* Content card */}
              <div
                className="glass-card p-10 flex-1 cursor-pointer"
                style={{ background: "rgba(10, 14, 26, 0.5)", border: "1px solid rgba(30, 45, 69, 0.3)" }}
              >
                <div className="flex items-start gap-6 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: `${step.color}10`, border: `1px solid ${step.color}20` }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="section-label text-[0.6rem] mb-2.5" style={{ color: step.color }}>
                      Step {step.num}
                    </div>
                    <h3 className="section-heading text-xl md:text-2xl font-bold" style={{ color: "#e2e8f0" }}>
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="section-desc text-sm leading-relaxed ml-[4.5rem]" style={{ color: "#94a3b8" }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
