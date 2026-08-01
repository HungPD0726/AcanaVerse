"use client";

import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { LayoutGroup, motion, MotionConfig } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useReducer, useRef, useState } from "react";
import { CardFan } from "@/components/reading/card-fan";
import { DeckSelector } from "@/components/reading/deck-selector";
import { DeckStack } from "@/components/reading/deck-stack";
import { ExportReadingCard } from "@/components/reading/export-reading-card";
import { InterpretationPanel } from "@/components/reading/interpretation-panel";
import { QuestionPromptStep } from "@/components/reading/question-prompt-step";
import { ShuffleAnimation } from "@/components/reading/shuffle-animation";
import { SpreadSelector } from "@/components/reading/spread-selector";
import { SpreadTableau } from "@/components/reading/spread-tableau";
import { tarotCards, tarotCardsById } from "@/data/cards";
import { defaultDeck, tarotDecksBySlug } from "@/data/decks";
import { getSpread } from "@/data/spreads";
import type {
  Locale,
  ReadingPhase,
  ReadingSession,
  SpreadDefinition,
} from "@/domain/tarot";
import { Link } from "@/i18n/navigation";
import { audioEngine } from "@/lib/audio-engine";
import {
  createDrawnCard,
  createReadingSession,
  prepareShuffle,
  readingReducer,
  restoreSession,
  serializeSession,
  SESSION_STORAGE_KEY,
} from "@/lib/reading-engine";

const phaseOrder: ReadingPhase[] = [
  "setup",
  "shuffling",
  "selecting",
  "laid-out",
  "revealing",
  "completed",
];

function phaseProgress(phase: ReadingPhase) {
  if (phase === "completed" || phase === "revealing") return 4;
  if (phase === "laid-out") return 3;
  return Math.max(phaseOrder.indexOf(phase), 0);
}

