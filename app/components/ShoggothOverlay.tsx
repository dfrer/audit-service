"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Eldritch character palettes
const CORE_CHARS = "$@B%8&WM#*ᚠᚢᚦΩΣΘΨ∞≈≠∂∇⍟⎈▓█░ᛁᛃᛈᛇ⍎⍕╳";
const MID_CHARS = "oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,.^'≈≠∂∇∫∮⍉⍓ᛏᛒᛖᛗᛚ";
const TENDRIL_CHARS = "│─╱╲·:;⟶⟷⟹⟸↗↘↙↖ᚱᚳᚷᚹᚻᛁ⟵⟺┌┐└┘├┤┬┴┼∞≈∂";
const SPARSE_CHARS = "·:;,.^'ᚦΨΘ∂⎈";

interface Point {
  x: number;
  y: number;
}

interface Tendril {
  angle: number;       // base angle from core
  length: number;      // max length in cells
  thickness: number;   // 1-2 cells wide
  chars: string[];     // characters along the path
  wave: number;        // wave frequency
  phase: number;       // phase offset for animation
  target?: Point;      // optional mouse target
}

interface Props {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ShoggothOverlay({ containerRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: -1000, y: -1000 });
  const [scrollY, setScrollY] = useState(0);
  const [corePos, setCorePos] = useState<Point>({ x: 0.75, y: 0.15 }); // Normalized position in viewport
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const tendrilsRef = useRef<Tendril[]>([]);
  const containerRefLocal = useRef<HTMLDivElement>(null);

