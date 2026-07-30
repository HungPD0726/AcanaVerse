"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { tarotCardsById } from "@/data/cards";
import type {
  DrawnCard,
  Locale,
  SpreadDefinition,
} from "@/domain/tarot";
import { TarotCardSlot } from "@/components/reading/tarot-card-slot";

export function SpreadTableau({
  spread,
  drawnCards,
  locale,
  allowReveal,
  onReveal,
  onDropCard,
  cardBackSrc,
}: {
  spread: SpreadDefinition;
  drawnCards: DrawnCard[];
  locale: Locale;
  allowReveal: boolean;
  onReveal(index?: number): void;
  onDropCard?(cardId: string): void;
  cardBackSrc?: string;
}) {
  const t = useTranslations("Reading");
  const nextIndex = drawnCards.findIndex((card) => !card.isRevealed);
  const isCeltic = spread.slug === "celtic-cross";

  if (isCeltic) {
    return (
      <div>
        <p className="mb-3 text-xs text-muted lg:hidden">
          {t("mobileCanvasHint")}
        </p>
        <div
          className="overflow-x-auto rounded-panel border border-line bg-soft/60"
          tabIndex={0}
          aria-label={spread.name[locale]}
        >
          <div className="relative h-[47rem] min-w-[50rem]">
            {spread.positions.map((position, index) => {
              const drawnCard = drawnCards[index];
              const card = drawnCard
                ? tarotCardsById.get(drawnCard.cardId)
                : undefined;

              return (
                <div
                  key={position.key}
                  className="absolute"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    zIndex: position.order === 2 ? 12 : position.order,
                    transform: `translate(-50%, -50%) rotate(${position.angle ?? 0}deg)`,
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const cardId = e.dataTransfer.getData("text/plain");
                    if (cardId && onDropCard) {
                      onDropCard(cardId);
                    }
                  }}
                >
                  {drawnCard && card ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.75, y: -25 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      }}
                    >
                      <TarotCardSlot
                        drawnCard={drawnCard}
                        card={card}
                        position={position}
                        locale={locale}
                        canReveal={allowReveal && (nextIndex === -1 || index === nextIndex)}
                        onReveal={() => onReveal(index)}
                        cardBackSrc={cardBackSrc}
                        compact
                      />
                    </motion.div>
                  ) : (
                    <div className="tarot-dashed-slot flex h-[9rem] w-[5.25rem] flex-col items-center justify-center p-2 text-center sm:h-[10.5rem] sm:w-[6.15rem]">
                      <span className="text-xs font-bold text-accent">
                        {String(position.order).padStart(2, "0")}
                      </span>
                      <span className="mt-1 text-[0.65rem] leading-tight font-medium text-muted line-clamp-2">
                        {position.label[locale]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 lg:hidden">
          <h3 className="text-sm font-semibold text-ink">
            {t("selectedPositions")}
          </h3>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {spread.positions.map((position) => (
              <li
                key={position.key}
                className="flex gap-3 border-t border-line py-3 text-sm"
              >
                <span className="font-semibold text-accent">
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
      {spread.positions.map((position, index) => {
        const drawnCard = drawnCards[index];
        const card = drawnCard
          ? tarotCardsById.get(drawnCard.cardId)
          : undefined;

        return (
          <div
            key={position.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const cardId = e.dataTransfer.getData("text/plain");
              if (cardId && onDropCard) {
                onDropCard(cardId);
              }
            }}
          >
            {drawnCard && card ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
              >
                <TarotCardSlot
                  drawnCard={drawnCard}
                  card={card}
                  position={position}
                  locale={locale}
                  canReveal={allowReveal && (nextIndex === -1 || index === nextIndex)}
                  onReveal={() => onReveal(index)}
                  cardBackSrc={cardBackSrc}
                />
              </motion.div>
            ) : (
              <div className="tarot-dashed-slot flex h-[16rem] w-[9.35rem] flex-col items-center justify-center p-4 text-center sm:h-[19rem] sm:w-[11.1rem]">
                <span className="text-sm font-bold text-accent">
                  0{position.order}
                </span>
                <span className="mt-2 text-xs font-semibold text-ink">
                  {position.label[locale]}
                </span>
                <span className="mt-3 rounded-full bg-accent-soft px-2.5 py-1 text-[0.65rem] font-semibold text-accent">
                  {t("dropCardHere")}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
