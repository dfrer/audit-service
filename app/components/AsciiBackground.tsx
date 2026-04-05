"use client";

import { useEffect, useRef, useCallback } from "react";

// ASCII character palettes
const PALETTES = {
  dense:  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  medium: "@%#*+=-:. ",
  data:   "01",
  sparse: "·:─│┌┐└┘├┤┬┴┼",
};

interface AsciiLayer {
  chars: string;
  cellSize: number;
  opacity: number;
  speed: number;
  hue: number;
  saturation: number;
  lightness: number;
  effect: "rain" | "wave" | "scan" | "pulse";
  yOffset: number;
}

interface Props {
  opacity?: number;       // overall background opacity (0-1) -- keep very low
  zIndex?: number;
  className?: string;
  disabled?: boolean;
}

export default function AsciiBackground({ opacity = 1, zIndex = 0, className, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  const layers: AsciiLayer[] = [
    {
      chars: PALETTES.dense,
      cellSize: 14,
      opacity: 0.012,
      speed: 0.3,
      hue: 38, saturation: 70, lightness: 50,
      effect: "rain",
      yOffset: 0,
    },
    {
      chars: PALETTES.medium,
      cellSize: 20,
      opacity: 0.018,
      speed: 0.6,
      hue: 42, saturation: 60, lightness: 55,
      effect: "wave",
      yOffset: 0,
    },
    {
      chars: PALETTES.data,
      cellSize: 10,
      opacity: 0.006,
      speed: 1.2,
      hue: 35, saturation: 50, lightness: 45,
      effect: "scan",
      yOffset: 0,
    },
    {
      chars: PALETTES.sparse,
      cellSize: 28,
      opacity: 0.008,
      speed: 0.15,
      hue: 40, saturation: 40, lightness: 35,
      effect: "pulse",
      yOffset: 0,
    },
  ];

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let lastTime = 0;
    let prevTimeRef: { current: number } | null = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Simple hash for pseudo-random per grid cell
    function hash(x: number, y: number, t: number): number {
      const n = Math.sin(x * 127.1 + y * 311.7 + t * 43758.5453) * 43758.5453;
      return n - Math.floor(n);
    }

    function hashInt(x: number, y: number, seed: number): number {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453;
      return Math.floor((n - Math.floor(n)) * 1000) % 1000;
    }

    const render = (timestamp: number) => {
      if (prevTimeRef === null) prevTimeRef = { current: timestamp };
      const dt = Math.min((timestamp - prevTimeRef.current) / 1000, 0.1);
      prevTimeRef.current = timestamp;
      timeRef.current += dt;
      const t = timeRef.current;

      const w = canvas.width;
      const h = canvas.height;

      // Clear with very dark background
      ctx.clearRect(0, 0, w, h);

      // Draw each layer
      for (const layer of layers) {
        const cols = Math.ceil(w / layer.cellSize) + 1;
        const rows = Math.ceil(h / layer.cellSize) + 1;
        const charLen = layer.chars.length;

        ctx.font = `${Math.max(layer.cellSize - 3, 6)}px "IBM Plex Mono", monospace`;
        ctx.textBaseline = "top";

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * layer.cellSize;
            const y = row * layer.cellSize;
            const speed = layer.speed;
            let charIdx = 0;
            let alpha = layer.opacity;

            switch (layer.effect) {
              case "rain": {
                const fallSpeed = speed * 1.5;
                const offset = (t * 50 * fallSpeed) % (h + layer.cellSize * 10);
                const adjustedY = ((y + offset) % h);
                const hashVal = hash(col, hashInt(col, row, 42), 0);
                const brightness = Math.max(0, 1 - adjustedY / h) * hashVal;
                if (brightness < 0.15) continue;
                charIdx = Math.floor(hash(col, row, Math.floor(t * speed * 3)) * charLen);
                alpha = brightness * layer.opacity * 2;
                break;
              }
              case "wave": {
                const wave = Math.sin(col * 0.15 + t * speed * 2) * Math.cos(row * 0.1 - t * speed);
                const brightness = (wave + 1) / 2;
                if (brightness < 0.4) continue;
                charIdx = Math.floor((Math.sin(col * 0.3 + t) * 0.5 + 0.5) * charLen) % charLen;
                alpha = brightness * layer.opacity * 1.2;
                break;
              }
              case "scan": {
                const scanLine = (t * speed * 80) % (h + 60);
                const dist = Math.abs(y - scanLine);
                const brightness = Math.max(0, 1 - dist / 80);
                charIdx = hashInt(col, row, Math.floor(t * 10)) % charLen;
                alpha = Math.pow(brightness, 2) * layer.opacity * 4;
                break;
              }
              case "pulse": {
                const cx = w / 2;
                const cy = h / 2;
                const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                const pulse = Math.sin(dist * 0.008 - t * speed * 3) * 0.5 + 0.5;
                if (pulse < 0.5) continue;
                charIdx = Math.floor((hash(col, row, 0) * charLen + t * speed * 5) % charLen);
                alpha = pulse * layer.opacity * 1.5;
                break;
              }
            }

            if (alpha < 0.003) continue;

            const char = layer.chars[Math.min(charIdx, charLen - 1)];
            ctx.fillStyle = `hsla(${layer.hue}, ${layer.saturation}%, ${layer.lightness}%, ${alpha * opacity})`;
            ctx.fillText(char, x, y + layer.yOffset);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [opacity, disabled]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
        pointerEvents: "none",
      }}
    />
  );
}
