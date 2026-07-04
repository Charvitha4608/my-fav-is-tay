"use client";

import { useEffect, useRef } from "react";
import { useEraStore } from "@/store/era";
import { eraFor, type ParticleKind } from "@/lib/eras";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * One persistent fullscreen canvas that renders every era's atmosphere:
 * gold dust, fairy sparkles, autumn leaves, sea breeze, smoke, glitter,
 * fog, embers, stars, paper-in-the-rain, stage glitter, fireflies.
 *
 * When the era changes the old system doesn't cut — every living particle
 * fades out over ~900ms while the new world's particles fade in, so the
 * air itself appears to transform. All particles parallax against the
 * pointer, deeper ones moving less.
 */

const FADE = 900; // ms — particle birth/death fade

interface P {
  kind: ParticleKind;
  x: number; // 0..1 viewport-relative
  y: number;
  depth: number; // 0.15..1 parallax + size factor
  r: number; // base radius (css px)
  phase: number;
  speed: number;
  vx: number; // viewport fractions / second
  vy: number;
  rot: number;
  vr: number;
  color: [number, number, number];
  a: number; // base alpha
  born: number;
  dying: number; // 0 = alive, else death timestamp
  special: boolean; // shooting star / bokeh / rain streak variants
}

const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const PALETTES: Record<ParticleKind, [number, number, number][]> = {
  fireflies: [
    [190, 255, 160],
    [255, 244, 150],
    [150, 230, 170],
  ],
  golddust: [
    [255, 220, 140],
    [255, 240, 190],
    [242, 181, 68],
  ],
  sparkles: [
    [230, 190, 255],
    [255, 255, 255],
    [192, 132, 245],
  ],
  leaves: [
    [224, 90, 58],
    [194, 98, 30],
    [158, 58, 24],
    [232, 150, 60],
  ],
  seabreeze: [
    [255, 255, 255],
    [230, 245, 255],
  ],
  smoke: [
    [64, 66, 76],
    [88, 90, 102],
    [46, 48, 56],
  ],
  glitter: [
    [255, 150, 200],
    [255, 255, 255],
    [255, 190, 225],
    [220, 170, 255],
  ],
  fog: [
    [205, 212, 202],
    [172, 180, 172],
  ],
  embers: [
    [255, 140, 50],
    [255, 190, 90],
    [232, 100, 40],
  ],
  stars: [
    [255, 255, 255],
    [200, 205, 255],
    [255, 240, 210],
  ],
  paper: [
    [240, 236, 224],
    [222, 216, 200],
  ],
  stage: [
    [255, 210, 120],
    [255, 240, 180],
    [255, 170, 90],
  ],
};

function countFor(kind: ParticleKind, w: number): number {
  const base = w / 12;
  switch (kind) {
    case "fog":
    case "smoke":
      return 16;
    case "seabreeze":
      return 22;
    case "stars":
      return Math.round(base * 1.6) + 60;
    case "leaves":
    case "paper":
      return Math.round(base * 0.45) + 18;
    case "glitter":
    case "stage":
    case "sparkles":
      return Math.round(base * 1.1) + 40;
    default:
      return Math.round(base * 0.8) + 30;
  }
}

