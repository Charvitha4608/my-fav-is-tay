"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#ec5f9f", "#f8c1da", "#ffd166", "#9d7bdd", "#ffffff"];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  tilt: number;
};

/** One-shot falling/bursting confetti, drawn on a plain canvas — no dependency. */
export function ConfettiCanvas({ fire }: { fire: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const w = window.innerWidth;
    const h = window.innerHeight;
    const pieces: Piece[] = Array.from({ length: 160 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 2 + Math.random() * 3,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 10,
      tilt: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let elapsed = 0;
    const duration = 4200;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      elapsed += dt;
      ctx.clearRect(0, 0, w, h);

      for (const p of pieces) {
        p.tilt += 0.06;
        p.x += p.vx + Math.sin(p.tilt) * 0.6;
        p.y += p.vy;
        p.rotation += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = elapsed > duration - 500 ? Math.max(0, (duration - elapsed) / 500) : 1;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [fire]);

  if (!fire) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
