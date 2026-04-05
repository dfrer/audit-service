"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// SHOGGOTH CANVAS -- FINAL PRODUCTION VERSION
//
// Architecture:
//   1. Canvas position: fixed, full viewport, z-index: 0
//   2. Page content wrapper: position: relative, z-index: 10
//   3. Core body stays at fixed viewport position (doesn't scroll)
//   4. Tendrils render on screen coordinates, anchored to page sections
//   5. Alpha values scaled for VISIBILITY on #0c0c0c background
// ═══════════════════════════════════════════════════════════════

const CH_CORE = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;,\"^`'.";
const CH_TENDRIL = "│─╱╲┌┐└┘├┤┬┴┼·:;∞≈∂⟶⟷↗↘↙↖'`\"";
const CH_WISP = "·:;,.^'`";
const CH_EYE = "◉◎●⊕⊗◈";

function hsh(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453123;
  return n - Math.floor(n);
}

function chPick(pal: string, x: number, y: number, t: number): string {
  const i = Math.floor(hsh(x * 0.7, y * 0.7, t * 0.4) * pal.length);
  return pal[Math.max(0, i % pal.length)];
}

export default function ShoggothCanvasV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // State
    const mouse = { x: -9999, y: -9999 };
    let scrollY = window.scrollY;
    let animId = 0;
    let t = 0;
    const CELL = 10;

    // Core stays at FIXED viewport position
    const coreNormX = 0.56; // 56% from left
    const coreNormY = 0.17; // 17% from top

    // Tentacle configs - angles in radians (0=right, π/2=down)
    // All pointing DOWN into page sections
    const tentCfg = [
      { ang: 0.95, len: 600, alpha: 0.30 },
      { ang: 1.15, len: 550, alpha: 0.27 },
      { ang: 1.35, len: 500, alpha: 0.24 },
      { ang: 1.57, len: 450, alpha: 0.20 }, // π/2 = straight down
      { ang: 1.75, len: 500, alpha: 0.17 },
      { ang: 2.0,  len: 580, alpha: 0.24 },
    ];
    const TENT_SEGS = 25;

    // Ghost tendrils (faint, all directions)
    const NUM_GHOSTS = 12;
    const GHOST_SEGS = 18;

    // Dust
    const NUM_DUST = 50;

    // Data structures
    interface Seg { x: number; y: number; }
    const tentacles: Seg[][] = [];
    const ghosts: Seg[][] = [];
    const dust: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number }> = [];

    // ── Initialize everything ──
    const buildAll = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cx = W * coreNormX;
      const cy = H * coreNormY;

      // Tentacles
      tentacles.length = 0;
      for (let ti = 0; ti < tentCfg.length; ti++) {
        const segs: Seg[] = [];
        const { ang, len } = tentCfg[ti];
        for (let i = 0; i < TENT_SEGS; i++) {
          const prog = i / (TENT_SEGS - 1);
          const d = prog * len;
          const perp = ang + Math.PI / 2;
          const wave = Math.sin(i * 0.15) * 5;
          segs.push({
            x: cx + Math.cos(ang) * d + Math.cos(perp) * wave,
            y: cy + Math.sin(ang) * d + Math.sin(perp) * wave,
          });
        }
        tentacles.push(segs);
      }

      // Ghost tendrils
      ghosts.length = 0;
      for (let gi = 0; gi < NUM_GHOSTS; gi++) {
        const segs: Seg[] = [];
        const ang = (gi / NUM_GHOSTS) * Math.PI * 2 - Math.PI * 0.2;
        const len = 250 + hsh(gi, 50, 0) * 200;
        for (let i = 0; i < GHOST_SEGS; i++) {
          const prog = i / (GHOST_SEGS - 1);
          segs.push({
            x: cx + Math.cos(ang) * prog * len,
            y: cy + Math.sin(ang) * prog * len,
          });
        }
        ghosts.push(segs);
      }

      // Dust
      dust.length = 0;
      for (let i = 0; i < NUM_DUST; i++) {
        const ang = hsh(i, 0, 0) * Math.PI * 2;
        const dist = 100 + hsh(i, 1, 0) * 180;
        dust.push({
          x: cx + Math.cos(ang) * dist,
          y: cy + Math.sin(ang) * dist,
          vx: 0, vy: 0,
          life: hsh(i, 2, 0) * 80,
          maxLife: 80 + hsh(i, 3, 0) * 150,
        });
      }
    };

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildAll();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    // Mouse + scroll
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY + scrollY; };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── RENDER LOOP ──
    const render = () => {
      animId = requestAnimationFrame(render);

      t += 1 / 60;
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const cx = W * coreNormX;
      const cy = H * coreNormY;
      const mDist = Math.hypot(mouse.x - cx, mouse.y - cy);
      const mInf = Math.max(0, 1 - mDist / 600);

      // ── Dark background ──
      ctx.fillStyle = "#0c0c0c";
      ctx.fillRect(0, 0, W, H);

      // ── Core breathing ──
      const breathe = Math.sin(t * 0.37) * 1.5 + Math.sin(t * 0.6 + 0.8) * 0.9 + Math.sin(t * 1.0 + 1.8) * 0.35;
      const coreR = 20 + breathe * 0.5 + mInf * 3;

      ctx.textBaseline = "top";
      const csCX = Math.floor(cx / CELL) * CELL;
      const csCY = Math.floor(cy / CELL) * CELL;
      const coreSeed = Math.floor(t * 0.4);

      // ════════════════════════════════════════════
      // PHASE 1: CORE BODY
      // ════════════════════════════════════════════
      const cols = Math.ceil(coreR) + 4;
      for (let row = -cols; row <= cols; row++) {
        for (let col = -cols; col <= cols; col++) {
          const noise = Math.sin(col * 0.35 + t * 0.3) * 1.5 + Math.cos(row * 0.3 + t * 0.25) * 1.5;
          const eDist = Math.sqrt(col * col + row * row) + noise * 0.15;
          if (eDist > coreR) continue;

          const center = 1 - eDist / coreR;
          if (center < 0.05) continue;

          // High alpha for dark background visibility
          const a = Math.pow(center, 0.5) * 0.65;
          if (a < 0.04) continue;

          ctx.fillStyle = `hsla(38, 55%, 50%, ${Math.min(a, 0.75)})`;
          ctx.fillText(chPick(CH_CORE, col, row, coreSeed), csCX + col * CELL, csCY + row * CELL);
        }
      }

      // ════════════════════════════════════════════
      // PHASE 2: EYES
      // ════════════════════════════════════════════
      const eyes = [
        { ox: -3.5, oy: 0, r: 3, speed: 0.28, phase: 0 },
        { ox: 3.5, oy: -0.5, r: 2.5, speed: 0.2, phase: Math.PI * 0.8 },
        { ox: 0, oy: 4, r: 2, speed: 0.35, phase: Math.PI * 1.4 },
      ];

      for (const eye of eyes) {
        const pulse = Math.sin(t * eye.speed + eye.phase) * 0.5 + 0.5;
        const eR = eye.r * (0.7 + pulse * 0.4);
        const ea = 0.35 + pulse * 0.3; // Max ~0.65
        const ex = csCX + Math.floor(eye.ox * CELL);
        const ey = csCY + Math.floor(eye.oy * CELL);

        for (let dr = -Math.ceil(eR + 2); dr <= Math.ceil(eR + 2); dr++) {
          for (let dc = -Math.ceil(eR + 2); dc <= Math.ceil(eR + 2); dc++) {
            const d = Math.sqrt(dc * dc + dr * dr);
            if (d > eR + 1) continue;
            const c = 1 - d / (eR + 1);
            const aa = c * c * ea;
            if (aa < 0.04) continue;

            const pal = d < eR * 0.35 ? CH_EYE : CH_CORE;
            ctx.fillStyle = `hsla(42, 70%, 60%, ${Math.min(aa, 0.85)})`;
            ctx.fillText(chPick(pal, dc + Math.floor(t * 0.3), dr, coreSeed), ex + dc * CELL, ey + dr * CELL);
          }
        }
      }

      // ════════════════════════════════════════════
      // PHASE 3: TENTACLES (6, pointing DOWN)
      // ════════════════════════════════════════════
      const tentFreqs = [0.05, 0.06, 0.07, 0.05, 0.07, 0.065];
      const tentAmps = [10, 12, 14, 10, 15, 11];
      const damping = 0.025;

      for (let ti = 0; ti < tentacles.length; ti++) {
        const segs = tentacles[ti];
        const { ang, len, alpha: baseAlpha } = tentCfg[ti];

        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          const prog = i / (segs.length - 1);

          // Target position with perpendicular wave
          const d = prog * len;
          const perp = ang + Math.PI / 2;
          const wave1 = Math.sin(i * 0.18 + t * tentFreqs[ti] * 3 + ti * 5) * tentAmps[ti];
          const wave2 = Math.cos(i * 0.11 + t * tentFreqs[ti] * 5.5 + ti * 2) * tentAmps[ti] * 0.35;

          let tx = cx + Math.cos(ang) * d + Math.cos(perp) * wave1;
          let ty = cy + Math.sin(ang) * d + Math.sin(perp) * wave2;

          // Mouse attraction
          if (mouse.x > -9990) {
            const dm = Math.hypot(mouse.x - tx, mouse.y - ty);
            if (dm < 280 && dm > 1) {
              const force = Math.pow(1 - dm / 280, 2);
              const pull = force * 40 * (1 - prog * 0.5);
              tx += (mouse.x - tx) / dm * pull;
              ty += (mouse.y - ty) / dm * pull;
            }
          }

          // Smooth movement
          seg.x = seg.x + (tx - seg.x) * damping;
          seg.y = seg.y + (ty - seg.y) * damping;

          // Viewport culling (screen-relative)
          if (seg.y < -60 || seg.y > H + 60) continue;

          // Alpha with fade
          const fade = Math.pow(1 - prog, 1.3);
          const a = baseAlpha * fade;
          if (a < 0.015) continue;

          const cs = Math.floor(t / 2.5 + i * 10 + ti * 100);
          ctx.fillStyle = `hsla(38, 48%, 46%, ${Math.min(a, 0.6)})`;
          ctx.fillText(chPick(CH_TENDRIL, i, ti, cs), seg.x, seg.y);

          // Thickness
          if (i % 4 === 0 && i < segs.length - 1) {
            const pa = Math.atan2(segs[Math.min(i + 1, segs.length - 1)].y - seg.y, segs[Math.min(i + 1, segs.length - 1)].x - seg.x) + Math.PI / 2;
            const thick = Math.sin(i * 0.3 + t * 0.1) * 0.35;
            const a2 = a * 0.4;
            if (a2 > 0.02) {
              ctx.fillStyle = `hsla(38, 40%, 42%, ${Math.min(a2, 0.4)})`;
              ctx.fillText(chPick(CH_TENDRIL, i + 1, ti + 50, cs),
                seg.x + Math.cos(pa) * thick * 3, seg.y + Math.sin(pa) * thick * 3);
            }
          }
        }
      }

      // ════════════════════════════════════════════
      // PHASE 4: GHOST TENTACLES
      // ════════════════════════════════════════════
      for (let gi = 0; gi < ghosts.length; gi++) {
        const segs = ghosts[gi];
        const baseAngle = (gi / NUM_GHOSTS) * Math.PI * 2 - Math.PI * 0.2;
        const len = 250 + hsh(gi, 50, 0) * 200;

        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          const prog = i / (segs.length - 1);
          const baseDist = prog * len;
          const wave = Math.sin(i * 0.12 + t * 0.04 + gi * 3) * 6;
          const perp = baseAngle + Math.PI / 2;

          const tx = cx + Math.cos(baseAngle) * baseDist + Math.cos(perp) * wave;
          const ty = cy + Math.sin(baseAngle) * baseDist + Math.sin(perp) * wave;

          seg.x += (tx - seg.x) * 0.012;
          seg.y += (ty - seg.y) * 0.012;

          if (seg.y < -40 || seg.y > H + 40) continue;

          const fade = Math.pow(1 - prog, 1.1);
          const a = 0.08 * fade;
          if (a < 0.008) continue;

          const cs = Math.floor(t / 3 + i + gi * 100);
          ctx.fillStyle = `hsla(38, 30%, 42%, ${Math.min(a * 2, 0.25)})`;
          ctx.fillText(chPick(CH_WISP, i, gi, cs), seg.x, seg.y);
        }
      }

      // ════════════════════════════════════════════
      // PHASE 5: DUST
      // ════════════════════════════════════════════
      for (const d of dust) {
        d.life++;
        if (d.life > d.maxLife) {
          d.life = 0;
          d.x = cx; d.y = cy;
          const angle = hsh(d.life, 0, t) * Math.PI * 2;
          const speed = 3 + hsh(d.life, 1, t) * 15;
          d.vx = Math.cos(angle) * speed;
          d.vy = Math.sin(angle) * speed;
        }
        d.vx += Math.sin(t * 0.35 + d.life * 0.04) * 0.015;
        d.vy += Math.cos(t * 0.25 + d.life * 0.03) * 0.01 + 0.003;
        d.vx *= 0.97; d.vy *= 0.97;
        d.x += d.vx; d.y += d.vy;

        if (d.y < -30 || d.y > H + 30) continue;
        if (d.life / d.maxLife > 0.8) continue;

        const a = 0.05 * (1 - d.life / d.maxLife);
        if (a < 0.005) continue;

        ctx.fillStyle = `hsla(38, 28%, 40%, ${Math.min(a * 2, 0.12)})`;
        ctx.fillText(chPick(CH_WISP, Math.floor(d.life), 0, Math.floor(t / 3)), d.x, d.y);
      }

      // ════════════════════════════════════════════
      // PHASE 6: GLOW
      // ════════════════════════════════════════════
      const glowR = coreR * CELL * 2.5;
      const ga = 0.05 + Math.sin(t * 0.18) * 0.03;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      grad.addColorStop(0, `rgba(212, 160, 60, ${ga})`);
      grad.addColorStop(0.5, `rgba(212, 160, 60, ${ga * 0.4})`);
      grad.addColorStop(1, "rgba(212, 160, 60, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    />
  );
}
