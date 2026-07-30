"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

interface DeckStackProps {
  cardBackSrc: string;
  onShuffle: () => void;
  label: string;
  sublabel: string;
}

export function DeckStack({ cardBackSrc, onShuffle, label, sublabel }: DeckStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── 3D tilt tracking ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-22, 22]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) / (rect.width / 2));
    rawY.set((e.clientY - cy) / (rect.height / 2));
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  /* ── stacked cards (back faces offset) ── */
  const stackLayers = [
    { x: 4, y: 4, rotate: 2, scale: 0.94, zIndex: 0, opacity: 0.55 },
    { x: 2, y: 2, rotate: 1, scale: 0.97, zIndex: 1, opacity: 0.75 },
    { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 2, opacity: 1 },
  ];

  return (
    <div className="flex flex-col items-center gap-10">
      {/* 3D Deck */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer select-none"
        style={{ perspective: "900px" }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-64 w-44 sm:h-72 sm:w-48"
        >
          {stackLayers.map((layer, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 overflow-hidden rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_#000]"
              style={{
                x: layer.x,
                y: layer.y,
                rotate: layer.rotate,
                scale: layer.scale,
                zIndex: layer.zIndex,
                opacity: layer.opacity,
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={cardBackSrc}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
                priority={i === 2}
              />
              {/* Top-face highlight */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background: useTransform(
                    [rotateX, rotateY],
                    ([rx, ry]) =>
                      `radial-gradient(ellipse at ${50 + (ry as number) * 25}% ${50 - (rx as number) * 25}%, rgba(255,255,255,0.22) 0%, transparent 70%)`,
                  ),
                }}
              />
            </motion.div>
          ))}

          {/* Specular shine layer on top card */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 rounded-xl"
            style={{
              background: useTransform(
                [rotateX, rotateY],
                ([rx, ry]) =>
                  `radial-gradient(ellipse at ${50 + (ry as number) * 30}% ${50 - (rx as number) * 30}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
              ),
            }}
          />
        </motion.div>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="font-editorial text-xl text-ink sm:text-2xl">{label}</p>
        <p className="mt-1.5 text-sm text-muted">{sublabel}</p>
      </div>

      {/* CTA button */}
      <motion.button
        type="button"
        onClick={onShuffle}
        className="moonlight-button inline-flex min-h-14 items-center gap-3 rounded-full bg-[#e2c6ff] px-8 text-sm font-bold text-black"
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">🔀</span>
        {label}
      </motion.button>
    </div>
  );
}
