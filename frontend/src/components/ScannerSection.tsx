"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ScanMode = "url" | "deepfake" | "fakenews";

/* eslint-disable @typescript-eslint/no-explicit-any */

const SCAN_MODES: { id: ScanMode; label: string; icon: React.ReactNode; color: string; placeholder: string; description: string }[] = [
  {
    id: "url",
    label: "URL Scanner",
    color: "#10b981",
    placeholder: "Enter a suspicious URL to scan...",
    description: "Scan any URL against 70+ antivirus engines with AI-powered phishing pattern recognition.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "deepfake",
    label: "Deepfake Detector",
    color: "#00d9ff",
    placeholder: "Upload an image to analyze...",
    description: "AI-powered facial forensics to detect GAN-generated images, face swaps, and manipulations.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="6" stroke="#00d9ff" strokeWidth="1.5" />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#00d9ff" strokeWidth="1.5" />
        <path d="M17 6l2-2M17 4l2 2" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "fakenews",
    label: "News Verifier",
    color: "#7b61ff",
    placeholder: "Paste article text or news headline to verify...",
    description: "Multi-factor NLP credibility scoring for source reliability, bias, and factual consistency.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="#7b61ff" strokeWidth="1.5" />
        <path d="M8 7h8M8 11h5M8 15h7" stroke="#7b61ff" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
  },
];

