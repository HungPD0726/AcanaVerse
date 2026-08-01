"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { SpreadMark } from "@/components/spread-mark";
import { spreads } from "@/data/spreads";
import type { Locale, SpreadDefinition } from "@/domain/tarot";

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
    <div className="grid gap-3 md:grid-cols-3">
      {spreads.map((spread, index) => {
        const isSelected = spread.slug === selectedSpreadSlug;

        return (
          <motion.button
            key={spread.slug}
            type="button"
            onClick={() => onSelectSpread(spread)}
            aria-pressed={isSelected}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            className={`group relative flex min-h-52 flex-col justify-between rounded-panel border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              isSelected
                ? "border-accent bg-accent-soft/60"
                : "border-line bg-surface hover:border-accent"
            }`}
          >
            <div className="flex items-start justify-between gap-3 text-accent">
              <span className="text-[0.68rem] font-semibold tracking-[0.18em]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {isSelected ? (
                <CheckCircleIcon size={19} weight="fill" aria-hidden />
              ) : (
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  <SpreadMark spread={spread} compact />
                </div>
              )}
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
                {spread.cardCount} {locale === "vi" ? "lá" : "cards"}
              </p>
              <h3 className="mt-2 font-editorial text-2xl font-medium leading-tight text-ink">
                {spread.name[locale]}
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted">
                {spread.description[locale]}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
