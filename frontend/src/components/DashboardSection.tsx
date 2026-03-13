"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const nodes = [
  { id: 1, x: 50, y: 20, label: "Firewall", type: "secure", size: 18 },
  { id: 2, x: 18, y: 45, label: "Endpoint", type: "secure", size: 14 },
  { id: 3, x: 82, y: 42, label: "Server", type: "secure", size: 16 },
  { id: 4, x: 30, y: 72, label: "Database", type: "secure", size: 14 },
  { id: 5, x: 70, y: 18, label: "Gateway", type: "secure", size: 14 },
  { id: 6, x: 50, y: 48, label: "TrapEye AI", type: "central", size: 22 },
  { id: 7, x: 10, y: 18, label: "Threat", type: "threat", size: 12 },
  { id: 8, x: 88, y: 75, label: "Phishing", type: "threat", size: 12 },
  { id: 9, x: 85, y: 12, label: "Malware", type: "threat", size: 12 },
];

const connections = [
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [1, 5], [2, 4], [3, 5],
  [7, 1], [8, 4], [9, 5],
];

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px" }}
    >
      <div className="section-container w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="section-label mb-5" style={{ color: "#7b61ff" }}>
            Live Detection Map
          </div>
          <h2 className="section-heading font-bold mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            Detection <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="section-desc text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Real-time cybersecurity network monitoring with AI-powered threat detection and response.
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-0 max-w-5xl mx-auto overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 py-3.5"
            style={{ borderBottom: "1px solid rgba(30, 45, 69, 0.4)", background: "rgba(10, 14, 26, 0.5)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#10b981" }} />
              </div>
              <span className="stat-value text-[0.65rem]" style={{ color: "#4a5568" }}>
                trapeye://network-monitor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: "#10b981" }} />
              <span className="stat-value text-[0.6rem] uppercase tracking-wider" style={{ color: "#10b981" }}>Live</span>
            </div>
          </div>

          {/* Network Map */}
          <div
            className="relative"
            style={{
              height: "480px",
              background: "radial-gradient(ellipse at 50% 50%, rgba(0, 217, 255, 0.015) 0%, transparent 70%)",
            }}
          >
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {connections.map(([from, to], i) => {
                const fN = nodes.find((n) => n.id === from)!;
                const tN = nodes.find((n) => n.id === to)!;
                const isThreat = fN.type === "threat" || tN.type === "threat";
                return (
                  <motion.line
                    key={i}
                    x1={`${fN.x}%`} y1={`${fN.y}%`} x2={`${tN.x}%`} y2={`${tN.y}%`}
                    stroke={isThreat ? "#ef444430" : "#00d9ff12"}
                    strokeWidth={isThreat ? 1 : 0.5}
                    strokeDasharray={isThreat ? "4 4" : "none"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 + i * 0.08 }}
                  />
                );
              })}
            </svg>

            {nodes.map((node, idx) => {
              const colors: Record<string, { bg: string; border: string; glow: string }> = {
                secure: { bg: "rgba(0,217,255,0.06)", border: "rgba(0,217,255,0.25)", glow: "0 0 12px rgba(0,217,255,0.15)" },
                central: { bg: "rgba(123,97,255,0.12)", border: "rgba(123,97,255,0.4)", glow: "0 0 25px rgba(123,97,255,0.25)" },
                threat: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)", glow: "0 0 12px rgba(239,68,68,0.15)" },
              };
              const c = colors[node.type];
              return (
                <motion.div
                  key={node.id}
                  className="absolute flex flex-col items-center cursor-pointer"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)", zIndex: node.type === "central" ? 10 : 5 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: "backOut" }}
                  whileHover={{ scale: 1.15 }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: `${node.size * 2.5}px`, height: `${node.size * 2.5}px`, background: c.bg, border: `1px solid ${c.border}`, boxShadow: c.glow }}
                  >
                    {node.type === "central" && <div className="w-3 h-3 rounded-full" style={{ background: "#7b61ff", boxShadow: "0 0 10px rgba(123,97,255,0.5)", animation: "pulse-glow 2s ease-in-out infinite" }} />}
                    {node.type === "threat" && <svg width="12" height="12" viewBox="0 0 14 14"><path d="M7 1L13 12H1L7 1Z" fill="none" stroke="#ef4444" strokeWidth="1.5" /></svg>}
                    {node.type === "secure" && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00d9ff", opacity: 0.6 }} />}
                  </div>
                  <span className="stat-value text-[0.55rem] mt-2 whitespace-nowrap" style={{ color: node.type === "threat" ? "#ef4444" : node.type === "central" ? "#7b61ff" : "#4a5568", letterSpacing: "0.05em" }}>
                    {node.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Scanning rings */}
            <div className="absolute" style={{ left: "50%", top: "48%", transform: "translate(-50%, -50%)" }}>
              {[80, 140, 210].map((size, i) => (
                <div
                  key={size}
                  className="absolute rounded-full"
                  style={{
                    width: `${size}px`, height: `${size}px`, left: `${-size / 2}px`, top: `${-size / 2}px`,
                    border: "1px solid rgba(123, 97, 255, 0.06)", animation: `pulse-glow ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div
            className="grid grid-cols-4 px-6 py-5"
            style={{ borderTop: "1px solid rgba(30, 45, 69, 0.4)", background: "rgba(10, 14, 26, 0.3)" }}
          >
            {[
              { label: "Active Nodes", value: "6", color: "#00d9ff" },
              { label: "Threats Blocked", value: "3", color: "#ef4444" },
              { label: "Scan Rate", value: "142/s", color: "#10b981" },
              { label: "AI Coverage", value: "99.8%", color: "#7b61ff" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="stat-value text-lg font-semibold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[0.55rem] uppercase tracking-[0.15em] mt-1 font-medium" style={{ color: "#4a5568" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