/* ── Verdict helpers ── */
function getVerdictStyle(verdict: string) {
  const v = verdict?.toUpperCase() || "";
  if (["SAFE", "REAL", "TRUE", "AUTHENTIC", "CLEAN"].some((x) => v.includes(x)))
    return { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", icon: "✅", label: "Safe" };
  if (["FAKE", "FALSE", "DANGEROUS", "PHISHING", "MALWARE", "MANIPUL"].some((x) => v.includes(x)))
    return { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", icon: "🚨", label: "Threat" };
  return { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", icon: "⚠️", label: "Warning" };
}

function ConfidenceBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round((value || 0) * 100);
  return (
    <div style={{ marginBottom: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span className="section-desc" style={{ fontSize: "12px", color: "#94a3b8" }}>{label}</span>
        <span className="stat-value" style={{ fontSize: "12px", color }}>{pct}%</span>
      </div>
      <div style={{ width: "100%", height: "6px", borderRadius: "999px", background: "rgba(30,45,69,0.4)", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: "999px", background: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function ScannerSection() {
  const [activeMode, setActiveMode] = useState<ScanMode>("url");
  const [inputValue, setInputValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMode = SCAN_MODES.find((m) => m.id === activeMode)!;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (activeMode === "deepfake" && !selectedFile) return;
    if (activeMode !== "deepfake" && !inputValue.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setScanError(null);

    try {
      let response: Response;

      if (activeMode === "url") {
        response = await fetch("/api/scan-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: inputValue.trim() }),
        });
      } else if (activeMode === "deepfake") {
        const formData = new FormData();
        formData.append("image", selectedFile!);
        if (inputValue.trim()) formData.append("context", inputValue.trim());
        response = await fetch("/api/detect-deepfake", { method: "POST", body: formData });
      } else {
        response = await fetch("/api/verify-news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputValue.trim() }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setScanError(data.error || "API error");
      } else {
        setScanResult(data);
      }
    } catch (err: any) {
      setScanError(err.message || "Network error — check if the server is running.");
    } finally {
      setIsScanning(false);
    }
  };

  const canScan = activeMode === "deepfake" ? !!selectedFile : !!inputValue.trim();

  return (
    <section
      id="scanner"
      className="relative"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        minHeight: "100vh",
      }}
    >
      <div className="section-container w-full">
        {/* Header */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <div className="section-label" style={{ color: "#10b981", marginBottom: "12px" }}>
            Threat Scanner
          </div>
          <h2 className="section-heading font-bold" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", marginBottom: "16px" }}>
            Launch <span className="gradient-text">Scanner</span>
          </h2>
          <p className="section-desc text-base md:text-lg" style={{ maxWidth: "620px", margin: "12px auto 40px auto", textAlign: "center", lineHeight: "1.7" }}>
            Scan URLs, detect deepfakes, and verify news articles — all powered by explainable AI with transparent results.
          </p>
        </motion.div>

        {/* Scanner Card */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          style={{
            margin: "0 auto",
            maxWidth: "900px",
            width: "100%",
            borderRadius: "24px",
            background: "rgba(10, 14, 26, 0.6)",
            backdropFilter: "blur(24px) saturate(1.2)",
            WebkitBackdropFilter: "blur(24px) saturate(1.2)",
            border: "1px solid rgba(30, 45, 69, 0.35)",
            boxShadow: `0 0 60px ${currentMode.color}08, 0 25px 80px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Gradient top glow bar */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 5%, ${currentMode.color}60 30%, ${currentMode.color} 50%, ${currentMode.color}60 70%, transparent 95%)`,
              boxShadow: `0 0 15px ${currentMode.color}40`,
            }}
          />

          {/* Corner accent decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none" style={{
            background: `radial-gradient(circle at 0% 0%, ${currentMode.color}08 0%, transparent 70%)`,
          }} />
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
            background: `radial-gradient(circle at 100% 0%, ${currentMode.color}08 0%, transparent 70%)`,
          }} />

          {/* Mode Tabs */}
          <div
            style={{ 
              display: "flex", 
              justifyContent: "space-evenly", 
              width: "100%", 
              padding: "16px 24px",
              borderBottom: "1px solid rgba(30, 45, 69, 0.3)", 
              background: "rgba(5, 5, 16, 0.4)" 
            }}
          >
            {SCAN_MODES.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveMode(mode.id);
                    setScanResult(null);
                    setScanError(null);
                    setInputValue("");
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-3 bg-transparent border-none cursor-pointer relative transition-all duration-300"
                  style={{
                    color: isActive ? mode.color : "#4a5568",
                    background: isActive ? `${mode.color}08` : "transparent",
                    padding: "18px 16px",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      background: isActive ? `${mode.color}15` : "transparent",
                      border: isActive ? `1px solid ${mode.color}25` : "1px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {mode.icon}
                  </div>
                  <span className="section-heading text-sm font-medium hidden sm:inline">
                    {mode.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="scanner-tab"
                      className="absolute bottom-0 left-[10%] right-[10%] h-[2px] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${mode.color}, transparent)`,
                        boxShadow: `0 0 12px ${mode.color}60, 0 0 4px ${mode.color}`,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scanner Body */}
          <div className="p-8 md:p-12">
            {/* Mode header with icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px 24px 16px 24px",
                gap: "6px"
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${currentMode.color}10`, border: `1px solid ${currentMode.color}20`, margin: "0 auto 8px auto" }}
              >
                {currentMode.icon}
              </div>
              <h3
                className="section-heading text-base"
                style={{ color: "#e2e8f0", textAlign: "center", fontWeight: 700, margin: 0 }}
              >
                {currentMode.label}
              </h3>
              <p
                className="section-desc text-xs mt-0.5"
                style={{ color: "#64748b", textAlign: "center", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}
              >
                {currentMode.description}
              </p>
            </div>

            {/* Deepfake: file upload */}
            {activeMode === "deepfake" && (
              <div className="mb-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/bmp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <motion.div
                  className="flex flex-col items-center justify-center rounded-2xl cursor-pointer"
                  style={{
                    border: `2px dashed ${selectedFile ? currentMode.color + "60" : "rgba(30,45,69,0.5)"}`,
                    background: selectedFile ? `${currentMode.color}05` : "rgba(5,5,16,0.3)",
                    padding: filePreview ? "16px" : "48px 24px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{
                    borderColor: `${currentMode.color}50`,
                    background: `${currentMode.color}05`,
                    boxShadow: `0 0 30px ${currentMode.color}10`,
                  }}
                >
                  {filePreview ? (
                    <div className="relative w-full max-h-52 overflow-hidden rounded-xl">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-contain max-h-52" />
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-[0.6rem] stat-value"
                        style={{ background: "rgba(0,0,0,0.8)", color: currentMode.color, border: `1px solid ${currentMode.color}30` }}>
                        {selectedFile?.name}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: `${currentMode.color}10`, border: `1px solid ${currentMode.color}20` }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V8M9 11l3-3 3 3" stroke={currentMode.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M20 16.7V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.3" stroke={currentMode.color} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="section-heading text-sm font-medium mb-1" style={{ color: "#e2e8f0" }}>
                        Drop your image here or click to browse
                      </span>
                      <span className="text-[0.65rem] stat-value tracking-wider" style={{ color: "#4a5568" }}>
                        JPG • PNG • WEBP • BMP
                      </span>
                    </>
                  )}
                </motion.div>
              </div>
            )}

            {/* Text/URL input area */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 20px 20px 20px" }}>
              <div
                className="flex-1 relative rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  border: `1px solid ${currentMode.color}20`,
                  boxShadow: `0 0 0 0 ${currentMode.color}00`,
                  background: "rgba(5, 5, 16, 0.5)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${currentMode.color}50`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${currentMode.color}15, inset 0 0 20px ${currentMode.color}05`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${currentMode.color}20`;
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${currentMode.color}00`;
                }}
              >
                {activeMode === "fakenews" ? (
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentMode.placeholder}
                    rows={4}
                    className="w-full bg-transparent px-6 py-4 text-sm outline-none resize-none"
                    style={{
                      color: "#e2e8f0",
                      fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && canScan && handleScan()}
                    placeholder={activeMode === "deepfake" ? "Additional context (optional)..." : currentMode.placeholder}
                    className="w-full bg-transparent px-6 py-4 text-sm outline-none"
                    style={{
                      color: "#e2e8f0",
                      fontFamily: "var(--font-mono), 'Fira Code', monospace",
                    }}
                  />
                )}
              </div>
              <motion.button
                onClick={handleScan}
                disabled={isScanning || !canScan}
                className="rounded-2xl text-sm font-semibold border-none cursor-pointer flex items-center gap-2.5"
                style={{
                  padding: "16px 32px",
                  background: isScanning
                    ? `${currentMode.color}20`
                    : `linear-gradient(135deg, ${currentMode.color}, ${currentMode.color}cc)`,
                  color: "#fff",
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  opacity: !canScan ? 0.4 : 1,
                  letterSpacing: "0.04em",
                  boxShadow: canScan && !isScanning ? `0 0 20px ${currentMode.color}30` : "none",
                  transition: "all 0.3s ease",
                }}
                whileHover={!isScanning && canScan ? { scale: 1.03, boxShadow: `0 0 30px ${currentMode.color}40` } : {}}
                whileTap={!isScanning && canScan ? { scale: 0.97 } : {}}
              >
                {isScanning ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Scan Now
                  </>
                )}
              </motion.button>
            </div>

            {/* ── Scan Progress ── */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="rounded-xl p-6 text-center"
                    style={{ background: "rgba(5, 5, 16, 0.5)", border: "1px solid rgba(30, 45, 69, 0.3)" }}
                  >
                    <div className="w-full h-1 rounded-full overflow-hidden mb-4" style={{ background: "rgba(30, 45, 69, 0.3)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${currentMode.color}, ${currentMode.color}88)` }}
                        initial={{ width: "0%" }}
                        animate={{ width: "90%" }}
                        transition={{ duration: 8, ease: "easeOut" }}
                      />
                    </div>
                    <p className="section-desc text-xs" style={{ color: "#64748b" }}>
                      {activeMode === "url" && "Scanning with VirusTotal + AI threat analysis..."}
                      {activeMode === "deepfake" && "Analyzing image with AI forensics..."}
                      {activeMode === "fakenews" && "Cross-referencing sources + AI credibility analysis..."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Error State ── */}
              {scanError && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="rounded-xl p-6" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ color: "#ef4444", fontSize: "1.2rem" }}>⚠️</span>
                      <span className="section-heading text-sm font-bold" style={{ color: "#ef4444" }}>Scan Error</span>
                    </div>
                    <p className="section-desc text-xs" style={{ color: "#fca5a5" }}>{scanError}</p>
                  </div>
                </motion.div>
              )}

              {/* ── Results ── */}
              {scanResult && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    style={{
                      maxWidth: "860px",
                      margin: "0 auto",
                      padding: "32px",
                      borderRadius: "20px",
                      border: `1px solid ${getVerdictStyle(scanResult.verdict).border}`,
                      background: "rgba(10, 12, 24, 0.85)",
                      backdropFilter: "blur(12px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px"
                    }}
                  >
                    {/* Verdict header */}
                    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
                        style={{ background: getVerdictStyle(scanResult.verdict).bg, border: `1px solid ${getVerdictStyle(scanResult.verdict).border}` }}
                      >
                        {getVerdictStyle(scanResult.verdict).icon}
                      </div>
                      <h3
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          color: getVerdictStyle(scanResult.verdict).color,
                          margin: 0
                        }}
                      >
                        {scanResult.verdict}
                      </h3>
                      <p
                        className="section-desc"
                        style={{
                          maxWidth: "600px",
                          margin: "8px auto 0 auto",
                          fontSize: "14px",
                          lineHeight: 1.7,
                          opacity: 0.75,
                          textAlign: "center",
                          color: "#e2e8f0"
                        }}
                      >
                        {scanResult.summary}
                      </p>
                    </div>

                    {/* Confidence bars */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        padding: "20px 24px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)"
                      }}
                    >
                      {scanResult.confidence !== undefined && (
                        <ConfidenceBar label="AI Confidence" value={scanResult.confidence} color="#00d9ff" />
                      )}
                      {scanResult.risk_score !== undefined && (
                        <ConfidenceBar label="Risk Score" value={scanResult.risk_score} color={scanResult.risk_score > 0.6 ? "#ef4444" : scanResult.risk_score > 0.3 ? "#f59e0b" : "#10b981"} />
                      )}
                      {scanResult.manipulation_score !== undefined && (
                        <ConfidenceBar label="Manipulation Score" value={scanResult.manipulation_score} color={scanResult.manipulation_score > 0.5 ? "#ef4444" : "#10b981"} />
                      )}
                      {scanResult.credibility_score !== undefined && (
                        <ConfidenceBar label="Credibility" value={scanResult.credibility_score} color={scanResult.credibility_score > 0.5 ? "#10b981" : "#ef4444"} />
                      )}
                      {scanResult.sensationalism_score !== undefined && (
                        <ConfidenceBar label="Sensationalism" value={scanResult.sensationalism_score} color="#f59e0b" />
                      )}
                    </div>

                    {/* VirusTotal stats (URL mode) */}
                    {scanResult.virusTotal && Object.keys(scanResult.virusTotal).length > 0 && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                          {[
                            { label: "Malicious", value: scanResult.virusTotal.malicious, color: "#ef4444" },
                            { label: "Suspicious", value: scanResult.virusTotal.suspicious, color: "#f59e0b" },
                            { label: "Harmless", value: scanResult.virusTotal.harmless, color: "#10b981" },
                            { label: "Undetected", value: scanResult.virusTotal.undetected, color: "#64748b" },
                          ].map((s) => (
                            <div key={s.label} style={{ padding: "16px", borderRadius: "12px", textAlign: "center", background: "rgba(10,14,26,0.5)", border: "1px solid rgba(30,45,69,0.3)" }}>
                              <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value || 0}</div>
                              <div style={{ fontSize: "11px", letterSpacing: "0.1em", opacity: 0.5, marginTop: "4px", color: "#e2e8f0", textTransform: "uppercase" }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* XAI Factors */}
                    {scanResult.factors && scanResult.factors.length > 0 && (
                      <div className="space-y-4">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            justifyContent: "center",
                            fontSize: "11px",
                            letterSpacing: "0.15em",
                            opacity: 0.6,
                            color: "#7b61ff"
                          }}
                        >
                          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                          <span>EXPLAINABLE AI BREAKDOWN</span>
                          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          {scanResult.factors.map((f: any, i: number) => (
                            <motion.div
                              key={f.factor}
                              style={{ 
                                padding: "16px 20px", 
                                borderRadius: "12px", 
                                background: "rgba(255,255,255,0.03)", 
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px"
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "11px", letterSpacing: "0.12em", fontWeight: 600, color: currentMode.color, textTransform: "uppercase" }}>
                                  {f.factor}
                                </span>
                                {(f.score !== undefined || f.risk !== undefined) && (
                                  <span style={{ fontSize: "11px", fontWeight: 800, color: (f.score ?? f.risk) > 0.6 ? "#ef4444" : (f.score ?? f.risk) > 0.3 ? "#f59e0b" : "#10b981" }}>
                                    {Math.round((f.score ?? f.risk) * 100)}%
                                  </span>
                                )}
                              </div>
                              <p className="section-desc" style={{ fontSize: "13px", lineHeight: 1.7, opacity: 0.7, textAlign: "left", color: "#e2e8f0" }}>{f.explanation}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Red flags + Positive signals (news) */}
                    {(scanResult.red_flags?.length > 0 || scanResult.positive_signals?.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {scanResult.red_flags?.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>🚩 Red Flags</div>
                            {scanResult.red_flags.map((f: string, i: number) => (
                              <div key={i} className="section-desc mb-1.5" style={{ textAlign: "left", paddingLeft: "16px", color: "#fca5a5", borderLeft: "2px solid #ef4444", fontSize: "13px", lineHeight: 1.6 }}>• {f}</div>
                            ))}
                          </div>
                        )}
                        {scanResult.positive_signals?.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold mb-2" style={{ color: "#10b981" }}>✅ Positive Signals</div>
                            {scanResult.positive_signals.map((s: string, i: number) => (
                              <div key={i} className="section-desc mb-1.5" style={{ textAlign: "left", paddingLeft: "16px", color: "#6ee7b7", borderLeft: "2px solid #10b981", fontSize: "13px", lineHeight: 1.6 }}>• {s}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Threat types (URL) */}
                    {scanResult.threat_types?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {scanResult.threat_types.map((t: string) => (
                          <span key={t} style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, border: "1px solid currentColor", color: "#ef4444", background: "rgba(239,68,68,0.08)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recommendation */}
                    {scanResult.recommendation && (
                      <div
                        style={{
                          padding: "20px 24px",
                          borderRadius: "12px",
                          borderLeft: `3px solid ${getVerdictStyle(scanResult.verdict).color}`,
                          background: "rgba(255,255,255,0.03)",
                          fontSize: "13px",
                          lineHeight: 1.75,
                          textAlign: "left",
                          color: "#e2e8f0"
                        }}
                      >
                        <div className="stat-value uppercase mb-2" style={{ fontSize: "11px", letterSpacing: "0.1em", color: getVerdictStyle(scanResult.verdict).color, fontWeight: 700 }}>
                          📋 Recommendation
                        </div>
                        {scanResult.recommendation}
                      </div>
                    )}

                    {/* Technical details (deepfake) */}
                    {scanResult.technical_details && (
                      <div
                        style={{
                          padding: "20px 24px",
                          borderRadius: "12px",
                          borderLeft: "3px solid #00d9ff",
                          background: "rgba(255,255,255,0.03)",
                          fontSize: "13px",
                          lineHeight: 1.75,
                          textAlign: "left",
                          color: "#e2e8f0"
                        }}
                      >
                        <div className="stat-value uppercase mb-2" style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#00d9ff", fontWeight: 700 }}>
                          🔬 Technical Details
                        </div>
                        {scanResult.technical_details}
                      </div>
                    )}

                    {/* Report Button */}
                    {getVerdictStyle(scanResult.verdict).label !== "Safe" && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "8px" }}>
                        <a
                          href="https://cybercrime.gov.in/Webform/Accept.aspx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:-translate-y-0.5"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 28px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #ff2d55, #ff6b35)",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "14px",
                            letterSpacing: "0.05em",
                            border: "none",
                            cursor: "pointer",
                            textDecoration: "none",
                            boxShadow: "0 4px 20px rgba(255, 45, 85, 0.4)",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          }}
                        >
                          🚨 Report to Cybercrime Portal
                        </a>
                        <p style={{ fontSize: "11px", opacity: 0.45, textAlign: "center", marginTop: "6px", color: "#e2e8f0" }}>
                          Opens the National Cybercrime Reporting Portal (India)
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
