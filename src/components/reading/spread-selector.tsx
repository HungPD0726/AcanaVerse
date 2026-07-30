"use client";

import { motion } from "motion/react";
import type { Locale, SpreadDefinition } from "@/domain/tarot";
import { spreads } from "@/data/spreads";

export function SpreadSelector({
  selectedSpreadSlug,
  onSelectSpread,
  locale,
}: {
  selectedSpreadSlug: string;
  onSelectSpread(spread: SpreadDefinition): void;
  locale: Locale;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {spreads.map((spread) => {
        const isSelected = spread.slug === selectedSpreadSlug;
        return (
          <motion.button
            key={spread.slug}
            type="button"
            onClick={() => onSelectSpread(spread)}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group relative flex flex-col justify-between rounded-panel border p-4 text-left transition-all ${
              isSelected
                ? "border-accent bg-accent-soft/30 shadow-md ring-1 ring-accent/50"
                : "border-line bg-surface hover:border-accent/40 hover:bg-soft/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-soft px-2.5 py-0.5 text-[0.65rem] font-semibold text-accent uppercase tracking-wider">
                  {spread.cardCount === 1
                    ? locale === "vi"
                      ? "1 lá"
                      : "1 Card"
                    : spread.cardCount === 3
                      ? locale === "vi"
                        ? "3 lá"
                        : "3 Cards"
                      : locale === "vi"
                        ? "10 lá"
                        : "10 Cards"}
                </span>
                {isSelected && (
                  <span className="text-xs font-semibold text-accent">✓</span>
                )}
              </div>
              <h4 className="mt-2.5 font-editorial text-lg font-medium text-ink">
                {spread.name[locale]}
              </h4>
              <p className="mt-1 text-xs leading-5 text-muted line-clamp-2">
                {spread.description[locale]}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
