"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

type SectionId = "hero" | "features" | "sandbox" | "scanner" | "tech" | "how-it-works";

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

const NAV_LINKS: { label: string; id: SectionId }[] = [
  { label: "Features", id: "features" },
  { label: "Sandbox", id: "sandbox" },
  { label: "Technology", id: "tech" },
  { label: "Process", id: "how-it-works" },
];

export default function Navbar({ activeSection, onNavigate, onHoverStart, onHoverEnd }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        padding: "1rem 2.5rem",
        background: "rgba(5, 5, 16, 0.7)",
        backdropFilter: "blur(24px) saturate(1.2)",
        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
        borderBottom: "1px solid rgba(30, 45, 69, 0.2)",
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.button
          className="flex items-center gap-3 cursor-pointer select-none bg-transparent border-none"
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate("hero")}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d9ff" />
                  <stop offset="100%" stopColor="#7b61ff" />
                </linearGradient>
              </defs>
              <path
                d="M20 3 L35 10 L35 22 C35 30 28 36 20 38 C12 36 5 30 5 22 L5 10 Z"
                fill="none"
                stroke="url(#shieldGrad)"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <circle cx="20" cy="20" r="5" fill="none" stroke="#00d9ff" strokeWidth="1" opacity="0.5" />
              <circle cx="20" cy="20" r="2" fill="#00d9ff" opacity="0.7" />
            </svg>
          </div>
          <span className="section-heading text-lg tracking-tight" style={{ color: "#e2e8f0" }}>
            Trap<span style={{ color: "#00d9ff" }}>Eye</span>
          </span>
        </motion.button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-12">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                onMouseEnter={(e) => {
                  onHoverStart?.();
                  if (!isActive) (e.target as HTMLElement).style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  onHoverEnd?.();
                  if (!isActive) (e.target as HTMLElement).style.color = "#94a3b8";
                }}
                className="bg-transparent border-none cursor-pointer relative"
                style={{
                  color: isActive ? "#00d9ff" : "#94a3b8",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  transition: "color 0.3s ease",
                  padding: "10px 0",
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background: "#00d9ff",
                      boxShadow: "0 0 8px rgba(0, 217, 255, 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}

          <motion.button
            className="btn-primary"
            style={{ padding: "12px 32px", fontSize: "0.82rem" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            onClick={() => onNavigate("scanner")}
          >
            Launch Scanner
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
