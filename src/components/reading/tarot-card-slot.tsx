"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import type {
  DrawnCard,
  Locale,
  SpreadPosition,
  TarotCard,
} from "@/domain/tarot";

import { audioEngine } from "@/lib/audio-engine";

import { tarotDecksBySlug } from "@/data/decks";

export function TarotCardSlot({
  drawnCard,
  card,
  position,
  locale,
  canReveal,
  onReveal,
  compact = false,
  cardBackSrc = "/images/brand/card-back.webp",
}: {
  drawnCard: DrawnCard;
  card: TarotCard;
  position: SpreadPosition;
  locale: Locale;
  canReveal: boolean;
  onReveal(): void;
  compact?: boolean;
  cardBackSrc?: string;
}) {
  const t = useTranslations("Reading");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const activeDeckDef = Array.from(tarotDecksBySlug.values()).find(
    (d) => d.cardBackSrc === cardBackSrc,
  );
  const frontFilter = activeDeckDef?.frontImageFilter ?? "none";

  const handleCardClick = () => {
    if (canReveal && !drawnCard.isRevealed) {
      audioEngine.playFlipSound();
    }
    onReveal();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!drawnCard.isRevealed && !canReveal) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const orientationLabel =
    drawnCard.orientation === "upright" ? t("upright") : t("reversed");
  const accessibleName = drawnCard.isRevealed
    ? `${position.order}. ${position.label[locale]}: ${card.name[locale]}, ${orientationLabel}`
    : `${position.order}. ${position.label[locale]}. ${
        canReveal ? t("tapToReveal") : t("waitingToReveal")
      }`;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={!canReveal}
        aria-label={accessibleName}
        data-can-reveal={canReveal && !drawnCard.isRevealed}
        data-testid={`spread-card-${position.order}`}
        whileHover={canReveal || drawnCard.isRevealed ? { scale: 1.045 } : undefined}
        whileTap={canReveal ? { scale: 0.96 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
        className={`tarot-card-perspective group relative shrink-0 rounded-[0.55rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
          compact
            ? "h-[9rem] w-[5.25rem] sm:h-[10.5rem] sm:w-[6.15rem]"
            : "h-[16rem] w-[9.35rem] sm:h-[19rem] sm:w-[11.1rem]"
        }`}
      >
        <span
          className="tarot-card-inner block"
          data-revealed={drawnCard.isRevealed}
        >
          {/* Metallic shimmer sweep on card reveal */}
          <span className="tarot-shimmer-overlay" />

          {/* Card Back Face */}
          <span className="tarot-card-face border border-line bg-soft">
            <Image
              src={cardBackSrc}
              alt=""
              fill
              sizes={compact ? "110px" : "190px"}
              className="object-cover"
            />
          </span>

          {/* Card Front Face */}
          <span className="tarot-card-face tarot-card-front border border-line bg-surface">
            <span
              className="relative block size-full"
              style={{
                transform:
                  drawnCard.orientation === "reversed"
                    ? "rotate(180deg)"
                    : undefined,
              }}
            >
              <Image
                src={card.image.src}
                alt={card.image.alt[locale]}
                fill
                sizes={compact ? "110px" : "190px"}
                className="object-cover"
                style={{ filter: frontFilter }}
              />
            </span>
          </span>
        </span>
      </motion.button>
      <p className="max-w-32 text-center text-[0.68rem] leading-4 font-semibold uppercase tracking-[0.12em] text-muted">
        {position.order}. {position.label[locale]}
      </p>
    </div>
  );
}
