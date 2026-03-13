"use client";

import { useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   CANVAS-BASED STARFIELD — left-to-right inverted parabola
   High-quality particles with glow, proper comet trails
   ═══════════════════════════════════════════════════ */

interface Star {
  progress: number;
  baseY: number;
  speed: number;
  arcHeight: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface CometParticle {
  x: number;
  y: number;
  alpha: number;
}

interface Comet {
  progress: number;
  baseY: number;
  arcHeight: number;
  speed: number;
  active: boolean;
  timer: number;
  trail: CometParticle[];
  hue: number; // 0=cyan, 1=purple
  size: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create stars
    const STAR_COUNT = 1200;
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        progress: Math.random(),
        baseY: Math.random() * height,
        speed: 0.00008 + Math.random() * 0.00025,
        arcHeight: 30 + Math.random() * 120,
        size: 0.3 + Math.random() * 1.8,
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Create comets
    const comets: Comet[] = [
      createComet(),
      createComet(),
    ];
    comets[1].timer = 3; // stagger second comet

    function createComet(): Comet {
      return {
        progress: -0.05,
        baseY: 0.2 * height + Math.random() * 0.4 * height,
        arcHeight: 60 + Math.random() * 150,
        speed: 0.0015 + Math.random() * 0.002,
        active: false,
        timer: 0,
        trail: [],
        hue: Math.random() > 0.5 ? 0 : 1,
        size: 1.5 + Math.random() * 1.5,
      };
    }

    function resetComet(c: Comet) {
      c.progress = -0.05;
      c.baseY = 0.15 * height + Math.random() * 0.5 * height;
      c.arcHeight = 60 + Math.random() * 150;
      c.speed = 0.0015 + Math.random() * 0.002;
      c.active = true;
      c.timer = 0;
      c.trail = [];
      c.hue = Math.random() > 0.5 ? 0 : 1;
      c.size = 1.5 + Math.random() * 1.5;
    }

    function getParabolaY(t: number, baseY: number, arcH: number): number {
      // Inverted parabola: peaks at t=0.5
      return baseY - arcH * (-(t - 0.5) * (t - 0.5) * 4 + 1);
    }

    let lastTime = performance.now();

    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // ── Draw stars ──
      for (const star of stars) {
        star.progress += star.speed * dt * 60;
        if (star.progress > 1.15) {
          star.progress = -0.15;
          star.baseY = Math.random() * height;
          star.arcHeight = 30 + Math.random() * 120;
          star.brightness = 0.3 + Math.random() * 0.7;
        }

        const x = star.progress * (width + width * 0.3) - width * 0.15;
        const y = getParabolaY(star.progress, star.baseY, star.arcHeight);

        // Twinkle
        const twinkle = 0.5 + 0.5 * Math.sin(now * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * twinkle;

        // Fade at edges
        const edgeFade = Math.min(1, star.progress * 5, (1.1 - star.progress) * 5);
        const finalAlpha = alpha * Math.max(0, edgeFade);

        if (finalAlpha < 0.02) continue;

        // Draw glow
        if (star.size > 1) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 4);
          glow.addColorStop(0, `rgba(180, 220, 255, ${finalAlpha * 0.15})`);
          glow.addColorStop(1, `rgba(180, 220, 255, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star core
        const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, star.size);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${finalAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(200, 230, 255, ${finalAlpha * 0.6})`);
        coreGrad.addColorStop(1, `rgba(100, 180, 255, 0)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Draw comets ──
      for (const comet of comets) {
        if (!comet.active) {
          comet.timer += dt;
          if (comet.timer > 6 + Math.random() * 4) {
            resetComet(comet);
          }
          continue;
        }

        comet.progress += comet.speed * dt * 60;

        const x = comet.progress * (width + width * 0.3) - width * 0.15;
        const y = getParabolaY(comet.progress, comet.baseY, comet.arcHeight);

        // Add trail particle
        comet.trail.push({ x, y, alpha: 1 });

        // Decay trail
        for (let i = comet.trail.length - 1; i >= 0; i--) {
          comet.trail[i].alpha -= dt * 2.5;
          if (comet.trail[i].alpha <= 0) {
            comet.trail.splice(i, 1);
          }
        }

        // Draw trail (back to front)
        const cyanOrPurple = comet.hue === 0;
        for (let i = 0; i < comet.trail.length; i++) {
          const p = comet.trail[i];
          const t = p.alpha;
          const trailSize = comet.size * t * 0.6;

          if (trailSize < 0.1) continue;

          // Outer glow
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, trailSize * 8);
          if (cyanOrPurple) {
            glow.addColorStop(0, `rgba(0, 217, 255, ${t * 0.08})`);
          } else {
            glow.addColorStop(0, `rgba(123, 97, 255, ${t * 0.08})`);
          }
          glow.addColorStop(1, `rgba(0, 0, 0, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, trailSize * 8, 0, Math.PI * 2);
          ctx.fill();

          // Core trail
          const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, trailSize);
          if (cyanOrPurple) {
            core.addColorStop(0, `rgba(150, 240, 255, ${t * 0.5})`);
            core.addColorStop(1, `rgba(0, 217, 255, 0)`);
          } else {
            core.addColorStop(0, `rgba(180, 160, 255, ${t * 0.5})`);
            core.addColorStop(1, `rgba(123, 97, 255, 0)`);
          }
          ctx.fillStyle = core;
          ctx.beginPath();
          ctx.arc(p.x, p.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Comet head
        const headGlow = ctx.createRadialGradient(x, y, 0, x, y, comet.size * 12);
        if (cyanOrPurple) {
          headGlow.addColorStop(0, `rgba(0, 217, 255, 0.15)`);
        } else {
          headGlow.addColorStop(0, `rgba(123, 97, 255, 0.15)`);
        }
        headGlow.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(x, y, comet.size * 12, 0, Math.PI * 2);
        ctx.fill();

        // Inner head
        const headCore = ctx.createRadialGradient(x, y, 0, x, y, comet.size * 2);
        headCore.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
        headCore.addColorStop(0.3, cyanOrPurple ? `rgba(150, 240, 255, 0.6)` : `rgba(190, 170, 255, 0.6)`);
        headCore.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = headCore;
        ctx.beginPath();
        ctx.arc(x, y, comet.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // White hot core
        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, comet.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (comet.progress > 1.15) {
          comet.active = false;
          comet.timer = 0;
          comet.trail = [];
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
}
