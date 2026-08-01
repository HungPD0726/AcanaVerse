"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { TarotCardSlot } from "@/components/reading/tarot-card-slot";
import { tarotCardsById } from "@/data/cards";
import type {
  DrawnCard,
  Locale,
  SpreadDefinition,
  SpreadPosition,
} from "@/domain/tarot";

interface SpreadTableauProps {
  spread: SpreadDefinition;
  drawnCards: DrawnCard[];
  locale: Locale;
  allowReveal: boolean;
  onReveal(index: number): void;
  onActivate?(index: number): void;
  activeIndex?: number;
  cardBackSrc?: string;
}

export function SpreadTableau({
  spread,
  drawnCards,
  locale,
  allowReveal,
  onReveal,
  onActivate,
  activeIndex,
  cardBackSrc,
}: SpreadTableauProps) {
  const t = useTranslations("Reading");
  const nextIndex = drawnCards.findIndex((card) => !card.isRevealed);
  const isCeltic = spread.slug === "celtic-cross";

  const renderPosition = (
    position: SpreadPosition,
    index: number,
    compact: boolean,
  ) => {
    const drawnCard = drawnCards[index];
    const card = drawnCard ? tarotCardsById.get(drawnCard.cardId) : undefined;

    if (!drawnCard || !card) {
      return (
        <div
          className={`flex flex-col items-center justify-center rounded-[0.5rem] border border-dashed border-accent/50 bg-accent-soft/20 p-3 text-center ${
            compact
              ? "h-[8.5rem] w-[5rem] sm:h-[9.5rem] sm:w-[5.6rem]"
              : "h-[13rem] w-[7.6rem] sm:h-[16rem] sm:w-[9.35rem]"
          }`}
        >
          <span className="text-xs font-semibold tracking-[0.12em] text-accent">
            {String(position.order).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[0.68rem] font-medium leading-4 text-muted">
            {position.label[locale]}
          </span>
        </div>
      );
    }

    return (
      <motion.div
        layoutId={`reading-card-${drawnCard.cardId}`}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <TarotCardSlot
          drawnCard={drawnCard}
          card={card}
          position={position}
          locale={locale}
          canReveal={allowReveal && index === nextIndex}
          onReveal={() => onReveal(index)}
          onActivate={() => onActivate?.(index)}
          isActive={activeIndex === index}
          cardBackSrc={cardBackSrc}
          compact={compact}
        />
      </motion.div>
    );
  };

  if (isCeltic) {
    return (
      <div>
        <p className="mb-3 text-xs text-muted lg:hidden">
          {t("mobileCanvasHint")}
        </p>
        <div
          className="overflow-x-auto rounded-panel border border-line bg-soft/35"
          tabIndex={0}
          role="region"
          aria-label={spread.name[locale]}
        >
          <div className="relative h-[39rem] min-w-[43rem]">
            {spread.positions.map((position, index) => (
              <div
                key={position.key}
                className="absolute"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  zIndex: position.order === 2 ? 12 : position.order,
                  transform: `translate(-50%, -50%) rotate(${position.angle ?? 0}deg)`,
                }}
              >
                {renderPosition(position, index, true)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 lg:hidden">
          <h3 className="text-sm font-semibold text-ink">
            {t("selectedPositions")}
          </h3>
          <ol className="mt-3 grid gap-x-6 sm:grid-cols-2">
            {spread.positions.map((position) => (
              <li
                key={position.key}
                className="flex gap-3 border-t border-line py-3 text-sm"
              >
                <span className="font-semibold tabular-nums text-accent">
                  {String(position.order).padStart(2, "0")}
                </span>
                <span className="text-ink">{position.label[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start justify-center gap-4 sm:gap-7 ${
        spread.cardCount > 1 ? "overflow-x-auto py-4" : "py-3"
      }`}
    >
      {spread.positions.map((position, index) => (
        <div key={position.key}>
          {renderPosition(position, index, false)}
        </div>
      ))}
    </div>
  );
}
