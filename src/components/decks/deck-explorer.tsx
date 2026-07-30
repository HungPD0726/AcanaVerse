"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { FanningDeckCard } from "@/components/decks/fanning-deck-card";
import { tarotCards } from "@/data/cards";
import { tarotDecks } from "@/data/decks";
import type { Locale, TarotCard } from "@/domain/tarot";
import { audioEngine } from "@/lib/audio-engine";

export function DeckExplorer() {
  const locale = useLocale() as Locale;
  const [selectedDeckSlug, setSelectedDeckSlug] = useState(tarotDecks[0].slug);
  const [viewMode, setViewMode] = useState<"guidebook" | "grid">("guidebook");
  const [activeFilter, setActiveFilter] = useState<"all" | "major" | "minor">("all");
  const [inspectCard, setInspectCard] = useState<TarotCard | null>(null);

  const activeDeck =
    tarotDecks.find((d) => d.slug === selectedDeckSlug) ?? tarotDecks[0];

  // Group cards for Guidebook Fanning Decks
  const majorArcanaCards = tarotCards.filter((c) => c.arcana === "major");
  const wandsCards = tarotCards.filter((c) => c.suit === "wands");
  const cupsCards = tarotCards.filter((c) => c.suit === "cups");
  const swordsCards = tarotCards.filter((c) => c.suit === "swords");
  const pentaclesCards = tarotCards.filter((c) => c.suit === "pentacles");

  const filteredCards = tarotCards.filter((card) => {
    if (activeFilter === "major") return card.arcana === "major";
    if (activeFilter === "minor") return card.arcana === "minor";
    return true;
  });

  const handleCardClick = (card: TarotCard) => {
    audioEngine.playFlipSound();
    setInspectCard(card);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center">
        <span className="rounded-full border-2 border-black bg-[#e2c6ff] px-4 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
          🌙 Moonlight Guidebook & Decks
        </span>
        <h1 className="mt-5 font-editorial text-4xl font-normal tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {locale === "vi" ? "Ý Nghĩa 78 Lá Bài Tarot" : "Tarot Meanings & Digital Decks"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          {locale === "vi"
            ? "Rê chuột vào các bộ bài để xòe bài xem 3D, hoặc click chọn lá bài bất kỳ để khám phá chiều sâu ý nghĩa Xuôi và Ngược."
            : "Hover over deck cards to fan them out in 3D, or click any card to inspect full upright and reversed meanings."}
        </p>

        {/* View Mode Switcher Pill (Matching Screenshot 1) */}
        <div className="mt-8 inline-flex items-center rounded-full border-2 border-black bg-surface p-1.5 shadow-[4px_4px_0px_0px_#000]">
          <button
            type="button"
            onClick={() => setViewMode("guidebook")}
            className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${
              viewMode === "guidebook"
                ? "bg-black text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {locale === "vi" ? "Bộ Bài Xòe (Guidebook)" : "Fanning Decks"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-black text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {locale === "vi" ? "Danh Sách 78 Lá" : "All 78 Cards Grid"}
          </button>
        </div>
      </div>

      {/* Deck Style Selector Tabs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {tarotDecks.map((deck) => {
          const isSelected = deck.slug === selectedDeckSlug;
          return (
            <button
              key={deck.slug}
              type="button"
              onClick={() => setSelectedDeckSlug(deck.slug)}
              className={`moonlight-button flex items-center gap-3 rounded-full border-2 border-black px-5 py-2.5 text-xs font-bold transition-all ${
                isSelected
                  ? "bg-[#e2c6ff] text-black"
                  : "bg-surface text-ink hover:bg-soft"
              }`}
            >
              <div className="relative h-6 w-4 overflow-hidden rounded-[0.15rem] border border-black">
                <Image
                  src={deck.cardBackSrc}
                  alt=""
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
              <span>{deck.name[locale]}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: Moonlight 3D Fanning Deck Cards (Matching Screenshot 1 & 2) */}
      {viewMode === "guidebook" ? (
        <div className="mt-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Major Arcana Fanning Deck */}
            <FanningDeckCard
              categoryTitle={locale === "vi" ? "Đại Ẩn Số" : "Major Arcana"}
              countText={locale === "vi" ? "22 Lá Bài" : "22 Cards"}
              cards={majorArcanaCards}
              locale={locale}
              onSelectCard={handleCardClick}
              frontImageFilter={activeDeck.frontImageFilter}
              frameOverlayClass={activeDeck.frameOverlayClass}
            />

            {/* Suit of Wands Fanning Deck */}
            <FanningDeckCard
              categoryTitle={locale === "vi" ? "Bộ Gậy (Wands)" : "Suit of Wands"}
              countText={locale === "vi" ? "14 Lá Bài • Hỏa" : "14 Cards • Fire"}
              cards={wandsCards}
              locale={locale}
              onSelectCard={handleCardClick}
              frontImageFilter={activeDeck.frontImageFilter}
              frameOverlayClass={activeDeck.frameOverlayClass}
            />

            {/* Suit of Cups Fanning Deck */}
            <FanningDeckCard
              categoryTitle={locale === "vi" ? "Bộ Cốc (Cups)" : "Suit of Cups"}
              countText={locale === "vi" ? "14 Lá Bài • Thủy" : "14 Cards • Water"}
              cards={cupsCards}
              locale={locale}
              onSelectCard={handleCardClick}
              frontImageFilter={activeDeck.frontImageFilter}
              frameOverlayClass={activeDeck.frameOverlayClass}
            />

            {/* Suit of Swords Fanning Deck */}
            <FanningDeckCard
              categoryTitle={locale === "vi" ? "Bộ Kiếm (Swords)" : "Suit of Swords"}
              countText={locale === "vi" ? "14 Lá Bài • Phong" : "14 Cards • Air"}
              cards={swordsCards}
              locale={locale}
              onSelectCard={handleCardClick}
              frontImageFilter={activeDeck.frontImageFilter}
              frameOverlayClass={activeDeck.frameOverlayClass}
            />

            {/* Suit of Pentacles Fanning Deck */}
            <FanningDeckCard
              categoryTitle={locale === "vi" ? "Bộ Tiền (Pentacles)" : "Suit of Pentacles"}
              countText={locale === "vi" ? "14 Lá Bài • Thổ" : "14 Cards • Earth"}
              cards={pentaclesCards}
              locale={locale}
              onSelectCard={handleCardClick}
              frontImageFilter={activeDeck.frontImageFilter}
              frameOverlayClass={activeDeck.frameOverlayClass}
            />
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: Individual 78 Cards Grid */
        <div className="mt-10">
          {/* Arcana Filter Tabs */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === "all"
                  ? "border-2 border-black bg-purple-200 text-black font-bold shadow-[2px_2px_0px_0px_#000]"
                  : "text-muted hover:text-ink"
              }`}
            >
              {locale === "vi" ? "Tất Cả (78 Lá)" : "All (78 Cards)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("major")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === "major"
                  ? "border-2 border-black bg-purple-200 text-black font-bold shadow-[2px_2px_0px_0px_#000]"
                  : "text-muted hover:text-ink"
              }`}
            >
              {locale === "vi" ? "Đại Ẩn Số (22 Lá)" : "Major Arcana (22)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("minor")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === "minor"
                  ? "border-2 border-black bg-purple-200 text-black font-bold shadow-[2px_2px_0px_0px_#000]"
                  : "text-muted hover:text-ink"
              }`}
            >
              {locale === "vi" ? "Tiểu Ẩn Số (56 Lá)" : "Minor Arcana (56)"}
            </button>
          </div>

          {/* Grid of Cards */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredCards.map((card, idx) => (
              <motion.button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card)}
                whileHover={{ scale: 1.05, y: -6, rotateZ: (idx % 2 === 0 ? 1 : -1) * 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center rounded-2xl border-2 border-black bg-surface p-2.5 shadow-[3px_3px_0px_0px_#000] transition-all hover:shadow-[5px_5px_0px_0px_#000]"
              >
                <div className={`relative aspect-[2/3.4] w-full overflow-hidden rounded-lg ${activeDeck.frameOverlayClass ?? ""}`}>
                  <Image
                    src={card.image.src}
                    alt={card.name[locale]}
                    fill
                    sizes="(min-width: 1024px) 16vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: activeDeck.frontImageFilter }}
                  />
                </div>
                <h4 className="mt-2 text-center font-editorial text-xs font-semibold text-ink line-clamp-1">
                  {card.name[locale]}
                </h4>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Card Inspection Modal */}
      {inspectCard && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-canvas/70 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-[2rem] border-2 border-black bg-surface p-6 shadow-[8px_8px_0px_0px_#000] sm:p-8"
          >
            <button
              type="button"
              onClick={() => setInspectCard(null)}
              className="absolute right-4 top-4 rounded-full border-2 border-black bg-surface p-2 text-muted shadow-[2px_2px_0px_0px_#000] hover:bg-soft hover:text-ink"
            >
              ✕
            </button>

            <div className="grid gap-6 sm:grid-cols-[11rem_1fr] sm:items-center">
              <div className={`relative aspect-[2/3.4] w-full overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] ${activeDeck.frameOverlayClass ?? ""}`}>
                <Image
                  src={inspectCard.image.src}
                  alt={inspectCard.name[locale]}
                  fill
                  sizes="200px"
                  className="object-cover"
                  style={{ filter: activeDeck.frontImageFilter }}
                />
              </div>

              <div>
                <span className="rounded-full border border-black bg-purple-200 px-3 py-1 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                  {inspectCard.arcana === "major"
                    ? locale === "vi"
                      ? "Đại Ẩn Số"
                      : "Major Arcana"
                    : locale === "vi"
                      ? "Tiểu Ẩn Số"
                      : "Minor Arcana"}
                </span>
                <h3 className="mt-3 font-editorial text-3xl text-ink">
                  {inspectCard.name[locale]}
                </h3>

                {/* Upright Meaning */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                    ☀️ {locale === "vi" ? "Ý Nghĩa Xuôi" : "Upright Meaning"}
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {inspectCard.upright.meaning[locale]}
                  </p>
                </div>

                {/* Reversed Meaning */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                    🌙 {locale === "vi" ? "Ý Nghĩa Ngược" : "Reversed Meaning"}
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {inspectCard.reversed.meaning[locale]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
