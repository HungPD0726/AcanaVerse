"use client";

import { useState } from "react";
import { BookBookmarkIcon, XIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale } from "next-intl";
import { tarotCardsById } from "@/data/cards";
import { getSpread } from "@/data/spreads";
import type { Locale } from "@/domain/tarot";
import { getJournalEntries, type JournalEntry } from "@/lib/journal-storage";

export function JournalDrawer() {
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const openDrawer = () => {
    setEntries(getJournalEntries());
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        aria-label={locale === "vi" ? "Nhật ký Tarot" : "Tarot Journal"}
        title={locale === "vi" ? "Nhật ký Tarot" : "Tarot Journal"}
        className="inline-flex size-10 items-center justify-center rounded-control border border-line bg-surface text-muted transition-colors hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <BookBookmarkIcon size={19} aria-hidden />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-modal flex justify-end bg-canvas/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex h-full w-full max-w-md flex-col border-l border-line bg-surface p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2 text-ink">
                  <BookBookmarkIcon size={22} className="text-accent" />
                  <h3 className="font-editorial text-2xl">
                    {locale === "vi" ? "Nhật ký Tarot" : "Tarot Journal"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-control p-1 text-muted hover:bg-soft hover:text-ink"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto pr-1">
                {entries.length === 0 ? (
                  <p className="mt-12 text-center text-sm text-muted">
                    {locale === "vi"
                      ? "Chưa có quẻ bốc nào được lưu trong nhật ký."
                      : "No readings recorded in journal yet."}
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {entries.map((entry) => {
                      const spread = getSpread(entry.spreadSlug);
                      const dateStr = new Date(entry.createdAt).toLocaleDateString(
                        locale === "vi" ? "vi-VN" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                      return (
                        <div
                          key={entry.id}
                          className="rounded-panel border border-line bg-canvas p-4"
                        >
                          <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wider text-accent font-semibold">
                            <span>{spread?.name[locale]}</span>
                            <span className="text-muted">{dateStr}</span>
                          </div>

                          <h4 className="mt-2 text-sm font-semibold text-ink">
                            “{entry.question}”
                          </h4>

                          <ol className="mt-3 flex flex-wrap gap-1.5">
                            {entry.drawnCardIds.map((cardId, idx) => {
                              const card = tarotCardsById.get(cardId);
                              const pos = spread?.positions[idx];
                              return (
                                <li
                                  key={cardId}
                                  className="rounded-full bg-soft px-2.5 py-0.5 text-[0.7rem] text-muted"
                                >
                                  {pos?.label[locale] ?? idx + 1}:{" "}
                                  <span className="font-medium text-ink">
                                    {card?.name[locale]}
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
