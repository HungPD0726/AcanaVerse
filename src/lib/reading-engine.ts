import type {
  DrawnCard,
  Locale,
  ReadingSession,
  SpreadDefinition,
} from "@/domain/tarot";
import { randomOrientation, shuffle, type RandomSource } from "@/lib/random";

export const SESSION_STORAGE_KEY = "arcana-reading-v1";

export type ReadingAction =
  | { type: "SET_QUESTION"; question: string }
  | { type: "SET_DECK"; deckSlug: string }
  | { type: "SET_SPREAD"; spreadSlug: SpreadDefinition["slug"] }
  | { type: "START_SHUFFLE"; shuffledCardIds: string[] }
  | { type: "START_SELECTING" }
  | { type: "SELECT_CARD"; drawnCard: DrawnCard; cardCount: number }
  | { type: "START_REVEALING" }
  | { type: "REVEAL_NEXT" }
  | { type: "CHANGE_LOCALE"; locale: Locale }
  | { type: "RESET"; session: ReadingSession };

export function createReadingSession(
  spread: SpreadDefinition,
  locale: Locale,
): ReadingSession {
  return {
    version: 1,
    id: crypto.randomUUID(),
    locale,
    spreadSlug: spread.slug,
    deckSlug: "rws-classic",
    question: "",
    phase: "setup",
    shuffledCardIds: [],
    drawnCards: [],
    startedAt: new Date().toISOString(),
  };
}

export function prepareShuffle(
  cardIds: readonly string[],
  random?: RandomSource,
) {
  return shuffle(cardIds, random);
}

export function createDrawnCard(
  cardId: string,
  spread: SpreadDefinition,
  drawnCount: number,
  random?: RandomSource,
): DrawnCard {
  const position = spread.positions[drawnCount];
  if (!position) {
    throw new Error("Spread has no remaining position");
  }

  return {
    cardId,
    positionKey: position.key,
    positionOrder: position.order,
    orientation: randomOrientation(random),
    isRevealed: false,
  };
}

export function readingReducer(
  state: ReadingSession,
  action: ReadingAction,
): ReadingSession {
  switch (action.type) {
    case "SET_QUESTION":
      return state.phase === "setup"
        ? { ...state, question: action.question.slice(0, 2_000) }
        : state;
    case "SET_DECK":
      return state.phase === "setup"
        ? { ...state, deckSlug: action.deckSlug }
        : state;
    case "SET_SPREAD":
      return state.phase === "setup"
        ? { ...state, spreadSlug: action.spreadSlug }
        : state;
    case "START_SHUFFLE":
      return {
        ...state,
        phase: "shuffling",
        shuffledCardIds: action.shuffledCardIds,
        drawnCards: [],
        completedAt: undefined,
      };
    case "START_SELECTING":
      return state.phase === "shuffling"
        ? { ...state, phase: "selecting" }
        : state;
    case "SELECT_CARD": {
      if (
        state.phase !== "selecting" ||
        state.drawnCards.length >= action.cardCount ||
        state.drawnCards.some((card) => card.cardId === action.drawnCard.cardId)
      ) {
        return state;
      }
      const drawnCards = [...state.drawnCards, action.drawnCard];
      return {
        ...state,
        drawnCards,
        phase:
          drawnCards.length === action.cardCount ? "laid-out" : "selecting",
      };
    }
    case "START_REVEALING":
      return state.phase === "laid-out"
        ? { ...state, phase: "revealing" }
        : state;
    case "REVEAL_NEXT": {
      if (state.phase !== "revealing") {
        return state;
      }
      const nextIndex = state.drawnCards.findIndex((card) => !card.isRevealed);
      if (nextIndex === -1) {
        return state;
      }
      const drawnCards = state.drawnCards.map((card, index) =>
        index === nextIndex ? { ...card, isRevealed: true } : card,
      );
      const completed = drawnCards.every((card) => card.isRevealed);
      return {
        ...state,
        drawnCards,
        phase: completed ? "completed" : "revealing",
        completedAt: completed ? new Date().toISOString() : undefined,
      };
    }
    case "CHANGE_LOCALE":
      return { ...state, locale: action.locale };
    case "RESET":
      return action.session;
  }
}

export function serializeSession(session: ReadingSession) {
  return JSON.stringify(session);
}

export function restoreSession(
  value: string | null,
  spreadSlug: SpreadDefinition["slug"],
): ReadingSession | null {
  if (!value) {
    return null;
  }

  try {
    const session = JSON.parse(value) as ReadingSession;
    if (
      session.version !== 1 ||
      session.spreadSlug !== spreadSlug ||
      !Array.isArray(session.shuffledCardIds) ||
      !Array.isArray(session.drawnCards)
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
