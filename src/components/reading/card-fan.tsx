"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

export function CardFan({
  shuffledCardIds,
  selectedCardIds,
  onSelect,
  cardBackSrc = "/images/brand/card-back.webp",
}: {
  shuffledCardIds: string[];
  selectedCardIds: Set<string>;
  onSelect(cardId: string): void;
  cardBackSrc?: string;
}) {
  const t = useTranslations("Reading");
  const total = shuffledCardIds.length;
  const mid = (total - 1) / 2;

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("text/plain", cardId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="relative flex min-h-[16rem] w-full flex-col items-center justify-center overflow-x-auto rounded-panel border border-line bg-soft/40 py-10 sm:min-h-[19rem]"
      data-testid="card-fan"
    >
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        ✨ {t("dragOrTapHint")}
      </p>

      <div className="relative flex h-36 w-full max-w-4xl items-end justify-center px-4 sm:h-44">
        {shuffledCardIds.map((cardId, index) => {
          const isSelected = selectedCardIds.has(cardId);
          // Calculate curved arc fan rotation and lift
          const normalizedIndex = index - mid;
          const rotateAngle = (normalizedIndex / mid) * 48; // -48deg to +48deg arc
          const liftY = Math.abs(normalizedIndex / mid) ** 2 * 32; // parabolic Y arc drop
          const offsetRight = -14; // card overlap in px

          return (
            <motion.button
              key={cardId}
              type="button"
              disabled={isSelected}
              draggable={!isSelected}
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, cardId)}
              onClick={() => onSelect(cardId)}
              aria-label={t("facedownCard", { number: index + 1 })}
              aria-pressed={isSelected}
              whileHover={
                !isSelected
                  ? {
                      translateY: liftY - 24,
                      scale: 1.12,
                      rotate: rotateAngle,
                      zIndex: 50,
                    }
                  : undefined
              }
              whileTap={
                !isSelected ? { scale: 0.92, translateY: liftY + 12 } : undefined
              }
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative h-31 w-18 shrink-0 rounded-[0.45rem] border border-line bg-soft shadow-md focus-visible:z-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:opacity-15 sm:h-38 sm:w-22"
              style={{
                marginRight: `${offsetRight}px`,
                transformOrigin: "bottom center",
                transform: isSelected
                  ? `translateY(${liftY + 30}px) scale(0.85)`
                  : `translateY(${liftY}px) rotate(${rotateAngle}deg)`,
                zIndex: isSelected ? 0 : index,
              }}
            >
              <span className="relative block size-full overflow-hidden rounded-[0.35rem]">
                <Image
                  src={cardBackSrc}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-cover pointer-events-none"
                />
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
