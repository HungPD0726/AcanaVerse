"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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

  return (
    <div
      className="border-y border-line bg-soft/35 py-5"
      data-testid="card-fan"
    >
      <p className="px-4 text-center text-xs leading-5 text-muted">
        {t("chooseFromFan")}
      </p>
      <div
        className="mt-4 overflow-x-auto overflow-y-hidden pb-4"
        role="region"
        aria-label={t("cardFanLabel")}
        tabIndex={0}
      >
        <div className="flex h-48 w-max min-w-full items-end justify-center px-12 pt-12 sm:h-56 sm:px-20">
          {shuffledCardIds.map((cardId, index) => {
            if (selectedCardIds.has(cardId)) return null;

            const normalized = total > 1 ? index / (total - 1) - 0.5 : 0;
            const curveY = Math.abs(normalized) * 22;
            const rotation = normalized * 12;

            return (
              <motion.button
                key={cardId}
                layoutId={`reading-card-${cardId}`}
                type="button"
                onClick={() => onSelect(cardId)}
                aria-label={t("facedownCard", { number: index + 1 })}
                whileHover={{ y: -18, rotate: 0, scale: 1.06 }}
                whileFocus={{ y: -12, rotate: 0 }}
                whileTap={{ y: -8, scale: 0.96 }}
                animate={{ y: curveY, rotate: rotation }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className="relative -ml-9 h-32 w-20 shrink-0 origin-bottom overflow-hidden rounded-[0.36rem] border border-line bg-surface first:ml-0 focus-visible:z-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:-ml-10 sm:h-40 sm:w-24"
                style={{ zIndex: index + 1 }}
              >
                <Image
                  src={cardBackSrc}
                  alt=""
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="96px"
                  className="pointer-events-none object-cover"
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
