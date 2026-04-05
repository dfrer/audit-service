"use client";

import { useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ASCII ICON DEFINITIONS
// Each icon is a grid of strings rendered at tendril terminations
// ═══════════════════════════════════════════════════════════════
const ICONS = {
  briefcase: [        // Business AI Ops
    "  ┌─────┐  ",
    "  │░░░░░░│  ",
    "  │░░░░░░│  ",
    "  └──┬──┬─┘  ",
    "     │  │    ",
    "   ──┴──┴──  ",
  ],
  brain: [            // Personal AI Workflows  
    "    ░░░░░    ",
    "  ░░#░░░░░#░░  ",
    "  ░░░░░░░░░░░  ",
    "   ░░░█░█░░░   ",
    "    ░░░░░░░    ",
    "     └───┘     ",
  ],
  server: [           // Local / Self-Hosted
    "  ┌───────┐  ",
    "  │ ░░░░░ │  ",
    "  ├───────┤  ",
    "  │ ░░░░░ │  ",
    "  ├───────┤  ",
    "  │ ░░░░░ │  ",
    "  └───────┘  ",
  ],
  bracket: [          // AI Coding Workflows
    "  ⟨  ░░░  ⟩  ",
    "  │  ░░░  │  ",
    "  └───────┘  ",
  ],
  target: [           // Get an Audit (CTA)
    "   ░░░░░   ",
    "  ░░ ◉ ░░  ",
    "   ░░░░░   ",
  ],
  diamond: [          // Stats
    "    ◆    ",
    "   ░░░   ",
    "  ░░░░░  ",
    "   ░░░   ",
    "    ◆    ",
  ],
  clock: [            // Process / Speed
    "   ┌───┐   ",
    "  │  │  │  ",
    "  │ ░▶ │  ",
    "  │  │  │  ",
    "   └───┘   ",
  ],
  dollar: [           // Pricing
    "    ──    ",
    "   $░░$   ",
    "    $     ",
    "   $░░$   ",
    "    ──    ",
  ],
  shield: [           // Why This Works
    "   ┌───┐   ",
    "   │░░░│   ",
    "   │ ◉ │   ",
    "   │░░░│   ",
    "   └───┘   ",
  ],
  question: [         // FAQ
    "   ─────   ",
    "  │  ◉  │  ",
    "  └──┬──┘  ",
    "     │     ",
    "   ░░░░░   ",
  ],
  arrow: [            // Final CTA
    "  → ░░░ →  ",
    "   ░ ░ ░   ",
    "  → ░░░ →  ",
  ],
};

// Icon-to-section mapping
const SECTION_ICONS: Record<string, string> = {
  "diagnose-0": "briefcase",
  "diagnose-1": "brain",
  "diagnose-2": "server",
  "diagnose-3": "bracket",
  "cta-primary": "target",
  "stat-0": "diamond",
  "stat-1": "dollar",
  "stat-2": "clock",
  "stat-3": "shield",
  "step-0": "target",
  "step-1": "brain",
  "step-2": "arrow",
  "pricing-card-0": "dollar",
  "pricing-card-1": "dollar",
  "pricing-card-2": "dollar",
  "why-0": "shield",
  "why-1": "shield",
  "why-2": "shield",
  "faq-section": "question",
  "final-cta": "arrow",
};

// ═══════════════════════════════════════════════════════════════
// CHARACTER PALETTES (no emoji, only monospace-safe chars)
// ═══════════════════════════════════════════════════════════════
const P = {
  core:    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'.",
  mid:     "oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'.≈≠∂∇",
  tendril: "│─╱╲·:;┌┐└┘├┤┬┴┼∞≈∂⟶⟷⟹⟸↗↘↙↖'`\",;:·",
  wisp:    "·:;,.^'`  ",
  eye:     "◉◎●○⊕⊗⊛◈◆",
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface Pt { x: number; y: number; }

interface IconDef {
  key: string;
  id: string;
  screenPos: Pt;
  visible: boolean;
  charTimer: number;
  chars: string[][];
}

interface TargetEl {
  id: string;
  rect: DOMRect;
  center: Pt;
  iconKey: string | null;
}

interface Particle {
  pos: Pt;
  vel: Pt;
  life: number;
  maxLife: number;
  ch: string;
  alpha: number;
  size: number;
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function hsh(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453123;
  return n - Math.floor(n);
}

function pickChar(pal: string, x: number, y: number, t: number): string {
  const i = Math.floor(hsh(x * 0.7, y * 0.7, t * 0.4) * pal.length);
  return pal[Math.max(0, Math.min(i % pal.length, pal.length - 1))];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function dist(a: Pt, b: Pt): number {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Simplex-like noise function for organic movement
function noise1D(x: number, seed: number): number {
  const a = hsh(Math.floor(x), 0, seed);
  const b = hsh(Math.floor(x) + 1, 0, seed);
  const t = x - Math.floor(x);
  const s = t * t * (3 - 2 * t); // smoothstep
  return a * (1 - s) + b * s;
}

function fbm(x: number, seed: number, octaves: number): number {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise1D(x * freq, seed + i * 100);
    amp *= 0.5;
    freq *= 2;
  }
  return val;
}

// ═══════════════════════════════════════════════════════════
// TENDRIL SYSTEM
// ═══════════════════════════════════════════════════════════
interface TendrilChain {
  /** Origin point in viewport coords */
  origin: Pt;
  /** Target element id (null for ambient tendrils) */
  targetId: string | null;
  /** Chain segments: each segment lerps toward a target */
  segments: { pos: Pt; target: Pt; idx: number }[];
  /** Number of segments */
  count: number;
  /** Cell size for snapping */
  cellSize: number;
  /** Character palette */
  palette: string;
  /** Base alpha */
  maxAlpha: number;
  /** Wave frequency (very slow: 0.1-0.2) */
  waveFreq: number;
  /** Wave amplitude in pixels */
  waveAmp: number;
  /** Damping factor (lower = slower, heavier) */
  damping: number;
  /** Noise seed for uniqueness */
  noiseSeed: number;
  /** Whether this tendril is currently visible */
  visible: boolean;
  /** Layer for z-sorting: 1=ghost, 2=main, 3=core-adjacent */
  layer: number;
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ShoggothCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Pt>({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  const targetsRef = useRef<TargetEl[]>([]);
  const iconsRef = useRef<IconDef[]>([]);
  const tendrilsRef = useRef<TendrilChain[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastTargetsCheck = useRef(0);

  // ── Build tendrils once ───────────────────────────────
  const buildTendrils = useCallback(
    (corePos: Pt, _targets: TargetEl[]): TendrilChain[] => {
      // Map target elements to tendril configs
      const targetMap = new Map(_targets.map(t => [t.id, t]));

      // Primary tendrils: one per target icon
      const primaryTendrils: TendrilChain[] = [];

      for (const target of _targets) {
        if (!target.iconKey) continue;

        const dx = target.center.x - corePos.x;
        const dy = target.center.y - corePos.y;
        const dLen = Math.sqrt(dx * dx + dy * dy);
        if (dLen < 30) continue; // too close

        const numSeg = Math.max(15, Math.min(40, Math.floor(dLen / 25)));
        const segs = [];
        for (let i = 0; i < numSeg; i++) {
          const t = i / (numSeg - 1);
          const sx = lerp(corePos.x, target.center.x, t);
          const sy = lerp(corePos.y, target.center.y, t);
          segs.push({ pos: { x: sx, y: sy }, target: { x: sx, y: sy }, idx: i });
        }

        const isGhost = hsh(target.center.x, target.center.y, 99) > 0.6;
        const isCore = hsh(target.center.x, target.center.y, 77) < 0.3;

        primaryTendrils.push({
          origin: { ...corePos },
          targetId: target.id,
          segments: segs,
          count: numSeg,
          cellSize: isGhost ? 24 : isCore ? 12 : 15,
          palette: isGhost ? P.wisp : isCore ? P.mid : P.tendril,
          maxAlpha: isGhost ? 0.03 : isCore ? 0.15 : 0.10,
          waveFreq: 0.08 + hsh(target.center.x, 0, 0) * 0.08,
          waveAmp: isGhost ? 25 : isCore ? 8 : 14,
          // Very slow damping for heavy movement
          damping: isGhost ? 0.02 : isCore ? 0.08 : 0.05,
          noiseSeed: hsh(target.center.x, target.center.y, 42) * 10000,
          visible: true,
          layer: isGhost ? 1 : isCore ? 3 : 2,
        });
      }

      // Ambient tendrils (don't connect to targets, just reach into space)
      const ambientAngles = [-2.8, -2.2, -1.6, -1.0, -0.4, 0.2, 0.8, 1.4, 2.0, 2.6];
      for (let ai = 0; ai < ambientAngles.length; ai++) {
        const angle = ambientAngles[ai];
        const len = 300 + hsh(ai, 50, 0) * 200;
        const numSeg = Math.floor(len / 18);
        const segs = [];
        for (let i = 0; i < numSeg; i++) {
          const t = i / (numSeg - 1);
          const d = t * len;
          segs.push({
            pos: { x: corePos.x + Math.cos(angle) * d, y: corePos.y + Math.sin(angle) * d },
            target: { x: corePos.x + Math.cos(angle) * d, y: corePos.y + Math.sin(angle) * d },
            idx: i,
          });
        }
        primaryTendrils.push({
          origin: { ...corePos },
          targetId: null,
          segments: segs,
          count: numSeg,
          cellSize: 26,
          palette: P.wisp,
          maxAlpha: 0.025,
          waveFreq: 0.06 + ai * 0.02,
          waveAmp: 20 + ai * 3,
          damping: 0.015,
          noiseSeed: ai * 5000,
          visible: true,
          layer: 1,
        });
      }

      return primaryTendrils;
    },
    []
  );

  // ── Build particles ───────────────────────────────────
  const buildParticles = useCallback((corePos: Pt): Particle[] => {
    const parts: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = hsh(i, 0, 0) * Math.PI * 2;
      const baseDist = 120 + hsh(i, 1, 0) * 200;
      parts.push({
        pos: {
          x: corePos.x + Math.cos(angle) * baseDist,
          y: corePos.y + Math.sin(angle) * baseDist,
        },
        vel: { x: 0, y: 0 },
        life: hsh(i, 2, 0) * 200,
        maxLife: 150 + hsh(i, 3, 0) * 200,
        ch: pickChar(P.wisp, i, 0, 0),
        alpha: 0.02 + hsh(i, 4, 0) * 0.03,
        size: 8 + hsh(i, 5, 0) * 4,
      });
    }
    return parts;
  }, []);

  // ── Query DOM targets ────────────────────────────────
  const updateTargets = useCallback(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-shoggoth]");
    const scrollY = scrollRef.current;
    const newTargets: TargetEl[] = [];

    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const id = el.getAttribute("data-shoggoth");
      if (!id) continue;
      const rect = el.getBoundingClientRect();
      const iconKey = SECTION_ICONS[id] || null;
      // Skip elements not near viewport (more than 2 viewports below)
      if (rect.top > window.innerHeight * 2.5) continue;
      // Skip elements far above (more than 1 viewport above)
      if (rect.bottom < -window.innerHeight) continue;

      newTargets.push({
        id,
        rect,
        center: {
          x: rect.left + rect.width / 2,
          y: rect.top + scrollY + rect.height / 2,
        },
        iconKey,
      });
    }

    targetsRef.current = newTargets;

    // Build icons
    const icons: IconDef[] = [];
    for (const target of newTargets) {
      if (!target.iconKey) continue;
      icons.push({
        key: target.iconKey,
        id: target.id,
        screenPos: {
          x: target.rect.left + target.rect.width / 2,
          y: target.rect.top + target.rect.height / 2,
        },
        visible: true,
        charTimer: 0,
        chars: [],
      });
    }
    iconsRef.current = icons;
  }, []);

  // ── Mouse tracking ───────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + scrollRef.current };
    };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ── Main effect ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let corePos = { x: 0, y: 0 };
    let coreRCells = 0;
    let coreBreath = 0;
    let hasInit = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!hasInit) {
        // Initial core position: 58% from left, 38% from top of viewport
        corePos = {
          x: canvas.width * 0.58,
          y: canvas.height * 0.25,
        };
        coreRCells = 16;
        hasInit = true;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    // Initial target scan
    updateTargets();
    lastTargetsCheck.current = 0;

    // Build tendrils and particles
    tendrilsRef.current = buildTendrils(corePos, []);
    particlesRef.current = buildParticles(corePos);

    // ═════════════════════════════════════════════
    //  MAIN RENDER LOOP
    // ═════════════════════════════════════════════
    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) { raf = requestAnimationFrame(render); return; }

      t += 1 / 60;
      const scrollY = scrollRef.current;
      const coreScreenX = corePos.x;
      const coreScreenY = corePos.y;
      const mouse = mouseRef.current;
      const mDist = dist(mouse, { x: coreScreenX, y: coreScreenY + scrollY });
      const mInfluence = mouse.x > -999 ? Math.max(0, 1 - mDist / 800) : 0;

      // ─── Core breathing (SLOW: 0.06 Hz = 16 second cycle) ───
      const b1 = Math.sin(t * 0.38) * 2.0;    // 16s cycle
      const b2 = Math.sin(t * 0.63 + 0.8) * 1.2; // 10s cycle
      const b3 = Math.sin(t * 1.0 + 1.5) * 0.5;  // 6s cycle
      coreBreath = b1 + b2 + b3;
      coreRCells = 16 + coreBreath * 0.5 + mInfluence * 4;

      // Core drift toward mouse (very slow, heavy)
      const coreDriftSpeed = 0.002 * mInfluence;
      corePos.x = lerp(corePos.x, corePos.x + (mouse.x - corePos.x) * coreDriftSpeed, 0.01);
      corePos.y = lerp(corePos.y, corePos.y + (mouse.y - scrollY - corePos.y) * coreDriftSpeed, 0.01);

      // ─── Scan for DOM targets (every 500ms) ───
      if (t - lastTargetsCheck.current > 0.5) {
        lastTargetsCheck.current = t;
        updateTargets();
      }

      // Target positions for tendril routing
      const targetPositions = targetsRef.current;
      // Map target ids to their screen positions
      const targetMap = new Map<string, Pt>();
      for (const tgt of targetPositions) {
        targetMap.set(tgt.id, { x: tgt.center.x, y: tgt.center.y });
      }

      // ─── Update tendril physics ───────────────────────
      for (const tr of tendrilsRef.current) {
        // If target element moved, update origin
        if (tr.targetId && targetMap.has(tr.targetId)) {
          const tgt = targetMap.get(tr.targetId)!;
          // Check visibility
          tr.visible = true;
        } else if (tr.targetId) {
          // Target element not on screen
          tr.visible = false;
        }
        if (!tr.targetId) tr.visible = true; // ambient always visible

        // Update segment targets
        for (let i = 0; i < tr.segments.length; i++) {
          const seg = tr.segments[i];
          const progress = i / Math.max(tr.segments.length - 1, 1);

          // Base target: curved path from origin to target (or ambient direction)
          let baseX: number, baseY: number;
          if (tr.targetId && targetMap.has(tr.targetId)) {
            const tgtPt = targetMap.get(tr.targetId)!;
            // Convert target to screen space
            const tgtScreenX = tgtPt.x;
            const tgtScreenY = tgtPt.y - scrollY;
            baseX = lerp(coreScreenX, tgtScreenX, progress);
            baseY = lerp(coreScreenY, tgtScreenY, progress);
          } else {
            const wave = Math.sin(i * 0.2 + t * tr.waveFreq * 2) * tr.waveAmp;
            const wave2 = Math.cos(i * 0.12 + t * tr.waveFreq * 3.5 + tr.noiseSeed) * tr.waveAmp * 0.4;
            const angle = Math.atan2(tr.segments[tr.segments.length - 1].target.y - coreScreenY, tr.segments[tr.segments.length - 1].target.x - coreScreenX);
            const d = progress * tr.count * tr.cellSize * 0.9;
            baseX = coreScreenX + Math.cos(angle + wave * 0.008) * d;
            baseY = coreScreenY + Math.sin(angle + wave * 0.008) * d + wave2;
          }

          // For target-based tendrils: add wave perpendicular to path
          if (tr.targetId && targetMap.has(tr.targetId)) {
            const tgtPt = targetMap.get(tr.targetId)!;
            const tgtScreenY = tgtPt.y - scrollY;
            const dx = tgtScreenY - coreScreenY;
            const dLen = Math.abs(dx) || 1;
            const perpAngle = dx > 0 ? Math.PI / 2 : -Math.PI / 2;
            const wave = Math.sin(i * 0.25 + t * tr.waveFreq * 2 + tr.noiseSeed) * tr.waveAmp;
            const wave2 = Math.cos(i * 0.15 + t * tr.waveFreq * 3 + tr.noiseSeed * 2) * tr.waveAmp * 0.5;
            baseX += Math.cos(perpAngle) * wave * (1 - progress * 0.3);
            baseY += Math.sin(perpAngle) * wave * 0.2 + wave2 * (1 - progress * 0.3);
          }

          // Mouse attraction
          const mousePull = 150;
          const dMouse = dist({ x: baseX, y: baseY + scrollY }, mouse);
          if (dMouse < 350 && mouse.x > -999) {
            const force = Math.pow(1 - dMouse / 350, 2);
            const pull = force * mousePull * (1 - tr.damping * 15) * (1 - progress * 0.5);
            baseX += (mouse.x - baseX) / dMouse * pull;
            baseY += ((mouse.y - scrollY) - baseY) / dMouse * pull;
          }

          seg.target.x = baseX;
          seg.target.y = baseY;

          // Lerp toward target (SLOW: 0.02-0.08 damping)
          seg.pos.x = lerp(seg.pos.x, baseX, tr.damping);
          seg.pos.y = lerp(seg.pos.y, baseY, tr.damping);
        }
      }

      // ─── Update particles ─────────────────────────────
      for (const p of particlesRef.current) {
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          const angle = hsh(p.life, 0, t) * Math.PI * 2;
          const baseDist = 120 + hsh(p.life, 1, t) * 200;
          p.pos.x = coreScreenX + Math.cos(angle) * baseDist;
          p.pos.y = coreScreenY + Math.sin(angle) * baseDist + scrollY * 0;
          p.vel.x = 0;
          p.vel.y = 0;
          p.ch = pickChar(P.wisp, Math.floor(t * 10 + p.life), 0, 0);
        }

        // Gentle drift
        p.vel.x += Math.sin(t * 0.5 + p.life * 0.1) * 0.05;
        p.vel.y += Math.cos(t * 0.3 + p.life * 0.08) * 0.03;
        p.vel.x *= 0.98;
        p.vel.y *= 0.98;
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
      }

      // ─── Collect all cells for rendering ──────────────
      interface Cell {
        x: number; y: number; ch: string; a: number; fontSize: string;
      }
      const cells: Cell[] = [];

      // ── PHASE 1: CORE BODY ──
      const CORE_CS = 11;
      const cCX = Math.floor(coreScreenX / CORE_CS) * CORE_CS;
      const cCY = Math.floor(coreScreenY / CORE_CS) * CORE_CS;
      const cols = Math.ceil(coreRCells) + 2;

      for (let row = -cols; row <= cols; row++) {
        for (let col = -cols; col <= cols; col++) {
          const nd = Math.sin(col * 0.35 + t * 0.38) * 2.0 +
                     Math.cos(row * 0.28 + t * 0.32) * 2.0 +
                     Math.sin((col + row) * 0.2 + t * 0.55) * 1.0;
          const eDist = Math.sqrt(col * col + row * row) + nd * 0.25;

          if (eDist > coreRCells + 0.5) continue;

          const centerness = clamp(1 - eDist / (coreRCells + 0.5), 0, 1);
          const density = Math.pow(centerness, 0.7);
          let a = density * 0.30;

          // Slow char change: only update every ~2 seconds
          const charSeed = Math.floor(t / 2);
          const pal = col * col + row * row < coreRCells * coreRCells * 0.3 ? P.core : P.mid;

          if (a < 0.008) continue;

          cells.push({
            x: cCX + col * CORE_CS,
            y: cCY + row * CORE_CS,
            ch: pickChar(pal, col, row, charSeed),
            a: Math.min(a, 0.60),
            fontSize: a > 0.15 ? "bold 13px" : a > 0.08 ? "12px" : "11px",
          });
        }
      }

      // ── PHASE 2: EYES ──
      const eyeDefs = [
        { offX: -2.5, offY: 1.5, r: 2.5, phase: 0, speed: 0.35 },
        { offX: 3.0, offY: -1.0, r: 2.0, phase: Math.PI * 0.9, speed: 0.25 },
        { offX: 0.5, offY: 3.0, r: 1.5, phase: Math.PI * 1.5, speed: 0.45 },
      ];

      for (const eye of eyeDefs) {
        const pulse = Math.sin(t * eye.speed + eye.phase) * 0.5 + 0.5;
        const eR = eye.r * (0.6 + pulse * 0.5);
        const eAlpha = 0.08 + pulse * 0.18;
        const ex = cCX + Math.floor(eye.offX * CORE_CS);
        const ey = cCY + Math.floor(eye.offY * CORE_CS);

        for (let dr = -Math.ceil(eR + 1); dr <= Math.ceil(eR + 1); dr++) {
          for (let dc = -Math.ceil(eR + 1); dc <= Math.ceil(eR + 1); dc++) {
            const d = Math.sqrt(dc * dc + dr * dr);
            if (d > eR + 0.8) continue;
            const closeness = 1 - d / (eR + 0.8);
            const a = closeness * closeness * eAlpha;
            if (a < 0.01) continue;
            const pal = d < eR * 0.3 ? P.eye : P.core;
            cells.push({
              x: ex + dc * CORE_CS,
              y: ey + dr * CORE_CS,
              ch: pickChar(pal, dc + Math.floor(t * 0.5), dr, Math.floor(t / 3)),
              a: Math.min(a, 0.70),
              fontSize: a > 0.1 ? "bold 14px" : "12px",
            });
          }
        }
      }

      // ── PHASE 3: TENDRILS ──
      for (const tr of tendrilsRef.current) {
        if (!tr.visible) continue;

        for (let i = 0; i < tr.segments.length; i++) {
          const seg = tr.segments[i];
          const progress = i / Math.max(tr.segments.length - 1, 1);

          // Snap to cell grid
          const gx = Math.floor(seg.pos.x / tr.cellSize) * tr.cellSize;
          const gy = Math.floor(seg.pos.y / tr.cellSize) * tr.cellSize;

          // Alpha: base * distance taper
          const distFade = 1 - progress;
          const a = tr.maxAlpha * Math.pow(distFade, 1.2);

          if (a < 0.002) continue;

          // Character changes slowly
          const charSeed = Math.floor(t / (1.5 + hsh(i, tr.noiseSeed, 0) * 3));
          const ch = pickChar(tr.palette, i, Math.floor(tr.noiseSeed), charSeed);

          cells.push({
            x: gx,
            y: gy,
            ch,
            a,
            fontSize: a > 0.08 ? "bold 13px" : a > 0.04 ? "12px" : "11px",
          });

          // Extra cell for thickness on mid-layer
          if (tr.layer === 2 && i % 3 === 0) {
            const perpAngle = Math.atan2(tr.segments[Math.min(i + 1, tr.segments.length - 1)].pos.y - seg.pos.y,
                                          tr.segments[Math.min(i + 1, tr.segments.length - 1)].pos.x - seg.pos.x) + Math.PI / 2;
            const thick = Math.sin(i * 0.4 + t * 0.15) * 0.4;
            const ox = Math.floor((seg.pos.x + Math.cos(perpAngle) * thick * tr.cellSize * 0.4) / tr.cellSize) * tr.cellSize;
            const oy = Math.floor((seg.pos.y + Math.sin(perpAngle) * thick * tr.cellSize * 0.4) / tr.cellSize) * tr.cellSize;
            const a2 = a * 0.4;
            if (a2 > 0.002) {
              cells.push({ x: ox, y: oy, ch: pickChar(tr.palette, i + 1, Math.floor(tr.noiseSeed), charSeed), a: a2, fontSize: "10px" });
            }
          }
        }
      }

      // ── PHASE 4: ICONS AT TERMINATIONS ──
      const iconGrid = iconsRef.current;
      for (const icon of iconGrid) {
        if (!icon.visible) continue;
        // Check if icon is visible on screen
        if (icon.screenPos.y < scrollY - 100 || icon.screenPos.y > scrollY + H + 100) continue;

        const screenY = icon.screenPos.y - scrollY;
        const gridData = ICONS[icon.key as keyof typeof ICONS];
        if (!gridData) continue;

        const cellW = 9;  // icon cell size
        const cellH = 12;
        const iconW = gridData[0]?.length || 0;
        const iconH = gridData.length;
        const iconX = icon.screenPos.x - (iconW * cellW) / 2;
        const iconY = screenY - (iconH * cellH) / 2;

        // Icon pulse
        const iconAlpha = 0.12 + Math.sin(t * 0.8 + hsh(icon.screenPos.x, icon.screenPos.y, 0)) * 0.08;

        // Slow character morphing
        icon.charTimer++;
        const morphTime = icon.charTimer % 120 < 60 ? 0 : 1;

        for (let r = 0; r < iconH; r++) {
          const line = gridData[r];
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === ' ' || ch === '│') continue; // skip background chars

            const cellAlpha = iconAlpha * (ch === '░' ? 0.6 : ch === '▓' ? 0.8 : 1.0);
            if (cellAlpha < 0.01) continue;

            // For icon cells with placeholders, use palette characters
            let renderCh = ch;
            if (ch === '░' || ch === '▓' || ch === '#') {
              renderCh = pickChar(P.core, c + morphTime * 10, r + morphTime * 10, Math.floor(t / 3));
            }

            cells.push({
              x: Math.floor((iconX + c * cellW) / cellW) * cellW,
              y: Math.floor((iconY + r * cellH) / cellH) * cellH,
              ch: renderCh,
              a: cellAlpha,
              fontSize: `bold ${cellH - 1}px`,
            });
          }
        }
      }

      // ── PHASE 5: AMBIENT PARTICLES ──
      for (const p of particlesRef.current) {
        const screenY = p.pos.y;
        if (screenY < scrollY - 50 || screenY > scrollY + H + 50) continue;

        const lifeFade = 1 - p.life / p.maxLife;
        const a = p.alpha * lifeFade;
        if (a < 0.003) continue;

        cells.push({
          x: Math.floor(p.pos.x / p.size) * p.size,
          y: Math.floor(screenY / p.size) * p.size,
          ch: p.ch,
          a,
          fontSize: `${Math.max(p.size - 2, 6)}px`,
        });
      }

      // ── PHASE 6: GHOST TENDRILS (very faint, very long) ──
      const ghostCount = 8;
      for (let gi = 0; gi < ghostCount; gi++) {
        const ghostAngle = (gi / ghostCount) * Math.PI * 2 - Math.PI * 0.5;
        const ghostLen = 800 + hsh(gi, 20, 0) * 400;
        const ghostSegs = 25;

        for (let s = 0; s < ghostSegs; s++) {
          const progress = s / ghostSegs;
          const d = progress * ghostLen;
          const wave = Math.sin(s * 0.3 + t * 0.06) * 5;
          const angle = ghostAngle + wave * 0.004;
          const gx = Math.floor((coreScreenX + Math.cos(angle) * d) / 28) * 28;
          const gy = Math.floor((coreScreenY + Math.sin(angle) * d) / 28) * 28;
          const screenYCheck = coreScreenY + Math.sin(angle) * d;
          if (screenYCheck < scrollY - 50 || screenYCheck > scrollY + H + 50) continue;
          const a = 0.012 * (1 - progress);
          if (a < 0.002) continue;

          cells.push({
            x: gx,
            y: gy,
            ch: pickChar(P.wisp, s + gi * 15, gi, Math.floor(t / 5)),
            a,
            fontSize: "10px",
          });
        }
      }

      // ═════════════════════════════════════════════
      //  RENDER ALL CELLS
      // ═════════════════════════════════════════════

      // Clear
      ctx.clearRect(0, 0, W, H);

      // Sort cells back-to-front by alpha for proper depth layering
      cells.sort((a, b) => a.a - b.a);

      // BATCH by font size to minimize ctx.font changes
      ctx.textBaseline = "top";
      let currentFont = "";
      let currentColor = "";

      for (let ci = 0; ci < cells.length; ci++) {
        const c = cells[ci];
        const hue = 38 + c.a * 10;
        const sat = 50 + c.a * 35;
        const light = 35 + c.a * 30;
        const color = `hsla(${hue}, ${sat}%, ${light}%, ${Math.min(c.a * 1.8, 0.65)})`;
        const font = `${c.fontSize} "IBM Plex Mono", monospace`;

        if (font !== currentFont) {
          ctx.font = font;
          currentFont = font;
        }
        if (color !== currentColor) {
          ctx.fillStyle = color;
          currentColor = color;
        }
        ctx.fillText(c.ch, c.x, c.y);
      }

      // Subtle radial glow behind core (very slow pulse)
      const glowR = coreRCells * CORE_CS * 2.5;
      const grad = ctx.createRadialGradient(coreScreenX, coreScreenY, 0, coreScreenX, coreScreenY, glowR);
      const glowA = 0.04 + Math.sin(t * 0.25) * 0.02;
      grad.addColorStop(0, `rgba(212, 160, 60, ${glowA})`);
      grad.addColorStop(0.5, `rgba(212, 160, 60, ${glowA * 0.4})`);
      grad.addColorStop(1, "rgba(212, 160, 60, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildTendrils, buildParticles, updateTargets]);

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
        zIndex: 1,
        imageRendering: "auto",
      }}
    />
  );
}
