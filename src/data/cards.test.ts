// @vitest-environment node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { tarotCards } from "@/data/cards";

describe("tarot card catalogue", () => {
  it("contains the complete 78 card deck", () => {
    expect(tarotCards).toHaveLength(78);
    expect(tarotCards.filter((card) => card.arcana === "major")).toHaveLength(
      22,
    );
    expect(tarotCards.filter((card) => card.arcana === "minor")).toHaveLength(
      56,
    );
  });

  it.each(["wands", "cups", "swords", "pentacles"] as const)(
    "contains 14 %s cards",
    (suit) => {
      expect(tarotCards.filter((card) => card.suit === suit)).toHaveLength(14);
    },
  );

  it("uses unique public identities", () => {
    expect(new Set(tarotCards.map((card) => card.id)).size).toBe(78);
    expect(new Set(tarotCards.map((card) => card.slug)).size).toBe(78);
    expect(new Set(tarotCards.map((card) => card.cardCode)).size).toBe(78);
  });

  it("has bilingual meanings, keywords, local artwork and license data", () => {
    for (const card of tarotCards) {
      expect(card.name.vi).toBeTruthy();
      expect(card.name.en).toBeTruthy();
      expect(card.upright.keywords.length).toBeGreaterThanOrEqual(1);
      expect(card.reversed.keywords.length).toBeGreaterThanOrEqual(1);
      for (const keyword of [
        ...card.upright.keywords,
        ...card.reversed.keywords,
      ]) {
        expect(keyword.vi).toBeTruthy();
        expect(keyword.en).toBeTruthy();
      }
      expect(card.upright.meaning.vi).toBeTruthy();
      expect(card.upright.meaning.en).toBeTruthy();
      expect(card.reversed.meaning.vi).toBeTruthy();
      expect(card.reversed.meaning.en).toBeTruthy();
      expect(card.image.src.startsWith("/images/cards/")).toBe(true);
      expect(
        existsSync(join(process.cwd(), "public", card.image.src)),
      ).toBe(true);
      expect(card.image.sourcePage).toContain("commons.wikimedia.org");
      expect(card.image.author).toBe("Pamela Colman Smith");
      expect(card.image.license).toContain("Public Domain");
      expect(card.image.licenseUrl).toContain("publicdomain");
    }
  });
});
