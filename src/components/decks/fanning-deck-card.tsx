"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { Locale, TarotCard } from "@/domain/tarot";

interface FanningDeckCardProps {
  categoryTitle: string;
  countText: string;
  cards: TarotCard[];
  locale: Locale;
  onSelectCard: (card: TarotCard) => void;
  frontImageFilter?: string;
  frameOverlayClass?: string;
}

export function FanningDeckCard({
  categoryTitle,
  countText,
  cards,
  locale,
  onSelectCard,
  frontImageFilter = "none",
  frameOverlayClass = "",
}: FanningDeckCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Take up to 3 representative cards for the fan
  const displayCards = cards.slice(0, 3);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="moonlight-shadow group relative flex flex-col items-center justify-between rounded-[2rem] bg-[#f7f5f0] p-6 text-center transition-all hover:bg-surface dark:bg-[#161a26] sm:p-8"
    >
      {/* Category Header */}
      <div>
        <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-muted dark:border-white/20 dark:bg-white/10 dark:text-white/70">
          {countText}
        </span>
        <h3 className="mt-3 font-editorial text-2xl font-semibold text-ink sm:text-3xl">
          {categoryTitle}
        </h3>
      </div>

      {/* 3D Stack / Fanning Arena */}
      <div className="relative my-8 flex h-60 w-full items-center justify-center sm:h-64">
        {/* Soft Drop Shadow under cards */}
        <motion.div
          animate={{
            scaleX: isHovered ? 1.4 : 1,
            opacity: isHovered ? 0.25 : 0.4,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="absolute bottom-2 h-6 w-44 rounded-full bg-black/40 blur-md dark:bg-black/80"
        />

        {displayCards.map((card, idx) => {
          // Offsets for stacked vs fanned state
          const stackedTransforms = [
            { x: 4, y: 4, rotate: 3, scale: 0.94, zIndex: 1 },
            { x: 2, y: 2, rotate: 1.5, scale: 0.97, zIndex: 2 },
            { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 3 },
          ];

          const fannedTransforms = [
            { x: -54, y: -8, rotate: -16, scale: 1.02, zIndex: 1 },
            { x: 0, y: -18, rotate: 0, scale: 1.06, zIndex: 3 },
            { x: 54, y: -8, rotate: 16, scale: 1.02, zIndex: 2 },
          ];

          const target = isHovered
            ? fannedTransforms[idx]
            : stackedTransforms[idx];

          return (
            <motion.div
              key={card.id}
              onClick={() => onSelectCard(card)}
              animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotate,
                scale: target.scale,
                zIndex: target.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: idx * 0.03,
              }}
              className={`absolute h-48 w-32 cursor-pointer overflow-hidden rounded-xl border-2 border-black bg-surface shadow-[4px_4px_0px_0px_#000] sm:h-52 sm:w-34 ${frameOverlayClass}`}
            >
              <Image
                src={card.image.src}
                alt={card.name[locale]}
                fill
                sizes="150px"
                className="object-cover transition-transform duration-300 group-hover:brightness-105"
                style={{ filter: frontImageFilter }}
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-black/20 bg-surface/90 px-2 py-1 text-center font-editorial text-[0.68rem] font-bold text-ink backdrop-blur-sm line-clamp-1">
                {card.name[locale]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hover Instruction */}
      <p className="text-xs font-semibold text-muted transition-colors group-hover:text-accent">
        {isHovered
          ? locale === "vi"
            ? "✨ Click để xem chi tiết"
            : "✨ Click to inspect"
          : locale === "vi"
            ? "Rê chuột để xòe bài"
            : "Hover to fan cards"}
      </p>
    </div>
  );
}
