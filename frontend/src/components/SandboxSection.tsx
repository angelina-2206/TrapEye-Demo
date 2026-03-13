"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Simulated trapped threat entries */
const TRAPPED_THREATS = [
  {
    id: 1,
    type: "Phishing",
    url: "paypa1-secure.com/login",
    module: "URL Scanner",
    severity: "Critical",
    timestamp: "2 min ago",
    color: "#ef4444",
    details: "Typosquatting of paypal.com — fake login form detected, SSL cert mismatch",
  },
  {
    id: 2,
    type: "Deepfake",
    url: "media-cdn.net/video_0x3f.mp4",
    module: "Deepfake AI",
    severity: "High",
    timestamp: "8 min ago",
    color: "#f59e0b",
    details: "GAN-generated face swap detected — temporal inconsistency in eye blink rate",
  },
  {
    id: 3,
    type: "Fake News",
    url: "breaking-alerts.info/article/5821",
    module: "NLP Engine",
    severity: "High",
    timestamp: "14 min ago",
    color: "#f59e0b",
    details: "Emotional manipulation score: 92% — no credible source attribution found",
  },
  {
    id: 4,
    type: "Malware",
    url: "free-download.xyz/setup.exe",
    module: "URL Scanner",
    severity: "Critical",
    timestamp: "21 min ago",
    color: "#ef4444",
    details: "Flagged by 64/70 AV engines — trojan dropper payload embedded in installer",
  },
  {
    id: 5,
    type: "Phishing",
    url: "arnazon-verify.net/account",
    module: "URL Scanner",
    severity: "Critical",
    timestamp: "35 min ago",
    color: "#ef4444",
    details: "IDN homograph attack — Unicode character substitution targeting amazon.com",
  },
];

function SeverityBadge({ severity, color }: { severity: string; color: string }) {
  return (
    <span
      className="stat-value text-[0.55rem] uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{
        color,
        background: `${color}12`,
        border: `1px solid ${color}25`,
      }}
    >
      {severity}
    </span>
  );
}