  // Initialize tendrils
  const initTendrils = useCallback((): Tendril[] => {
    const baseAngles = [
      -2.8, -2.4, -1.9, -1.4, -0.8,  // Upper-left reach
      -0.3, 0.2, 0.7,                 // Left toward text
      1.2, 1.6, 2.0,                  // Down-left, under text
      2.5, 2.9, 3.2,                  // Downward
      0.0, 0.4, -0.5,                 // Rightward
    ];

    return baseAngles.map((angle, i) => ({
      angle,
      length: 15 + Math.random() * 25,
      thickness: i < 4 ? 2 : 1,
      chars: [],
      wave: 0.15 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    tendrilsRef.current = initTendrils();
  }, [initTendrils]);

  // Track mouse
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;

    const resize = () => {
      const container = containerRefLocal.current;
      if (!container) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(containerRefLocal.current!);

    const pickChar = (palette: string, t: number, x: number, y: number): string => {
      const idx = Math.floor(
        (Math.sin(x * 0.1 + y * 0.13 + t * 0.5) * 0.5 + 0.5) * palette.length
      ) % palette.length;
      return palette[Math.max(0, Math.min(idx, palette.length - 1))];
    };

    const render = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      timeRef.current += dt;
      const t = timeRef.current;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Scroll fade: 1.0 at top, 0.0 at 600px scroll
      const scrollFade = Math.max(0, 1 - scrollY / 600);
      if (scrollFade < 0.01) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const cellSize = 14;
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);

      // Core position in canvas coords
      const coreX = w * corePos.x;
      const coreY = h * corePos.y;

      // Mouse influence on core (subtle drift toward cursor)
      const mouseInfluence = 0.0003;
      const driftX = (mousePos.x - coreX) * mouseInfluence;
      const driftY = (mousePos.y - coreY) * mouseInfluence;

      const actualCoreX = coreX + driftX * 20;
      const actualCoreY = coreY + driftY * 20;

      // Check if mouse is near any tendrils
      const mouseNearCore = Math.hypot(mousePos.x - actualCoreX, mousePos.y - actualCoreY) < 200;

      ctx.font = `${cellSize}px "IBM Plex Mono", monospace`;
      ctx.textBaseline = "top";

      type CellData = { x: number; y: number; char: string; alpha: number };
      const cells: CellData[] = [];

      // Render core blob
      const coreRadius = 6 + Math.sin(t * 0.8) * 1.5 + (mouseNearCore ? 2 : 0);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * cellSize;
          const cy = row * cellSize;
          const dx = cx - actualCoreX;
          const dy = cy - actualCoreY;
          const dist = Math.sqrt(dx * dx + dy * dy) / cellSize;

          if (dist < coreRadius) {
            // Core: dense eldritch characters
            const density = 1 - dist / coreRadius;
            const noise = Math.sin(col * 3.7 + row * 2.3 + t * 1.2) * 0.5 + 0.5;
            const wobble = Math.sin(t * 0.5 + col * 0.3 + row * 0.2) * 0.5;
            const finalDist = dist + wobble;
            const alpha = Math.pow(density, 1.5) * scrollFade * 0.7 * (0.6 + noise * 0.4);

            let char: string;
            if (dist < 2) {
              char = pickChar(CORE_CHARS, t, col, row);
            } else if (dist < coreRadius * 0.7) {
              char = pickChar(MID_CHARS, t, col, row);
            } else {
              char = pickChar(TENDRIL_CHARS, t, col, row);
            }

            cells.push({
              x: cx,
              y: cy,
              char,
              alpha: Math.max(0, alpha * scrollFade),
            });
          }
        }
      }

      // Render tendrils
      const tendrils = tendrilsRef.current;
      for (const tendril of tendrils) {
        const numPoints = Math.floor(tendril.length * scrollFade);
        if (numPoints < 2) continue;

        const currentLength = tendril.length * scrollFade;
        const currentAngle = tendril.angle + Math.sin(t * tendril.wave + tendril.phase) * 0.3;

        // Mouse attraction: if mouse is in this tendril's direction, pull toward it
        let targetAngle = currentAngle;
        let targetLength = currentLength;
        const dx = mousePos.x - actualCoreX;
        const dy = mousePos.y - actualCoreY;
        const mouseDist = Math.hypot(dx, dy);
        if (mouseDist > 10 && mouseDist < 500) {
          const mouseAngle = Math.atan2(dy, dx);
          const angleDiff = mouseAngle - tendril.angle;
          const normalizedDiff = ((angleDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
          if (Math.abs(normalizedDiff) < 0.8) {
            targetAngle = tendril.angle + normalizedDiff * 0.3 * scrollFade;
            targetLength = currentLength * (1 + 0.5 * scrollFade);
          }
        }

        for (let i = 0; i < numPoints; i++) {
          const progress = i / numPoints;
          const waveOffset = Math.sin(i * 0.3 + t * tendril.wave * 3 + tendril.phase) * 2 * (1 - progress * 0.5);

          const angle = targetAngle + waveOffset * 0.05;
          const radius = progress * targetLength * cellSize;

          const px = actualCoreX + Math.cos(angle) * radius;
          const py = actualCoreY + Math.sin(angle) * radius;

          // Snap to grid
          const gridX = Math.round(px / cellSize) * cellSize;
          const gridY = Math.round(py / cellSize) * cellSize;

          // Skip if too close to core (already rendered)
          const distToCore = Math.hypot(gridX - actualCoreX, gridY - actualCoreY) / cellSize;
          if (distToCore < coreRadius - 1) continue;

          const fade = Math.pow(1 - progress, 2);
          const alpha = fade * 0.35 * scrollFade;

          if (alpha < 0.01) continue;

          // Character selection based on position in tendril
          let palette: string;
          if (progress < 0.2) {
            palette = TENDRIL_CHARS;
          } else if (progress < 0.6) {
            palette = TENDRIL_CHARS + SPARSE_CHARS;
          } else {
            palette = SPARSE_CHARS;
          }

          const char = pickChar(palette, t, Math.round(px / cellSize), Math.round(py / cellSize));

          cells.push({
            x: gridX,
            y: gridY,
            char,
            alpha: Math.max(0, alpha),
          });
        }
      }

      // Sort by alpha for proper blending
      cells.sort((a, b) => a.alpha - b.alpha);

      // Draw all cells
      for (const cell of cells) {
        const hue = 40 + cell.alpha * 15;
        const sat = 60 + cell.alpha * 20;
        const light = 45 + cell.alpha * 20;
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${Math.min(cell.alpha, 0.85)})`;
        ctx.fillText(cell.char, cell.x, cell.y);
      }

      // Add subtle glow at core
      const gradient = ctx.createRadialGradient(actualCoreX, actualCoreY, 0, actualCoreX, actualCoreY, coreRadius * cellSize * 1.5);
      gradient.addColorStop(0, `rgba(212, 160, 60, ${0.03 * scrollFade})`);
      gradient.addColorStop(1, "rgba(212, 160, 60, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [mousePos, scrollY, corePos]);

  return (
    <div
      ref={containerRefLocal}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
