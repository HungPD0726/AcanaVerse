"use client";

import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import type {
  DrawnCard,
  Locale,
  SpreadPosition,
  TarotCard,
  TarotDeckDefinition,
} from "@/domain/tarot";

export function InterpretationPanel({
  drawnCard,
  card,
  position,
  locale,
  deck,
}: {
  drawnCard: DrawnCard;
  card: TarotCard;
  position: SpreadPosition;
  locale: Locale;
  deck: TarotDeckDefinition;
}) {
  const t = useTranslations("Reading");
  const content =
    drawnCard.orientation === "upright" ? card.upright : card.reversed;
  const orientation =
    drawnCard.orientation === "upright" ? t("upright") : t("reversed");

  return (
    <aside
      aria-live="polite"
      data-testid="interpretation-panel"
      className="rounded-panel border border-line bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line pb-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        <span>{t("position", { number: position.order })}</span>
        <span aria-hidden className="h-px w-5 bg-line" />
        <span>{position.label[locale]}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-editorial text-4xl font-medium leading-tight text-ink">
          {card.name[locale]}
        </h3>
        <span className="text-xs font-medium text-muted">{orientation}</span>
      </div>

      <ul
        className="mt-5 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted"
        aria-label={t("keywords")}
      >
        {content.keywords.map((keyword, index) => (
          <li key={keyword[locale]} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden className="size-0.5 rounded-full bg-muted" />
            ) : null}
            {keyword[locale]}
          </li>
        ))}
      </ul>

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

      <a
        href={deck.sourcePage}
        target="_blank"
        rel="noreferrer"
        className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
      >
        {deck.artworkAuthor}, {deck.license}
        <ArrowSquareOutIcon size={14} aria-hidden />
      </a>
      {deck.mappingNote ? (
        <p className="mt-3 text-xs leading-5 text-muted">
          {deck.mappingNote[locale]}
        </p>
      ) : null}
    </aside>
  );
}
