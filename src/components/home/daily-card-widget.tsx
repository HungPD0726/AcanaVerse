"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { tarotCards } from "@/data/cards";
import type { Locale, TarotCard } from "@/domain/tarot";
import { audioEngine } from "@/lib/audio-engine";

export function DailyCardWidget() {
  const locale = useLocale() as Locale;
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [orientation, setOrientation] = useState<"upright" | "reversed">("upright");
  const [isRevealed, setIsRevealed] = useState(false);

  const handleDrawDailyCard = () => {
    audioEngine.playShuffleSound();
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const randomOrientation = Math.random() > 0.3 ? "upright" : "reversed";
    setDrawnCard(randomCard);
    setOrientation(randomOrientation);
    setIsRevealed(false);

    setTimeout(() => {
      audioEngine.playFlipSound();
      setIsRevealed(true);
    }, 400);
  };

  const meaning = drawnCard
    ? orientation === "upright"
      ? drawnCard.upright.meaning[locale]
      : drawnCard.reversed.meaning[locale]
    : "";

  return (
    <section className="mt-12 rounded-panel border border-accent/30 bg-surface/80 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          ✨ {locale === "vi" ? "Lá Bài Đầu Ngày" : "Daily Card Guidance"}
        </span>
        <h3 className="mt-3 font-editorial text-2xl text-ink sm:text-3xl">
          {locale === "vi"
            ? "Định hướng tâm trí mỗi sáng"
            : "Guide your intention for today"}
        </h3>
        <p className="mt-2 max-w-md text-xs leading-5 text-muted sm:text-sm">
          {locale === "vi"
            ? "Rút một lá bài ngẫu nhiên để đón nhận thông điệp phù hợp nhất cho khoảnh khắc này."
            : "Draw a single random card to receive a mindful focus for your current day."}
        </p>

        {!drawnCard ? (
          <motion.button
            type="button"
            onClick={handleDrawDailyCard}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-6 inline-flex items-center justify-center rounded-control bg-accent px-6 py-3 text-sm font-bold text-surface shadow-md transition-all hover:bg-accent/90"
          >
            🌟 {locale === "vi" ? "Rút Lá Bài Hôm Nay" : "Draw Today's Card"}
          </motion.button>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, rotateY: 180 }}
              animate={{
                scale: 1,
                rotateY: isRevealed ? 0 : 180,
              }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative h-44 w-26 overflow-hidden rounded-lg border border-line bg-soft shadow-md sm:h-52 sm:w-30"
            >
              <Image
                src={
                  isRevealed
                    ? drawnCard.image.src
                    : "/images/brand/card-back.webp"
                }
                alt={drawnCard.name[locale]}
                fill
                sizes="120px"
                className={`object-cover ${
                  orientation === "reversed" && isRevealed ? "rotate-180" : ""
                }`}
              />
            </motion.div>

            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 max-w-md"
              >
                <h4 className="font-editorial text-xl text-ink">
                  {drawnCard.name[locale]}{" "}
                  <span className="text-xs font-normal text-muted">
                    ({orientation === "upright"
                      ? locale === "vi"
                        ? "Xuôi"
                        : "Upright"
                      : locale === "vi"
                        ? "Ngược"
                        : "Reversed"})
                  </span>
                </h4>
                <p className="mt-2 text-xs leading-6 text-muted sm:text-sm">
                  {meaning}
                </p>

                <button
                  type="button"
                  onClick={handleDrawDailyCard}
                  className="mt-4 text-xs font-semibold text-accent underline decoration-line underline-offset-4 hover:text-ink"
                >
                  🔄 {locale === "vi" ? "Rút lá bài khác" : "Draw another card"}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
