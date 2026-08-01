"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface QuestionPromptStepProps {
  initialQuestion: string;
  onProceed(question: string): void;
  onSkip(): void;
}

export function QuestionPromptStep({
  initialQuestion,
  onProceed,
  onSkip,
}: QuestionPromptStepProps) {
  const t = useTranslations("Reading");
  const [question, setQuestion] = useState(initialQuestion);
  const suggestions = [
    t("suggestionClarity"),
    t("suggestionRelease"),
    t("suggestionDirection"),
  ];

  const proceed = () => onProceed(question.trim());

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto grid min-h-[34rem] max-w-4xl gap-10 py-6 md:grid-cols-[0.72fr_1.28fr] md:items-start md:py-14"
      aria-labelledby="question-title"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          01 / {t("phaseSetup")}
        </p>
        <h2
          id="question-title"
          className="mt-5 font-editorial text-4xl font-medium leading-tight text-ink sm:text-5xl"
        >
          {t("setupTitle")}
        </h2>
        <p className="mt-5 text-sm leading-7 text-muted">
          {t("setupBody")}
        </p>
      </div>

      <div className="border-t border-line pt-6">
        <label
          htmlFor="reading-question"
          className="text-sm font-semibold text-ink"
        >
          {t("questionLabel")}
        </label>
        <textarea
          id="reading-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={2_000}
          rows={5}
          placeholder={t("questionPlaceholder")}
          className="mt-3 w-full rounded-control border border-line bg-surface px-4 py-4 text-base leading-7 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <div className="mt-2 flex items-start justify-between gap-4 text-[0.7rem] leading-5 text-muted">
          <p>{t("questionHelp")}</p>
          <p aria-live="polite" className="shrink-0 tabular-nums">
            {t("characters", { count: question.length })}
          </p>
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {t("suggestionLabel")}
          </p>
          <div className="mt-3 grid gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                onClick={() => setQuestion(suggestion)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="group flex min-h-11 items-center justify-between gap-4 rounded-control border border-line bg-surface px-4 py-3 text-left text-sm leading-5 text-muted transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span>{suggestion}</span>
                <ArrowRightIcon
                  size={15}
                  aria-hidden
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={proceed}
            className="inline-flex min-h-12 items-center gap-3 rounded-control bg-ink px-5 text-sm font-semibold text-canvas transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t("continue")}
            <ArrowRightIcon size={17} weight="bold" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="border-b border-muted pb-1 text-sm font-medium text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t("skipQuestion")}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