export function ReadingExperience({
  spread: initialSpread,
  initialSession,
}: {
  spread: SpreadDefinition;
  initialSession: ReadingSession;
}) {
  const t = useTranslations("Reading");
  const common = useTranslations("Common");
  const locale = useLocale() as Locale;
  const [session, dispatch] = useReducer(readingReducer, initialSession);
  const [storageReady, setStorageReady] = useState(false);
  const [showRestoreNotice, setShowRestoreNotice] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [setupStep, setSetupStep] = useState<"prompt" | "deck">("prompt");
  const phasePanelRef = useRef<HTMLDivElement>(null);
  const hasMountedPhase = useRef(false);

  const activeDeck = tarotDecksBySlug.get(session.deckSlug) ?? defaultDeck;
  const spread = getSpread(session.spreadSlug) ?? initialSpread;
  const progressIndex = phaseProgress(session.phase);
  const selectedIds = new Set(
    session.drawnCards.map((drawnCard) => drawnCard.cardId),
  );
  const revealedCount = session.drawnCards.filter(
    (drawnCard) => drawnCard.isRevealed,
  ).length;
  const nextRevealIndex = session.drawnCards.findIndex(
    (drawnCard) => !drawnCard.isRevealed,
  );
  const activeDrawnCard = session.drawnCards[activeCardIndex];
  const activeCard = activeDrawnCard
    ? tarotCardsById.get(activeDrawnCard.cardId)
    : undefined;
  const activePosition = activeDrawnCard
    ? spread.positions[activeCardIndex]
    : undefined;

  useEffect(() => {
    queueMicrotask(() => {
      const restored = restoreSession(
        sessionStorage.getItem(SESSION_STORAGE_KEY),
        initialSpread.slug,
      );
      if (restored) {
        dispatch({ type: "RESET", session: restored });
        setShowRestoreNotice(true);
      }
      setStorageReady(true);
    });
  }, [initialSpread.slug]);

  useEffect(() => {
    if (!storageReady) return;
    sessionStorage.setItem(SESSION_STORAGE_KEY, serializeSession(session));
  }, [session, storageReady]);

  useEffect(() => {
    if (session.locale !== locale) {
      dispatch({ type: "CHANGE_LOCALE", locale });
    }
  }, [locale, session.locale]);

  useEffect(() => {
    if (!hasMountedPhase.current) {
      hasMountedPhase.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      phasePanelRef.current?.scrollIntoView?.({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [session.phase, setupStep]);

  const handleShuffle = () => {
    audioEngine.playShuffleSound();
    dispatch({
      type: "START_SHUFFLE",
      shuffledCardIds: prepareShuffle(tarotCards.map((card) => card.id)),
    });
  };

  const handleSelect = (cardId: string) => {
    if (session.drawnCards.length >= spread.cardCount) return;
    audioEngine.playDropSound();
    dispatch({
      type: "SELECT_CARD",
      drawnCard: createDrawnCard(
        cardId,
        spread,
        session.drawnCards.length,
      ),
      cardCount: spread.cardCount,
    });
  };

  const handleReveal = (index: number) => {
    if (
      session.phase !== "revealing" ||
      index !== nextRevealIndex ||
      index < 0
    ) {
      return;
    }
    setActiveCardIndex(index);
    dispatch({ type: "REVEAL_NEXT" });
    if (revealedCount + 1 === spread.cardCount) {
      audioEngine.playSingingBowlSound();
    }
  };

  const handleNewReading = () => {
    dispatch({
      type: "RESET",
      session: createReadingSession(spread, locale),
    });
    setActiveCardIndex(0);
    setShowRestoreNotice(false);
    setSetupStep("prompt");
  };

  const stepLabels = [
    t("phaseSetup"),
    t("phaseShuffle"),
    t("phaseSelect"),
    t("phaseLayout"),
    t("phaseReveal"),
  ];

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <header className="border-b border-line pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              <ArrowLeftIcon size={14} weight="bold" aria-hidden />
              {common("backHome")}
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {spread.name[locale]}
            </p>
          </div>

          <nav aria-label={t("progressLabel")} className="mt-7">
            <ol className="grid grid-cols-5 gap-2 text-center text-[0.68rem] font-medium text-muted sm:gap-4 sm:text-xs">
              {stepLabels.map((label, index) => {
                const isActive = index === progressIndex;
                const isDone = index < progressIndex;
                return (
                  <li
                    key={label}
                    aria-current={isActive ? "step" : undefined}
                    className={`border-t pt-2 transition-colors ${
                      isActive
                        ? "border-accent font-semibold text-ink"
                        : isDone
                          ? "border-ink text-muted"
                          : "border-line text-muted/60"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {String(index + 1).padStart(2, "0")} ·{" "}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ol>
          </nav>
        </header>

        {showRestoreNotice ? (
          <p
            role="status"
            className="mt-5 rounded-control border border-line bg-soft px-4 py-3 text-xs text-muted"
          >
            {t("restoreNotice")}
          </p>
        ) : null}

        <LayoutGroup id="reading-ritual">
          <motion.div
            ref={phasePanelRef}
            key={`${session.phase}-${setupStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 scroll-mt-20"
          >
            {session.phase === "setup" && setupStep === "prompt" ? (
              <QuestionPromptStep
                initialQuestion={session.question}
                onProceed={(question) => {
                  dispatch({ type: "SET_QUESTION", question });
                  setSetupStep("deck");
                }}
                onSkip={() => {
                  dispatch({ type: "SET_QUESTION", question: "" });
                  setSetupStep("deck");
                }}
              />
            ) : null}

            {session.phase === "setup" && setupStep === "deck" ? (
              <section
                className="mx-auto max-w-5xl py-3 sm:py-8"
                aria-labelledby="ritual-options-title"
              >
                <div className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      02 / {t("ritualOptionsEyebrow")}
                    </p>
                    <h2
                      id="ritual-options-title"
                      className="mt-3 font-editorial text-4xl font-medium text-ink sm:text-5xl"
                    >
                      {t("ritualOptionsTitle")}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSetupStep("prompt")}
                    className="inline-flex items-center gap-2 self-start border-b border-muted pb-1 text-xs font-semibold text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:self-auto"
                  >
                    <ArrowCounterClockwiseIcon size={14} aria-hidden />
                    {t("editQuestion")}
                  </button>
                </div>

                {session.question ? (
                  <blockquote className="my-6 border-l border-accent pl-4 font-editorial text-lg leading-7 text-ink">
                    “{session.question}”
                  </blockquote>
                ) : null}

                <div className="mt-7">
                  <div className="mb-4 flex items-end justify-between gap-5">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {t("chooseSpread")}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {t("spreadsBody")}
                      </p>
                    </div>
                  </div>
                  <SpreadSelector
                    selectedSpreadSlug={session.spreadSlug}
                    onSelectSpread={(nextSpread) =>
                      dispatch({
                        type: "SET_SPREAD",
                        spreadSlug: nextSpread.slug,
                      })
                    }
                    locale={locale}
                  />
                </div>

                <div className="mt-10 grid gap-6 border-t border-line pt-8 lg:grid-cols-[0.72fr_1.28fr]">
                  <DeckStack
                    cardBackSrc={activeDeck.cardBackSrc}
                    onShuffle={handleShuffle}
                    label={t("shuffle")}
                    sublabel={t("shuffleDeckHint")}
                  />
                  <div className="lg:py-3">
                    <h3 className="text-sm font-semibold text-ink">
                      {t("selectDeckTitle")}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {t("selectDeckBody")}
                    </p>
                    <div className="mt-5">
                      <DeckSelector
                        selectedDeckSlug={session.deckSlug}
                        onSelectDeck={(deckSlug) =>
                          dispatch({ type: "SET_DECK", deckSlug })
                        }
                        locale={locale}
                      />
                    </div>
                    <p className="mt-5 border-l border-line pl-4 text-xs leading-5 text-muted">
                      {t("shuffleActionHint")}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {session.phase === "shuffling" ? (
              <ShuffleAnimation
                cardBackSrc={activeDeck.cardBackSrc}
                onReady={() => dispatch({ type: "START_SELECTING" })}
                shufflingLabel={t("shuffling")}
                readyLabel={t("beginSelecting")}
                hint={t("shufflingHint")}
              />
            ) : null}

            {session.phase === "selecting" ? (
              <section aria-labelledby="select-cards-title">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {t("selectedProgress", {
                      selected: session.drawnCards.length,
                      total: spread.cardCount,
                    })}
                  </p>
                  <h2
                    id="select-cards-title"
                    className="mt-3 font-editorial text-4xl font-medium text-ink sm:text-5xl"
                  >
                    {t("selectTitle", { count: spread.cardCount })}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {t("selectBody")}
                  </p>
                </div>

                <p className="sr-only" role="status" aria-live="polite">
                  {t("selectedProgress", {
                    selected: session.drawnCards.length,
                    total: spread.cardCount,
                  })}
                </p>

                <div className="mt-8 flex flex-col">
                  <div className="order-2 mt-8 rounded-panel border border-line bg-surface p-4 sm:p-6 md:order-1 md:mt-0">
                    <div className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
                      <p className="font-editorial text-xl text-ink">
                        {spread.name[locale]}
                      </p>
                      <p className="text-xs tabular-nums text-muted">
                        {session.drawnCards.length} / {spread.cardCount}
                      </p>
                    </div>
                    <SpreadTableau
                      spread={spread}
                      drawnCards={session.drawnCards}
                      locale={locale}
                      allowReveal={false}
                      onReveal={() => undefined}
                      cardBackSrc={activeDeck.cardBackSrc}
                    />
                  </div>

                  <div className="order-1 md:order-2 md:mt-8">
                    <CardFan
                      shuffledCardIds={session.shuffledCardIds}
                      selectedCardIds={selectedIds}
                      onSelect={handleSelect}
                      cardBackSrc={activeDeck.cardBackSrc}
                    />
                  </div>
                </div>
              </section>
            ) : null}

            {session.phase === "laid-out" ? (
              <section className="py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("phaseLayout")}
                </p>
                <h2 className="mt-3 font-editorial text-4xl font-medium text-ink sm:text-5xl">
                  {t("readyTitle")}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
                  {t("readyBody")}
                </p>
                <div className="mt-8 rounded-panel border border-line bg-surface p-4 sm:p-6">
                  <SpreadTableau
                    spread={spread}
                    drawnCards={session.drawnCards}
                    locale={locale}
                    allowReveal={false}
                    onReveal={() => undefined}
                    cardBackSrc={activeDeck.cardBackSrc}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCardIndex(0);
                    dispatch({ type: "START_REVEALING" });
                  }}
                  className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-control bg-ink px-5 text-sm font-semibold text-canvas transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {t("beginReveal")}
                  <ArrowRightIcon size={17} weight="bold" aria-hidden />
                </button>
              </section>
            ) : null}

            {session.phase === "revealing" ||
            session.phase === "completed" ? (
              <section>
                <div className="mb-7 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"
                      role="status"
                      aria-live="polite"
                    >
                      {t("revealedProgress", {
                        revealed: revealedCount,
                        total: spread.cardCount,
                      })}
                    </p>
                    <h2 className="mt-2 font-editorial text-3xl font-medium text-ink sm:text-4xl">
                      {session.phase === "completed"
                        ? t("completedTitle")
                        : t("revealTitle")}
                    </h2>
                  </div>
                  {session.phase === "revealing" && nextRevealIndex >= 0 ? (
                    <button
                      type="button"
                      onClick={() => handleReveal(nextRevealIndex)}
                      className="inline-flex min-h-11 items-center gap-2 self-start rounded-control border border-line bg-surface px-4 text-xs font-semibold text-ink transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:self-auto"
                    >
                      {t("revealNext")}
                      <ArrowRightIcon size={15} weight="bold" aria-hidden />
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
                  <div>
                    <SpreadTableau
                      spread={spread}
                      drawnCards={session.drawnCards}
                      locale={locale}
                      allowReveal={session.phase === "revealing"}
                      onReveal={handleReveal}
                      onActivate={setActiveCardIndex}
                      activeIndex={activeCardIndex}
                      cardBackSrc={activeDeck.cardBackSrc}
                    />

                    {session.phase === "completed" ? (
                      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-line pt-7">
                        <button
                          type="button"
                          onClick={handleNewReading}
                          className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-4 text-xs font-semibold text-canvas focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                        >
                          <ArrowCounterClockwiseIcon
                            size={16}
                            weight="bold"
                            aria-hidden
                          />
                          {t("newReading")}
                        </button>
                        <ExportReadingCard
                          spread={spread}
                          drawnCards={session.drawnCards}
                          question={session.question}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="xl:sticky xl:top-28 xl:self-start">
                    {activeDrawnCard?.isRevealed &&
                    activeCard &&
                    activePosition ? (
                      <InterpretationPanel
                        drawnCard={activeDrawnCard}
                        card={activeCard}
                        position={activePosition}
                        locale={locale}
                        deck={activeDeck}
                      />
                    ) : (
                      <aside className="rounded-panel border border-line bg-soft/35 p-6 sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                          {t("meaning")}
                        </p>
                        <h3 className="mt-3 font-editorial text-3xl text-ink">
                          {t("revealPanelTitle")}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-muted">
                          {t("revealPanelBody")}
                        </p>
                      </aside>
                    )}
                  </div>
                </div>
              </section>
            ) : null}
          </motion.div>
        </LayoutGroup>
      </div>
    </MotionConfig>
  );
}
