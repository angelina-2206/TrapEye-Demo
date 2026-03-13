"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "What is TrapEye?",
    answer: "TrapEye is a next-generation cybersecurity platform that detects deepfakes, fake news, and malicious URLs using explainable AI — giving you transparent, factor-by-factor reasoning behind every result."
  },
  {
    question: "How does Deepfake Detection work?",
    answer: "Our AI analyzes facial textures, lighting consistency, edge boundaries, and skin detail at a forensic level. It detects GAN-generated images, face swaps, and digital manipulations with 99.1% accuracy."
  },
  {
    question: "How do I check if a URL is safe?",
    answer: "Paste any suspicious URL into the URL Scanner. TrapEye scans it across 70+ antivirus engines in real time, checks domain reputation, detects phishing patterns, and gives you an instant risk score."
  },
  {
    question: "What is Explainable AI?",
    answer: "Instead of just giving a verdict, TrapEye shows you exactly why something was flagged — breaking down each factor with individual confidence scores so you understand the reasoning, not just the result."
  },
  {
    question: "How do I report a threat?",
    answer: "If TrapEye flags content as FAKE, PHISHING, or FALSE, a 'Report to Cybercrime Portal' button appears automatically. Clicking it takes you directly to India's National Cybercrime Reporting Portal at cybercrime.gov.in."
  }
];

export default function CyberBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-fast-fade {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "56px",
          height: "56px",
          borderRadius: "999px",
          background: "linear-gradient(135deg, #00ffcc, #7b5ea7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,255,200,0.35)",
          zIndex: 9999,
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: "96px",
              right: "28px",
              width: "360px",
              height: "480px",
              borderRadius: "20px",
              background: "rgba(8, 10, 22, 0.95)",
              border: "1px solid rgba(0,255,200,0.2)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              zIndex: 9999,
              overflow: "hidden" // Keep children contained safely within the rounded borders
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{ background: "rgba(0,255,200,0.1)", padding: "8px", borderRadius: "99px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00ffcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>CyberBot 🛡️</div>
                <div style={{ fontSize: "11px", opacity: 0.5, color: "white" }}>Quick answers about TrapEye</div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", opacity: 0.5, fontSize: "20px" }}
              >
                ×
              </button>
            </div>

            {/* Questions list */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              {FAQS.map((faq, idx) => {
                const isActive = activeIndex === idx;
                
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      onClick={() => setActiveIndex(isActive ? null : idx)}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        background: isActive ? "rgba(0,255,200,0.12)" : "rgba(255,255,255,0.05)",
                        border: isActive ? "1px solid rgba(0,255,200,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        color: isActive ? "#00ffcc" : "white",
                        fontSize: "13px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background 0.2s ease, border-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(0,255,200,0.08)";
                          e.currentTarget.style.borderColor = "rgba(0,255,200,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        }
                      }}
                    >
                      {faq.question}
                    </button>
                    
                    {isActive && (
                      <div
                        style={{
                          padding: "14px 16px",
                          borderRadius: "12px",
                          background: "rgba(0,255,200,0.06)",
                          borderLeft: "3px solid #00ffcc",
                          fontSize: "13px",
                          lineHeight: 1.7,
                          color: "rgba(255,255,255,0.8)",
                          marginTop: "8px",
                          animation: "custom-fast-fade 0.2s ease"
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
