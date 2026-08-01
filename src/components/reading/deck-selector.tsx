"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { tarotCardsById } from "@/data/cards";
import { getDeckCardImageSrc, tarotDecks } from "@/data/decks";
import type { Locale } from "@/domain/tarot";

const previewCard = tarotCardsById.get("rws-the-sun");

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
    <div className="grid gap-2 sm:grid-cols-3">
      {tarotDecks.map((deck) => {
        const isSelected = deck.slug === selectedDeckSlug;
        const previewSrc = previewCard
          ? getDeckCardImageSrc(deck, previewCard)
          : deck.cardBackSrc;

        return (
          <motion.button
            key={deck.slug}
            type="button"
            onClick={() => onSelectDeck(deck.slug)}
            aria-pressed={isSelected}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            className={`group grid min-h-32 grid-cols-[4.6rem_1fr] items-center gap-3 rounded-control border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-1 sm:items-start ${
              isSelected
                ? "border-accent bg-accent-soft/60"
                : "border-line bg-surface hover:border-accent"
            }`}
          >
            <div className="relative h-28 w-[4.6rem] shrink-0 sm:h-40 sm:w-full">
              <div className="absolute inset-y-2 right-0 w-[68%] rotate-3 overflow-hidden rounded-[0.25rem] border border-line bg-soft">
                <Image
                  src={deck.cardBackSrc}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-y-0 left-0 w-[68%] -rotate-2 overflow-hidden rounded-[0.25rem] border border-line bg-surface transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-3 sm:w-[58%]">
                <Image
                  src={previewSrc}
                  alt={`${deck.name[locale]} — ${previewCard?.name[locale] ?? ""}`}
                  fill
                  sizes="(min-width: 640px) 100px, 55px"
                  className="object-cover"
                />
              </div>
              <span
                aria-hidden
                className="absolute bottom-2 right-1 rounded-full border border-line bg-surface/90 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-muted backdrop-blur-sm"
              >
                78
              </span>
            </div>

            <div className="min-w-0 sm:w-full">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold leading-5 text-ink">
                  {deck.name[locale]}
                </p>
                {isSelected ? (
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="shrink-0 text-accent"
                    aria-hidden
                  />
                ) : null}
              </div>
              {deck.badgeText ? (
                <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted">
                  {deck.badgeText[locale]}
                </p>
              ) : null}
              <p className="mt-2 line-clamp-3 text-[0.68rem] leading-4 text-muted">
                {deck.description[locale]}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
