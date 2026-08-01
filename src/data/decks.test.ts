// @vitest-environment node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { tarotCards } from "@/data/cards";
import {
  getDeckCardImageSrc,
  tarotDecks,
  tarotDecksBySlug,
} from "@/data/decks";

describe("tarot artwork decks", () => {
  it("defines three distinct complete decks with source and license data", () => {
    expect(tarotDecks).toHaveLength(3);
    expect(new Set(tarotDecks.map((deck) => deck.slug)).size).toBe(3);
    expect(new Set(tarotDecks.map((deck) => deck.cardBackSrc)).size).toBe(3);

    for (const deck of tarotDecks) {
      expect(deck.name.vi).toBeTruthy();
      expect(deck.name.en).toBeTruthy();
      expect(deck.description.vi).toBeTruthy();
      expect(deck.description.en).toBeTruthy();
      expect(deck.artworkAuthor).toBeTruthy();
      expect(deck.sourcePage).toContain("commons.wikimedia.org");
      expect(deck.license).toContain("Public Domain");
      expect(deck.licenseUrl).toContain("publicdomain");
    }
  });

  it("resolves all 78 local face images for every deck", () => {
    for (const deck of tarotDecks) {
      const sources = tarotCards.map((card) =>
        getDeckCardImageSrc(deck, card),
      );

      expect(sources).toHaveLength(78);
      expect(new Set(sources).size).toBe(78);
      for (const source of sources) {
        expect(source.endsWith(".webp")).toBe(true);
        expect(existsSync(join(process.cwd(), "public", source))).toBe(true);
      }
    }
  });

  it("ships 78-entry manifests for both historical decks", () => {
    for (const slug of ["tarot-de-marseille", "sola-busca"]) {
      const deck = tarotDecksBySlug.get(slug);
      expect(deck?.cardFaceDirectory).toBeTruthy();

      const manifestPath = join(
        process.cwd(),
        "public",
        "images",
        "decks",
        slug,
        "license-manifest.json",
      );
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

      expect(manifest.cardCount).toBe(78);
      expect(manifest.cards).toHaveLength(78);
      expect(
        manifest.cards.every(
          (card: { sourcePage: string; license: string }) =>
            card.sourcePage.includes("commons.wikimedia.org") &&
            card.license.includes("Public Domain"),
        ),
      ).toBe(true);
    }
  });

  it("does not reuse Rider-Waite-Smith face paths for historical decks", () => {
    const sun = tarotCards.find((card) => card.slug === "the-sun");
    expect(sun).toBeTruthy();
    if (!sun) return;

    const paths = tarotDecks.map((deck) => getDeckCardImageSrc(deck, sun));
    expect(new Set(paths).size).toBe(3);
  });
});
