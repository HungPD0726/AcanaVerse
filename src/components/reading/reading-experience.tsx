"use client";

import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { motion, MotionConfig } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useReducer, useState } from "react";
import { DeckSelector } from "@/components/reading/deck-selector";
import { DeckStack } from "@/components/reading/deck-stack";
import { ExportReadingCard } from "@/components/reading/export-reading-card";
import { InterpretationPanel } from "@/components/reading/interpretation-panel";
import { QuestionPromptStep } from "@/components/reading/question-prompt-step";
import { ShuffleAnimation } from "@/components/reading/shuffle-animation";
import { SpreadSelector } from "@/components/reading/spread-selector";
import { SpreadTableau } from "@/components/reading/spread-tableau";
import { WaveFan } from "@/components/reading/wave-fan";
import { MagicParticles } from "@/components/ui/magic-particles";
import { tarotCards, tarotCardsById } from "@/data/cards";
import { tarotDecksBySlug, defaultDeck } from "@/data/decks";
import { getSpread } from "@/data/spreads";
import { audioEngine } from "@/lib/audio-engine";
import { saveJournalEntry } from "@/lib/journal-storage";
import type {
  Locale,
  ReadingPhase,
  ReadingSession,
  SpreadDefinition,
} from "@/domain/tarot";
import { Link } from "@/i18n/navigation";
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
  if (phase === "completed") return 4;
  if (phase === "revealing") return 4;
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

  const activeDeck = tarotDecksBySlug.get(session.deckSlug) ?? defaultDeck;
  const spread = getSpread(session.spreadSlug) ?? initialSpread;
  const progressIndex = phaseProgress(session.phase);
  const selectedIds = new Set(
    session.drawnCards.map((drawnCard) => drawnCard.cardId),
  );
  const revealedCount = session.drawnCards.filter(
    (drawnCard) => drawnCard.isRevealed,
  ).length;
  const activeDrawnCard =
    session.drawnCards[activeCardIndex] ?? session.drawnCards[0];
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
        spread.slug,
      );
      if (restored) {
        dispatch({ type: "RESET", session: restored });
        setShowRestoreNotice(true);
      }
      setStorageReady(true);
    });
  }, [spread.slug]);

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
    if (session.phase === "completed") {
      audioEngine.playSingingBowlSound();
      saveJournalEntry({
        question: session.question || "Khôn ngoan tĩnh lặng",
        spreadSlug: session.spreadSlug,
        deckSlug: session.deckSlug,
        drawnCardIds: session.drawnCards.map((c) => c.cardId),
      });
    }
  }, [session.phase, session.question, session.spreadSlug, session.deckSlug, session.drawnCards]);

  const handleShuffle = () => {
    audioEngine.playShuffleSound();
    const shuffledCardIds = prepareShuffle(tarotCards.map((card) => card.id));
    dispatch({ type: "START_SHUFFLE", shuffledCardIds });
  };

  const handleSelect = (cardId: string) => {
    if (session.drawnCards.length >= spread.cardCount) return;
    audioEngine.playDropSound();
    const drawnCard = createDrawnCard(
      cardId,
      spread,
      session.drawnCards.length,
    );
    dispatch({
      type: "SELECT_CARD",
      drawnCard,
      cardCount: spread.cardCount,
    });
  };

  const handleNewReading = () => {
    const nextSession = createReadingSession(spread, locale);
    dispatch({ type: "RESET", session: nextSession });
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
    <MotionConfig transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <MagicParticles active={session.phase === "completed" || session.phase === "revealing"} />
        <header className="border-b border-line pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
            >
              <ArrowCounterClockwiseIcon size={14} weight="bold" />
              {common("backHome")}
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {spread.name[locale]}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-editorial text-3xl text-ink sm:text-4xl">
                {spread.name[locale]}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {spread.instruction[locale]}
              </p>
            </div>
          </div>

          <nav aria-label="Progress" className="mt-8">
            <ol className="grid grid-cols-5 gap-2 text-center text-xs font-medium text-muted sm:gap-4">
              {stepLabels.map((label, index) => {
                const isActive = index === progressIndex;
                const isDone = index < progressIndex;
                return (
                  <li
                    key={label}
                    className={`border-t-2 pt-2 transition-colors ${
                      isActive
                        ? "border-accent text-ink font-bold"
                        : isDone
                          ? "border-ink text-muted"
                          : "border-line text-muted/60"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {String(index + 1).padStart(2, "0")}.{" "}
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
            className="mt-6 rounded-control border border-line bg-soft px-4 py-3 text-xs text-muted"
          >
            {t("restoreNotice")}
          </p>
        ) : null}

        <motion.div
          key={`${session.phase}-${setupStep}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          {/* STEP 1: Question Prompt (Screenshot 1 & 2) */}
          {session.phase === "setup" && setupStep === "prompt" ? (
            <QuestionPromptStep
              initialQuestion={session.question}
              locale={locale}
              onProceed={(q) => {
                dispatch({ type: "SET_QUESTION", question: q });
                setSetupStep("deck");
              }}
              onSkip={() => setSetupStep("deck")}
            />
          ) : null}

          {/* STEP 2: Deck Stack & Ready to Shuffle (Screenshot 3) */}
          {session.phase === "setup" && setupStep === "deck" ? (
            <div className="flex flex-col items-center justify-center text-center">
              {/* Question Speech Bubble (Screenshot 3) */}
              {session.question ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mb-8 rounded-2xl border-2 border-black bg-surface px-6 py-3 font-editorial text-lg font-medium text-ink shadow-[4px_4px_0px_0px_#000]"
                >
                  "{session.question}"
                </motion.div>
              ) : null}

              {/* 3D Vertical Deck Stack */}
              <DeckStack
                cardBackSrc={activeDeck.cardBackSrc}
                onShuffle={handleShuffle}
                label={locale === "vi" ? "Sẵn Sàng Tráo Bài" : "Ready to shuffle"}
                sublabel={locale === "vi" ? "Di chuột để cảm nhận năng lượng bài" : "Hover to feel the deck energy"}
              />

              {/* Deck & Spread Selectors Drawer/Accordion */}
              <div className="mt-12 w-full max-w-2xl rounded-2xl border-2 border-black bg-surface p-6 shadow-[6px_6px_0px_0px_#000]">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                      {t("chooseSpread")}
                    </h3>
                    <SpreadSelector
                      selectedSpreadSlug={session.spreadSlug}
                      onSelectSpread={(newSpread) =>
                        dispatch({ type: "SET_SPREAD", spreadSlug: newSpread.slug })
                      }
                      locale={locale}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                      {t("selectDeckTitle")}
                    </h3>
                    <DeckSelector
                      selectedDeckSlug={session.deckSlug}
                      onSelectDeck={(deckSlug) =>
                        dispatch({ type: "SET_DECK", deckSlug })
                      }
                      locale={locale}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP 3: Vertical Cascading Shuffle (Screenshot 4) */}
          {session.phase === "shuffling" ? (
            <div className="flex min-h-[32rem] flex-col items-center justify-center text-center">
              {session.question ? (
                <div className="mb-6 rounded-xl border border-black/20 bg-surface/80 px-4 py-2 text-xs font-semibold text-muted">
                  "{session.question}"
                </div>
              ) : null}
              <ShuffleAnimation
                cardBackSrc={activeDeck.cardBackSrc}
                onReady={() => dispatch({ type: "START_SELECTING" })}
                shufflingLabel={t("shuffling")}
                readyLabel={locale === "vi" ? "Tráo Bài Hoàn Tất (Done Shuffling)" : "Done shuffling"}
              />
            </div>
          ) : null}

          {/* STEP 4: Selecting Phase with Slots & Wave Arc Fan (Screenshot 5) */}
          {session.phase === "selecting" ? (
            <div>
              {/* Question Banner */}
              {session.question ? (
                <div className="mb-6 text-center">
                  <span className="rounded-full border border-black/20 bg-surface px-4 py-1.5 font-editorial text-sm text-ink shadow-sm">
                    "{session.question}"
                  </span>
                </div>
              ) : null}

              {/* Top: Spread Slots Placeholders (Screenshot 5) */}
              <div className="rounded-[2rem] border-2 border-black bg-surface p-6 shadow-[6px_6px_0px_0px_#000]">
                <h3 className="mb-4 text-center font-editorial text-2xl text-ink">
                  {spread.name[locale]} ({session.drawnCards.length}/{spread.cardCount})
                </h3>
                <SpreadTableau
                  spread={spread}
                  drawnCards={session.drawnCards}
                  locale={locale}
                  allowReveal={false}
                  onReveal={() => undefined}
                  onDropCard={handleSelect}
                  cardBackSrc={activeDeck.cardBackSrc}
                />
              </div>

              {/* Bottom: Wave Arc Fan where cards lift vertically when hovered (Screenshot 5) */}
              <div className="mt-8 rounded-[2rem] border-2 border-black bg-surface p-4 shadow-[6px_6px_0px_0px_#000]">
                <WaveFan
                  shuffledCardIds={session.shuffledCardIds}
                  selectedCardIds={selectedIds}
                  onSelect={handleSelect}
                  cardBackSrc={activeDeck.cardBackSrc}
                  sigma={3.2}
                  maxLift={65}
                />
              </div>
            </div>
          ) : null}

          {/* STEP 5: Laid out Phase */}
          {session.phase === "laid-out" ? (
            <div>
              <div className="text-center">
                <h2 className="font-editorial text-4xl text-ink">
                  {t("readyTitle")}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
                  {t("readyBody")}
                </p>
              </div>
              <div className="mt-8">
                <SpreadTableau
                  spread={spread}
                  drawnCards={session.drawnCards}
                  locale={locale}
                  allowReveal={false}
                  onReveal={() => undefined}
                  cardBackSrc={activeDeck.cardBackSrc}
                />
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "START_REVEALING" })}
                  className="moonlight-button inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-black bg-black px-6 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000]"
                >
                  {t("beginReveal")}
                  <ArrowRightIcon size={18} weight="bold" aria-hidden />
                </button>
              </div>
            </div>
          ) : null}

          {/* STEP 6 & 7: Revealing & Completed Phase */}
          {session.phase === "revealing" || session.phase === "completed" ? (
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col gap-6">
                <SpreadTableau
                  spread={spread}
                  drawnCards={session.drawnCards}
                  locale={locale}
                  allowReveal={session.phase === "revealing"}
                  onReveal={() =>
                    dispatch({
                      type: "REVEAL_NEXT",
                    })
                  }
                  cardBackSrc={activeDeck.cardBackSrc}
                />

                {session.phase === "completed" ? (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleNewReading}
                      className="moonlight-button inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-black bg-[#e2c6ff] px-6 text-sm font-bold text-black shadow-[4px_4px_0px_0px_#000]"
                    >
                      <ArrowCounterClockwiseIcon size={18} weight="bold" />
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

              <div>
                {activeDrawnCard && activeCard && activePosition ? (
                  <InterpretationPanel
                    drawnCard={activeDrawnCard}
                    card={activeCard}
                    position={activePosition}
                    locale={locale}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