function spawn(kind: ParticleKind, now: number, initial: boolean): P {
  const depth = rnd(0.15, 1);
  const base: P = {
    kind,
    x: Math.random(),
    y: Math.random(),
    depth,
    r: rnd(0.8, 2.2),
    phase: Math.random() * Math.PI * 2,
    speed: rnd(0.4, 1.1),
    vx: 0,
    vy: 0,
    rot: Math.random() * Math.PI * 2,
    vr: 0,
    color: pick(PALETTES[kind]),
    a: 1,
    born: initial ? now - FADE : now + Math.random() * 500,
    dying: 0,
    special: false,
  };
  switch (kind) {
    case "fireflies":
      base.r = rnd(1, 2.4);
      base.vx = rnd(-0.008, 0.008);
      base.vy = rnd(-0.006, 0.006);
      base.a = rnd(0.5, 0.95);
      break;
    case "golddust":
      base.r = rnd(0.7, 2);
      base.vy = rnd(-0.012, -0.003);
      base.vx = rnd(-0.004, 0.004);
      base.a = rnd(0.4, 0.85);
      break;
    case "sparkles":
      base.r = rnd(0.7, 2.1);
      base.vy = rnd(-0.006, 0.004);
      base.a = rnd(0.5, 1);
      break;
    case "leaves":
      base.r = rnd(4, 9);
      base.vy = rnd(0.028, 0.06);
      base.vx = rnd(-0.015, 0.03);
      base.vr = rnd(-1.4, 1.4);
      base.a = rnd(0.55, 0.9);
      base.y = initial ? Math.random() : -0.08;
      break;
    case "seabreeze":
      base.special = Math.random() < 0.35; // big soft puffs
      base.r = base.special ? rnd(40, 110) : rnd(0.8, 1.8);
      base.vx = rnd(0.006, 0.02);
      base.a = base.special ? rnd(0.05, 0.14) : rnd(0.3, 0.6);
      break;
    case "smoke":
      base.r = rnd(60, 150);
      base.vy = rnd(-0.008, -0.002);
      base.vx = rnd(-0.006, 0.006);
      base.a = rnd(0.05, 0.13);
      base.y = rnd(0.3, 1.1);
      break;
    case "glitter":
      base.r = rnd(0.6, 1.9);
      base.vy = rnd(0.004, 0.014);
      base.speed = rnd(1.2, 2.4);
      base.a = rnd(0.5, 1);
      break;
    case "fog":
      base.r = rnd(90, 220);
      base.vx = rnd(-0.012, 0.012) || 0.008;
      base.a = rnd(0.04, 0.11);
      base.y = rnd(0.25, 1.05);
      break;
    case "embers":
      base.r = rnd(1, 2.6);
      base.vy = rnd(-0.03, -0.01);
      base.vx = rnd(-0.008, 0.008);
      base.a = rnd(0.5, 1);
      base.y = initial ? Math.random() : rnd(0.85, 1.05);
      break;
    case "stars":
      base.r = rnd(0.5, 1.8);
      base.a = rnd(0.4, 1);
      base.y = Math.random() * 0.85;
      break;
    case "paper":
      base.special = Math.random() < 0.3; // rain streaks
      if (base.special) {
        base.r = rnd(6, 14); // streak length
        base.vy = rnd(0.5, 0.85);
        base.a = rnd(0.1, 0.25);
      } else {
        base.r = rnd(2.5, 6);
        base.vy = rnd(0.04, 0.09);
        base.vx = rnd(-0.02, 0.02);
        base.vr = rnd(-2, 2);
        base.a = rnd(0.4, 0.8);
      }
      base.y = initial ? Math.random() : -0.05;
      break;
    case "stage":
      base.special = Math.random() < 0.12; // bokeh discs
      base.r = base.special ? rnd(8, 22) : rnd(0.6, 2);
      base.vy = base.special ? rnd(-0.004, 0.004) : rnd(0.006, 0.018);
      base.speed = rnd(1, 2.2);
      base.a = base.special ? rnd(0.08, 0.2) : rnd(0.5, 1);
      break;
  }
  return base;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eraId = useEraStore((s) => s.eraId);
  const eraRef = useRef(eraId);
  eraRef.current = eraId;
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let dpr = 1;
    let particles: P[] = [];
    let liveKind: ParticleKind = eraFor(eraRef.current).particles;
    let shootTimer = 0;
    const target = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
    }

    function seed(kind: ParticleKind, initial: boolean) {
      const now = performance.now();
      const n = countFor(kind, window.innerWidth);
      for (let i = 0; i < n; i++) particles.push(spawn(kind, now, initial));
    }

    function retire(now: number) {
      for (const p of particles) if (!p.dying) p.dying = now;
    }

    function step(p: P, dt: number, t: number) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      switch (p.kind) {
        case "fireflies":
          p.x += Math.sin(t * 0.0004 * p.speed + p.phase) * 0.00022;
          p.y += Math.cos(t * 0.0005 * p.speed + p.phase) * 0.00018;
          break;
        case "leaves":
        case "paper":
          if (!p.special) p.x += Math.sin(t * 0.001 + p.phase) * 0.0006;
          break;
        case "embers":
          p.x += Math.sin(t * 0.002 * p.speed + p.phase) * 0.0004;
          break;
        case "smoke":
        case "fog":
          break;
      }
      // wrap around the viewport with margins generous enough for blobs
      const m = p.r > 30 ? 0.35 : 0.12;
      if (p.x < -m) p.x = 1 + m;
      if (p.x > 1 + m) p.x = -m;
      if (p.y < -m) p.y = 1 + m;
      if (p.y > 1 + m) p.y = -m;
    }

    function fade(p: P, now: number): number {
      const inA = Math.min(1, Math.max(0, (now - p.born) / FADE));
      const outA = p.dying ? 1 - Math.min(1, (now - p.dying) / FADE) : 1;
      return inA * outA;
    }

    function draw(now: number, dt: number) {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);
      eased.x += (target.x - eased.x) * 0.035;
      eased.y += (target.y - eased.y) * 0.035;

      // shooting star for Midnights, roughly every 4–9 s
      if (liveKind === "stars" && now > shootTimer) {
        shootTimer = now + rnd(4000, 9000);
        const s = spawn("stars", now, false);
        s.special = true;
        s.x = rnd(0.1, 0.7);
        s.y = rnd(0.05, 0.35);
        s.vx = rnd(0.25, 0.4);
        s.vy = rnd(0.08, 0.16);
        s.r = 1.4;
        s.a = 1;
        s.dying = now + 900; // burns out on its own
        particles.push(s);
      }

      let alive = 0;
      const next: P[] = [];
      for (const p of particles) {
        if (!reduced) step(p, dt, now);
        const f = fade(p, now);
        if (p.dying && f <= 0) continue;
        next.push(p);
        if (!p.dying) alive++;

        const tw =
          reduced ? 0.75 : 0.55 + 0.45 * Math.sin(now * 0.001 * p.speed + p.phase);
        const alpha = p.a * f * (p.r > 30 ? 1 : tw) * (0.35 + 0.65 * p.depth);
        if (alpha <= 0.004) continue;

        const ox = (eased.x - 0.5) * 46 * p.depth * dpr;
        const oy = (eased.y - 0.5) * 30 * p.depth * dpr;
        const cx = p.x * W + ox;
        const cy = p.y * H + oy;
        const [r, g, b] = p.color;

        if (p.r > 30) {
          // big soft blob (fog / smoke / sea puffs)
          const rad = p.r * dpr * (0.6 + 0.4 * p.depth);
          const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, rad);
          grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx!.fillStyle = grd;
          ctx!.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
          continue;
        }

        if (p.kind === "leaves") {
          ctx!.save();
          ctx!.translate(cx, cy);
          ctx!.rotate(p.rot);
          ctx!.fillStyle = `rgba(${r},${g},${b},${p.a * f})`;
          ctx!.beginPath();
          ctx!.ellipse(0, 0, p.r * dpr, p.r * 0.45 * dpr, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.restore();
          continue;
        }

        if (p.kind === "paper") {
          if (p.special) {
            // rain streak
            ctx!.strokeStyle = `rgba(210,214,220,${p.a * f})`;
            ctx!.lineWidth = dpr * 0.8;
            ctx!.beginPath();
            ctx!.moveTo(cx, cy);
            ctx!.lineTo(cx - dpr * 2, cy + p.r * dpr * 2.4);
            ctx!.stroke();
          } else {
            ctx!.save();
            ctx!.translate(cx, cy);
            ctx!.rotate(p.rot);
            ctx!.fillStyle = `rgba(${r},${g},${b},${p.a * f})`;
            ctx!.fillRect(-p.r * dpr * 0.7, -p.r * dpr * 0.45, p.r * dpr * 1.4, p.r * dpr * 0.9);
            ctx!.restore();
          }
          continue;
        }

        if (p.kind === "stars" && p.special) {
          // shooting star with a trail
          const len = 60 * dpr;
          const grad = ctx!.createLinearGradient(cx, cy, cx - len, cy - len * 0.4);
          grad.addColorStop(0, `rgba(255,255,255,${f})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = dpr * 1.4;
          ctx!.beginPath();
          ctx!.moveTo(cx, cy);
          ctx!.lineTo(cx - len, cy - len * 0.4);
          ctx!.stroke();
          continue;
        }

        // default: glowing dot
        ctx!.beginPath();
        ctx!.arc(cx, cy, p.r * (0.5 + 0.5 * p.depth) * dpr, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx!.fill();

        // cross glints on the brightest sparkle-family particles
        if (
          (p.kind === "sparkles" || p.kind === "glitter" || p.kind === "stage") &&
          tw > 0.9 &&
          p.r > 1.5
        ) {
          const len = p.r * 4 * dpr;
          ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.55})`;
          ctx!.lineWidth = dpr * 0.7;
          ctx!.beginPath();
          ctx!.moveTo(cx - len, cy);
          ctx!.lineTo(cx + len, cy);
          ctx!.moveTo(cx, cy - len);
          ctx!.lineTo(cx, cy + len);
          ctx!.stroke();
        }
      }
      particles = next;

      // keep steady-state population for systems whose particles exit
      const want = countFor(liveKind, window.innerWidth);
      if (alive < want && !reduced) {
        for (let i = 0; i < Math.min(3, want - alive); i++) {
          particles.push(spawn(liveKind, now, false));
        }
      }
    }

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.06);
      last = now;
      const kind = eraFor(eraRef.current).particles;
      if (kind !== liveKind) {
        retire(now);
        liveKind = kind;
        seed(kind, false);
      }
      draw(now, dt);
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const onResize = () => {
      resize();
      particles = [];
      seed(liveKind, true);
      if (reduced) draw(performance.now(), 0);
    };

    resize();
    seed(liveKind, true);
    if (reduced) {
      draw(performance.now(), 0);
      // still swap the static frame when the era changes
      const unsub = useEraStore.subscribe(() => {
        particles = [];
        liveKind = eraFor(useEraStore.getState().eraId).particles;
        seed(liveKind, true);
        draw(performance.now(), 0);
      });
      window.addEventListener("resize", onResize);
      return () => {
        unsub();
        window.removeEventListener("resize", onResize);
      };
    }

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduced]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
  );
}