export default function SandboxSection() {
  const [selectedThreat, setSelectedThreat] = useState<number | null>(null);
  const [browserUrl, setBrowserUrl] = useState("https://paypa1-secure.com/login");
  const [scanProgress, setScanProgress] = useState(0);
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const scanRef = useRef<NodeJS.Timeout | null>(null);

  const activeThreat = TRAPPED_THREATS.find((t) => t.id === selectedThreat) || TRAPPED_THREATS[0];

  // Animate scan progress
  useEffect(() => {
    scanRef.current = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 50);
    return () => {
      if (scanRef.current) clearInterval(scanRef.current);
    };
  }, []);

  const handleThreatClick = (threat: typeof TRAPPED_THREATS[0]) => {
    setSelectedThreat(selectedThreat === threat.id ? null : threat.id);
    setBrowserUrl(`https://${threat.url}`);
  };

  return (
    <section
      id="sandbox"
      className="relative flex flex-col items-center justify-start"
      style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "120px" }}
    >
      <div className="section-container w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="section-label mb-6" style={{ color: "#ef4444" }}>
            Honeypot Sandbox
          </div>
          <h2
            className="section-heading font-bold mb-10"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            Threat <span className="gradient-text">Sandbox</span>
          </h2>
          <p className="section-desc text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Every detected scam is trapped, recorded, and analyzed in an isolated
            sandbox environment. A browser inside a browser — safely dissecting
            threats in real time.
          </p>
        </motion.div>

        {/* Main Content: Browser + Threat Log */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Sandbox Browser (3 cols) */}
          <motion.div
            className="lg:col-span-3 glass-card p-0 overflow-hidden cursor-pointer"
            style={{
              opacity: hoveredPanel !== null && hoveredPanel !== "browser" ? 0.35 : 1,
              filter: hoveredPanel !== null && hoveredPanel !== "browser" ? "blur(1.5px)" : "none",
              transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            onMouseEnter={() => setHoveredPanel("browser")}
            onMouseLeave={() => setHoveredPanel(null)}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(30, 45, 69, 0.4)",
                background: "rgba(10, 14, 26, 0.6)",
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#10b981" }} />
              </div>

              {/* URL Bar */}
              <div
                className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(5, 5, 16, 0.6)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L14 13H2L8 1Z"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  <path d="M8 5v4M8 10.5v.5" stroke="#ef4444" strokeWidth="1.5" />
                </svg>
                <span
                  className="stat-value text-[0.6rem] truncate"
                  style={{ color: "#ef4444" }}
                >
                  {browserUrl}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444", animation: "pulse-glow 1.5s ease-in-out infinite" }} />
                <span className="stat-value text-[0.55rem] uppercase" style={{ color: "#ef4444" }}>
                  Sandboxed
                </span>
              </div>
            </div>

            {/* Sandbox viewport */}
            <div
              className="relative"
              style={{ height: "380px", background: "rgba(5, 5, 16, 0.8)" }}
            >
              {/* Simulated payload container */}
              <div className="absolute inset-6 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(30, 45, 69, 0.3)" }}>
                
                {/* Dynamic Fake Site Background */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen" style={{ filter: "saturate(0.5)"}}>
                  {(activeThreat.type === "Phishing" || activeThreat.type === "Malware") && (
                    <div className="w-full h-full bg-[#f8fafc] flex flex-col items-center pt-8 pointer-events-none">
                      <div className="text-2xl font-bold mb-4" style={{ fontFamily: "sans-serif", color: "#000" }}>🔒 Secure Login</div>
                      <div className="w-56 border border-gray-300 p-4 shadow-sm rounded flex flex-col items-center bg-white">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-full"></div>
                        <div className="h-6 bg-gray-200 rounded mb-4 w-full"></div>
                        <div className="h-8 bg-blue-600 rounded w-full"></div>
                      </div>
                    </div>
                  )}

                  {activeThreat.type === "Deepfake" && (
                    <div className="w-full h-full bg-[#030712] flex items-center justify-center relative pointer-events-none overflow-hidden">
                      <div className="w-32 h-44 border-2 border-green-500 rounded-[40%] flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        {/* Fake eyes */}
                        <div className="absolute top-12 left-5 w-6 h-6 border border-red-500 rounded-sm bg-red-500/20"></div>
                        <div className="absolute top-12 right-5 w-6 h-6 border border-red-500 rounded-sm bg-red-500/20"></div>
                        {/* Fake mouth */}
                        <div className="absolute bottom-8 w-14 h-6 border border-red-500 rounded-sm bg-red-500/20"></div>
                        {/* Scanning grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:8px_8px] rounded-[40%]"></div>
                      </div>
                    </div>
                  )}

                  {activeThreat.type === "Fake News" && (
                    <div className="w-full h-full bg-[#f1f5f9] p-6 pointer-events-none text-left">
                      <div className="text-2xl font-extrabold mb-3 text-black uppercase tracking-tighter" style={{ fontFamily: "serif" }}>🚨 BREAKING SHOCK ALERT!</div>
                      <div className="h-3 bg-red-500/40 w-full mb-2"></div>
                      <div className="h-3 bg-red-500/40 w-4/5 mb-4"></div>
                      <div className="h-24 bg-gray-300 flex items-center justify-center text-gray-500 text-xs mb-4">Image Blocked by Sandbox</div>
                      <div className="h-2 bg-gray-300 w-full mb-2"></div>
                      <div className="h-2 bg-gray-300 w-full mb-2"></div>
                      <div className="h-2 bg-gray-300 w-3/4 mb-2"></div>
                    </div>
                  )}
                </div>

                {/* Threat Contained Overlay Container */}
                <div className="h-full flex flex-col items-center justify-center p-8 text-center relative z-10" style={{ background: "rgba(10, 14, 26, 0.75)", backdropFilter: "blur(2px)" }}>
                  {/* Scan overlay grid */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, rgba(239, 68, 68, 0.03) 0px, rgba(239, 68, 68, 0.03) 1px, transparent 1px, transparent 20px)`,
                      animation: "scan-down 3s linear infinite",
                    }}
                  />

                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent)",
                      boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
                      top: `${scanProgress}%`,
                    }}
                  />

                  {/* Shield icon */}
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <path
                        d="M32 6L54 16V30C54 44 44 54 32 58C20 54 10 44 10 30V16L32 6Z"
                        fill="rgba(239, 68, 68, 0.08)"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                      />
                      <path d="M24 32L30 38L42 26" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>

                  <h3
                    className="section-heading text-xl font-bold mb-3"
                    style={{ color: "#e2e8f0" }}
                  >
                    Threat Contained
                  </h3>
                  <p
                    className="section-desc text-sm mb-6 max-w-sm"
                    style={{ color: "#64748b" }}
                  >
                    This threat has been safely isolated in the TrapEye honeypot
                    sandbox. All network activity is being monitored and recorded.
                  </p>

                  {/* Threat info pills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["DNS Spoofed", "SSL Invalid", "Form Capture", "Exfil Blocked"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="stat-value text-[0.55rem] px-3 py-1 rounded-full"
                          style={{
                            color: "#ef4444",
                            background: "rgba(239, 68, 68, 0.06)",
                            border: "1px solid rgba(239, 68, 68, 0.15)",
                          }}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderTop: "1px solid rgba(30, 45, 69, 0.4)",
                background: "rgba(10, 14, 26, 0.4)",
              }}
            >
              <div className="flex items-center gap-4">
                {[
                  { label: "Packets", value: "2,847", color: "#00d9ff" },
                  { label: "Blocked", value: "142", color: "#ef4444" },
                  { label: "Duration", value: "4m 32s", color: "#f59e0b" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="text-[0.5rem] uppercase tracking-wider" style={{ color: "#4a5568" }}>
                      {s.label}
                    </span>
                    <span className="stat-value text-[0.6rem]" style={{ color: s.color }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
              <span className="stat-value text-[0.5rem] uppercase tracking-wider" style={{ color: "#10b981" }}>
                ● Recording
              </span>
            </div>
          </motion.div>

          {/* Threat Log (2 cols) */}
          <motion.div
            className="lg:col-span-2 glass-card p-0 overflow-hidden flex flex-col cursor-pointer"
            style={{
              opacity: hoveredPanel !== null && hoveredPanel !== "log" ? 0.35 : 1,
              filter: hoveredPanel !== null && hoveredPanel !== "log" ? "blur(1.5px)" : "none",
              transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            onMouseEnter={() => setHoveredPanel("log")}
            onMouseLeave={() => setHoveredPanel(null)}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            {/* Log header */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{
                borderBottom: "1px solid rgba(30, 45, 69, 0.4)",
                background: "rgba(10, 14, 26, 0.5)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 6V10C14 13 11 15 8 16C5 15 2 13 2 10V6L8 2Z" stroke="#ef4444" strokeWidth="1.2" />
                  <circle cx="8" cy="9" r="2" fill="#ef4444" opacity="0.6" />
                </svg>
                <span className="section-heading text-sm font-semibold" style={{ color: "#e2e8f0" }}>
                  Trapped Threats
                </span>
              </div>
              <span
                className="stat-value text-[0.6rem] px-2.5 py-0.5 rounded-full"
                style={{
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {TRAPPED_THREATS.length} captured
              </span>
            </div>

            {/* Threat entries */}
            <div className="flex-1 overflow-auto" style={{ maxHeight: "480px" }}>
              {TRAPPED_THREATS.map((threat, i) => (
                <motion.div
                  key={threat.id}
                  className="cursor-pointer"
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid rgba(30, 45, 69, 0.2)",
                    background:
                      selectedThreat === threat.id
                        ? "rgba(239, 68, 68, 0.04)"
                        : "transparent",
                    transition: "background 0.3s ease",
                  }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  onClick={() => handleThreatClick(threat)}
                  onMouseEnter={(e) => {
                    if (selectedThreat !== threat.id)
                      (e.currentTarget as HTMLElement).style.background = "rgba(30, 45, 69, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedThreat !== threat.id)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: threat.color, boxShadow: `0 0 6px ${threat.color}60` }}
                      />
                      <span className="section-heading text-sm font-semibold" style={{ color: "#e2e8f0" }}>
                        {threat.type}
                      </span>
                    </div>
                    <SeverityBadge severity={threat.severity} color={threat.color} />
                  </div>

                  <div
                    className="stat-value text-[0.6rem] mb-1.5 truncate"
                    style={{ color: "#64748b" }}
                  >
                    {threat.url}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[0.55rem]" style={{ color: "#4a5568" }}>
                      {threat.module}
                    </span>
                    <span className="text-[0.55rem]" style={{ color: "#4a5568" }}>
                      {threat.timestamp}
                    </span>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedThreat === threat.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-3 pt-3 section-desc text-xs leading-relaxed"
                          style={{
                            borderTop: "1px solid rgba(30, 45, 69, 0.3)",
                            color: "#94a3b8",
                          }}
                        >
                          {threat.details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
