// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { getSpread } from "@/data/spreads";
import {
  createDrawnCard,
  createReadingSession,
  readingReducer,
  restoreSession,
  serializeSession,
} from "@/lib/reading-engine";

const spread = getSpread("past-present-future")!;
const uprightRandom = { nextUint32: () => 2 };
const reversedRandom = { nextUint32: () => 3 };

describe("reading state machine", () => {
  it("moves through setup, shuffle, selection and sequential reveal", () => {
    let state = createReadingSession(spread, "vi");
    state = readingReducer(state, {
      type: "SET_QUESTION",
      question: "Điều gì cần được nhìn rõ?",
    });
    expect(state.question).toBe("Điều gì cần được nhìn rõ?");

    state = readingReducer(state, {
      type: "START_SHUFFLE",
      shuffledCardIds: ["a", "b", "c"],
    });
    expect(state.phase).toBe("shuffling");
    state = readingReducer(state, { type: "START_SELECTING" });
    expect(state.phase).toBe("selecting");

    for (const cardId of ["a", "b", "c"]) {
      state = readingReducer(state, {
        type: "SELECT_CARD",
        drawnCard: createDrawnCard(
          cardId,
          spread,
          state.drawnCards.length,
          reversedRandom,
        ),
        cardCount: spread.cardCount,
      });
    }
    expect(state.phase).toBe("laid-out");
    expect(state.drawnCards.every((card) => card.orientation === "reversed")).toBe(
      true,
    );

    state = readingReducer(state, { type: "START_REVEALING" });
    expect(state.phase).toBe("revealing");
    state = readingReducer(state, { type: "REVEAL_NEXT" });
    expect(state.drawnCards.map((card) => card.isRevealed)).toEqual([
      true,
      false,
      false,
    ]);
    state = readingReducer(state, { type: "REVEAL_NEXT" });
    state = readingReducer(state, { type: "REVEAL_NEXT" });
    expect(state.phase).toBe("completed");
    expect(state.completedAt).toBeTruthy();
  });

  it("rejects duplicate and over-limit selections without changing orientation", () => {
    let state = createReadingSession(spread, "en");
    state = readingReducer(state, {
      type: "START_SHUFFLE",
      shuffledCardIds: ["a", "b", "c", "d"],
    });
    state = readingReducer(state, { type: "START_SELECTING" });
    const first = createDrawnCard("a", spread, 0, uprightRandom);
    state = readingReducer(state, {
      type: "SELECT_CARD",
      drawnCard: first,
      cardCount: 3,
    });
    const duplicateState = readingReducer(state, {
      type: "SELECT_CARD",
      drawnCard: { ...first, orientation: "reversed" },
      cardCount: 3,
    });
    expect(duplicateState).toBe(state);
    expect(duplicateState.drawnCards[0].orientation).toBe("upright");

    for (const cardId of ["b", "c"]) {
      state = readingReducer(state, {
        type: "SELECT_CARD",
        drawnCard: createDrawnCard(
          cardId,
          spread,
          state.drawnCards.length,
          uprightRandom,
        ),
        cardCount: 3,
      });
    }
    const fullState = readingReducer(state, {
      type: "SELECT_CARD",
      drawnCard: {
        cardId: "d",
        positionKey: "future",
        positionOrder: 3,
        orientation: "reversed",
        isRevealed: false,
      },
      cardCount: 3,
    });
    expect(fullState).toBe(state);
    expect(fullState.drawnCards).toHaveLength(3);
  });

  it("caps questions and restores only compatible versioned sessions", () => {
    let state = createReadingSession(spread, "vi");
    state = readingReducer(state, {
      type: "SET_QUESTION",
      question: "a".repeat(2_050),
    });
    expect(state.question).toHaveLength(2_000);
    expect(
      restoreSession(serializeSession(state), "past-present-future"),
    ).toEqual(state);
    expect(restoreSession(serializeSession(state), "daily-insight")).toBeNull();
    expect(restoreSession("not-json", "past-present-future")).toBeNull();
  });

  it("assigns orientation exactly once when the card is created", () => {
    const nextUint32 = vi.fn(() => 3);
    const random = { nextUint32 };
    const drawn = createDrawnCard("card-a", spread, 0, random);
    expect(drawn.orientation).toBe("reversed");
    expect(nextUint32).toHaveBeenCalledTimes(1);
    const state = {
      ...createReadingSession(spread, "en"),
      phase: "selecting" as const,
    };
    const selected = readingReducer(state, {
      type: "SELECT_CARD",
      drawnCard: drawn,
      cardCount: 3,
    });
    expect(selected.drawnCards[0]).toBe(drawn);
    expect(nextUint32).toHaveBeenCalledTimes(1);
  });
});
