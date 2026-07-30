"use client";

import { useState } from "react";
import { ArrowSquareOutIcon, SparkleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import type {
  DrawnCard,
  Locale,
  SpreadPosition,
  TarotCard,
} from "@/domain/tarot";
import { generateAIInterpretation } from "@/lib/ai-reading-engine";

export function InterpretationPanel({
  drawnCard,
  card,
  position,
  locale,
}: {
  drawnCard: DrawnCard;
  card: TarotCard;
  position: SpreadPosition;
  locale: Locale;
}) {
  const t = useTranslations("Reading");
  const [viewMode, setViewMode] = useState<"classic" | "ai">("classic");

  const content =
    drawnCard.orientation === "upright" ? card.upright : card.reversed;
  const orientation =
    drawnCard.orientation === "upright" ? t("upright") : t("reversed");

  const aiResult = generateAIInterpretation({
    drawnCard,
    card,
    position,
    locale,
  });

  return (
    <aside
      aria-live="polite"
      data-testid="interpretation-panel"
      className="rounded-panel border border-line bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <span>{t("position", { number: position.order })}</span>
          <span aria-hidden className="size-1 rounded-full bg-accent" />
          <span>{position.label[locale]}</span>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex rounded-full border border-line bg-canvas p-1">
          <button
            type="button"
            onClick={() => setViewMode("classic")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "classic"
                ? "bg-accent text-surface shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            📜 {locale === "vi" ? "Cổ Điển" : "Classic"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("ai")}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "ai"
                ? "bg-accent text-surface shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <SparkleIcon size={13} weight="bold" />
            {locale === "vi" ? "AI Chuyên Sâu" : "AI Insight"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-editorial text-4xl leading-tight text-ink">
          {card.name[locale]}
        </h3>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
          {orientation}
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Keywords">
        {(viewMode === "ai" ? aiResult.keyThemes : content.keywords.map((k) => k[locale])).map(
          (keyword) => (
            <li
              key={keyword}
              className="rounded-full bg-soft px-3 py-1.5 text-xs text-ink font-medium"
            >
              {keyword}
            </li>
          ),
        )}
      </ul>

      {viewMode === "classic" ? (
        <>
          <div className="mt-7 border-t border-line pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {t("meaning")}
            </h4>
            <p className="mt-3 text-base leading-7 text-ink">
              {content.meaning[locale]}
            </p>
          </div>
          <div className="mt-6 border-l border-accent pl-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {t("reflection")}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted">
              {position.promptHint[locale]}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="mt-7 rounded-control border border-accent/30 bg-accent-soft/20 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <SparkleIcon size={14} weight="bold" />
              {locale === "vi" ? "Tóm Tắt Năng Lượng AI" : "AI Energy Summary"}
            </h4>
            <p className="mt-2 text-sm leading-6 text-ink">
              {aiResult.summary}
            </p>
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {locale === "vi" ? "Phân Tích Chi Tiết Vị Trí" : "Position Deep Analysis"}
            </h4>
            <p className="mt-3 text-base leading-7 text-ink">
              {aiResult.insight}
            </p>
          </div>

          <div className="mt-6 border-l border-accent pl-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {locale === "vi" ? "Lời Khuyên Định Hướng" : "Actionable Guidance"}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted">
              {aiResult.advice}
            </p>
          </div>
        </>
      )}

      <a
        href={card.image.sourcePage}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-muted underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
      >
        {card.image.author}, {card.image.license}
        <ArrowSquareOutIcon size={14} aria-hidden />
      </a>
    </aside>
  );
}
