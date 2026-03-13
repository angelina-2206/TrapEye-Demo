"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative z-10"
      style={{
        borderTop: "1px solid rgba(0, 255, 200, 0.15)",
        padding: "60px 80px 40px 80px",
        background: "linear-gradient(to bottom, rgba(0,255,200,0.03), transparent)",
      }}
    >
      <div className="section-container w-full max-w-[1400px] mx-auto p-0">
        
        {/* Main Grid Layout */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr", 
            gap: "48px", 
            alignItems: "start" 
          }}
        >
          {/* Brand Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 40 40">
                <defs>
                  <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d9ff" />
                    <stop offset="100%" stopColor="#7b61ff" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 3 L35 10 L35 22 C35 30 28 36 20 38 C12 36 5 30 5 22 L5 10 Z"
                  fill="none"
                  stroke="url(#footerGrad)"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="20" r="5" fill="none" stroke="#00d9ff" strokeWidth="1" opacity="0.5" />
                <circle cx="20" cy="20" r="2" fill="#00d9ff" />
              </svg>
              <span className="section-heading text-lg">
                Trap<span style={{ color: "#00d9ff" }}>Eye</span>
              </span>
            </div>
            
            <p 
              className="section-desc" 
              style={{ fontSize: "14px", lineHeight: "1.7", opacity: 0.6, maxWidth: "220px", color: "#e2e8f0" }}
            >
              Next-generation cybersecurity detection platform powered by explainable AI.
            </p>
            
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid rgba(0,255,180,0.3)",
                  borderRadius: "999px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  color: "#00ffb2",
                  background: "rgba(0,255,180,0.07)",
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#00ffb2",
                    boxShadow: "0 0 6px rgba(0, 255, 178, 0.5)",
                    animation: "pulse-glow 2s infinite",
                  }}
                />
                <span className="section-heading tracking-wider" style={{ fontWeight: 600 }}>
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 
              className="section-label" 
              style={{ color: "#00d9ff", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "20px", fontWeight: 600 }}
            >
              PLATFORM
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {["Deepfake Detector", "Fake News Analyzer", "URL Scanner", "API Access"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="section-desc hover:text-[#00ffcc] hover:opacity-100"
                  style={{ 
                    color: "#e2e8f0", 
                    fontSize: "14px", 
                    opacity: 0.65, 
                    transition: "opacity 0.2s ease, color 0.2s ease",
                    textDecoration: "none"
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 
              className="section-label" 
              style={{ color: "#7b61ff", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "20px", fontWeight: 600 }}
            >
              RESOURCES
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {["Documentation", "Research Papers", "Blog", "Status Page"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="section-desc hover:text-[#00ffcc] hover:opacity-100"
                  style={{ 
                    color: "#e2e8f0", 
                    fontSize: "14px", 
                    opacity: 0.65, 
                    transition: "opacity 0.2s ease, color 0.2s ease",
                    textDecoration: "none"
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 
              className="section-label" 
              style={{ color: "#f59e0b", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "20px", fontWeight: 600 }}
            >
              CONNECT
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {["GitHub", "Twitter", "Discord", "Enterprise Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="section-desc hover:text-[#00ffcc] hover:opacity-100"
                  style={{ 
                    color: "#e2e8f0", 
                    fontSize: "14px", 
                    opacity: 0.65, 
                    transition: "opacity 0.2s ease, color 0.2s ease",
                    textDecoration: "none"
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ 
            borderTop: "1px solid rgba(255,255,255,0.07)", 
            marginTop: "48px", 
            paddingTop: "24px", 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "12px", 
            opacity: 0.4,
            color: "#e2e8f0",
            fontFamily: "var(--font-body), 'DM Sans', sans-serif"
          }}
        >
          <div className="section-desc">
            © {currentYear} TrapEye. All rights reserved.
          </div>
          <div className="section-desc tracking-wide">
            Privacy Policy &middot; Terms of Service
          </div>
        </div>
      </div>
    </footer>
  );
}
