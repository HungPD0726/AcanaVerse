// @vitest-environment node

import { describe, expect, it } from "vitest";
import { spreads } from "@/data/spreads";

describe("spread definitions", () => {
  it("maps all three spread sizes and positions", () => {
    expect(spreads.map((spread) => spread.cardCount)).toEqual([1, 3, 10]);
    for (const spread of spreads) {
      expect(spread.positions).toHaveLength(spread.cardCount);
      expect(spread.positions.map((position) => position.order)).toEqual(
        Array.from({ length: spread.cardCount }, (_, index) => index + 1),
      );
      expect(new Set(spread.positions.map((position) => position.key)).size).toBe(
        spread.cardCount,
      );
      for (const position of spread.positions) {
        expect(position.label.vi).toBeTruthy();
        expect(position.label.en).toBeTruthy();
        expect(position.promptHint.vi).toBeTruthy();
        expect(position.promptHint.en).toBeTruthy();
        expect(position.x).toBeGreaterThanOrEqual(0);
        expect(position.x).toBeLessThanOrEqual(100);
        expect(position.y).toBeGreaterThanOrEqual(0);
        expect(position.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("uses the canonical Celtic Cross position order", () => {
    const celtic = spreads.find((spread) => spread.slug === "celtic-cross");
    expect(celtic?.positions.map((position) => position.key)).toEqual([
      "present",
      "challenge",
      "foundation",
      "recent-past",
      "possibilities",
      "near-future",
      "self",
      "environment",
      "hopes-fears",
      "outcome",
    ]);
  });
});
