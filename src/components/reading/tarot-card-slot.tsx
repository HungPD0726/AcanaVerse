"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  defaultDeck,
  getDeckCardImageSrc,
  tarotDecksBySlug,
} from "@/data/decks";
import type {
  DrawnCard,
  Locale,
  SpreadPosition,
  TarotCard,
} from "@/domain/tarot";
import { audioEngine } from "@/lib/audio-engine";

export function TarotCardSlot({
  drawnCard,
  card,
  position,
  locale,
  canReveal,
  onReveal,
  onActivate,
  isActive = false,
  compact = false,
  cardBackSrc = "/images/brand/card-back.webp",
}: {
  drawnCard: DrawnCard;
  card: TarotCard;
  position: SpreadPosition;
  locale: Locale;
  canReveal: boolean;
  onReveal(): void;
  onActivate(): void;
  isActive?: boolean;
  compact?: boolean;
  cardBackSrc?: string;
}) {
  const t = useTranslations("Reading");
  const activeDeckDef = Array.from(tarotDecksBySlug.values()).find(
    (deck) => deck.cardBackSrc === cardBackSrc,
  );
  const cardFaceSrc = getDeckCardImageSrc(
    activeDeckDef ?? defaultDeck,
    card,
  );

  const handleCardClick = () => {
    if (!drawnCard.isRevealed && canReveal) {
      audioEngine.playFlipSound();
      onReveal();
      return;
    }

    if (drawnCard.isRevealed) {
      onActivate();
    }
  };

  const orientationLabel =
    drawnCard.orientation === "upright" ? t("upright") : t("reversed");
  const accessibleName = drawnCard.isRevealed
    ? `${position.order}. ${position.label[locale]}: ${card.name[locale]}, ${orientationLabel}. ${t("reviewCard")}`
    : `${position.order}. ${position.label[locale]}. ${
        canReveal ? t("tapToReveal") : t("waitingToReveal")
      }`;
  const isInteractive = canReveal || drawnCard.isRevealed;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={handleCardClick}
        disabled={!isInteractive}
        aria-label={accessibleName}
        aria-pressed={drawnCard.isRevealed ? isActive : undefined}
        data-can-reveal={canReveal && !drawnCard.isRevealed}
        data-active={isActive}
        data-testid={`spread-card-${position.order}`}
        whileHover={isInteractive ? { y: -3, scale: 1.015 } : undefined}
        whileTap={isInteractive ? { scale: 0.985 } : undefined}
        className={`tarot-card-perspective group relative shrink-0 rounded-[0.55rem] transition-shadow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
          isActive ? "ring-2 ring-accent ring-offset-2 ring-offset-canvas" : ""
        } ${
          compact
            ? "h-[8.5rem] w-[5rem] sm:h-[9.5rem] sm:w-[5.6rem]"
            : "h-[13rem] w-[7.6rem] sm:h-[16rem] sm:w-[9.35rem]"
        }`}
      >
        <span
          className="tarot-card-inner block"
          data-revealed={drawnCard.isRevealed}
        >
          <span className="tarot-card-face border border-line bg-soft">
            <Image
              src={cardBackSrc}
              alt=""
              fill
              loading="eager"
              sizes={compact ? "90px" : "160px"}
              className="object-cover"
            />
          </span>

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
                src={cardFaceSrc}
                alt={drawnCard.isRevealed ? card.image.alt[locale] : ""}
                fill
                sizes={compact ? "90px" : "160px"}
                className="object-cover"
              />
            </span>
          </span>
        </span>
      </motion.button>
      <p className="max-w-32 text-center text-[0.65rem] font-semibold uppercase leading-4 tracking-[0.1em] text-muted">
        {String(position.order).padStart(2, "0")} · {position.label[locale]}
      </p>
    </div>
  );
}
