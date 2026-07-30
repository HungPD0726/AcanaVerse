"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Locale, TarotDeckDefinition } from "@/domain/tarot";
import { tarotDecks } from "@/data/decks";

export function DeckSelector({
  selectedDeckSlug,
  onSelectDeck,
  locale,
}: {
  selectedDeckSlug: string;
  onSelectDeck(deckSlug: string): void;
  locale: Locale;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tarotDecks.map((deck) => {
        const isSelected = deck.slug === selectedDeckSlug;
        return (
          <motion.button
            key={deck.slug}
            type="button"
            onClick={() => onSelectDeck(deck.slug)}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group relative flex flex-col items-center rounded-panel border p-4 text-left transition-all ${
              isSelected
                ? "border-accent bg-accent-soft/30 shadow-lg ring-1 ring-accent/50"
                : "border-line bg-surface hover:border-accent/40 hover:bg-soft/40"
            }`}
          >
            {/* Selected Indicator Pill */}
            {isSelected && (
              <span className="absolute top-3 right-3 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-surface">
                ✓
              </span>
            )}

            {/* Deck Card Back Preview Container */}
            <div className="relative mb-3.5 h-36 w-22 overflow-hidden rounded-[0.45rem] border border-line shadow-md group-hover:shadow-lg sm:h-40 sm:w-24">
              <Image
                src={deck.cardBackSrc}
                alt={deck.name[locale]}
                fill
                sizes="100px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Badge */}
            {deck.badgeText && (
              <span className="mb-1 text-[0.65rem] font-semibold tracking-wider text-accent uppercase">
                {deck.badgeText[locale]}
              </span>
            )}

            {/* Deck Name */}
            <h4 className="text-center font-editorial text-base font-medium text-ink">
              {deck.name[locale]}
            </h4>

            {/* Description */}
            <p className="mt-1 text-center text-xs text-muted line-clamp-2">
              {deck.description[locale]}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
