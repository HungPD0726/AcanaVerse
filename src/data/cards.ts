import { majorCardSeeds, type CardSeed } from "@/data/card-seeds";
import { minorCardSeeds } from "@/data/minor-card-seeds";
import type { LocalizedText, TarotCard } from "@/domain/tarot";

const majorFilenames = [
  "RWS Tarot 00 Fool.jpg",
  "RWS Tarot 01 Magician.jpg",
  "RWS Tarot 02 High Priestess.jpg",
  "RWS Tarot 03 Empress.jpg",
  "RWS Tarot 04 Emperor.jpg",
  "RWS Tarot 05 Hierophant.jpg",
  "RWS Tarot 06 Lovers.jpg",
  "RWS Tarot 07 Chariot.jpg",
  "RWS Tarot 08 Strength.jpg",
  "RWS Tarot 09 Hermit.jpg",
  "RWS Tarot 10 Wheel of Fortune.jpg",
  "RWS Tarot 11 Justice.jpg",
  "RWS Tarot 12 Hanged Man.jpg",
  "RWS Tarot 13 Death.jpg",
  "RWS Tarot 14 Temperance.jpg",
  "RWS Tarot 15 Devil.jpg",
  "RWS Tarot 16 Tower.jpg",
  "RWS Tarot 17 Star.jpg",
  "RWS Tarot 18 Moon.jpg",
  "RWS Tarot 19 Sun.jpg",
  "RWS Tarot 20 Judgement.jpg",
  "RWS Tarot 21 World.jpg",
];

const suitFilenamePrefixes = {
  cups: "Cups",
  pentacles: "Pents",
  swords: "Swords",
  wands: "Wands",
};

function splitKeywords(vi: string, en: string): LocalizedText[] {
  const viKeywords = vi.split(",").map((keyword) => keyword.trim());
  const enKeywords = en.split(",").map((keyword) => keyword.trim());
  return viKeywords.map((keyword, index) => ({
    vi: keyword,
    en: enKeywords[index] ?? enKeywords[0],
  }));
}

function getSourceFilename(seed: CardSeed) {
  if (seed.arcana === "major") {
    return majorFilenames[seed.number ?? 0];
  }
  const prefix = suitFilenamePrefixes[seed.suit!];
  return `${prefix}${String(seed.number).padStart(2, "0")}.jpg`;
}

function toCard(seed: CardSeed): TarotCard {
  const sourceFilename = getSourceFilename(seed);
  return {
    id: `rws-${seed.slug}`,
    cardCode: seed.code,
    slug: seed.slug,
    arcana: seed.arcana,
    suit: seed.suit,
    rank: seed.rank,
    number: seed.number,
    name: { vi: seed.nameVi, en: seed.nameEn },
    upright: {
      keywords: splitKeywords(seed.upright[0], seed.upright[1]),
      meaning: { vi: seed.upright[2], en: seed.upright[3] },
    },
    reversed: {
      keywords: splitKeywords(seed.reversed[0], seed.reversed[1]),
      meaning: { vi: seed.reversed[2], en: seed.reversed[3] },
    },
    image: {
      src: `/images/cards/${seed.asset}.webp`,
      width: 480,
      height: 829,
      alt: {
        vi: `Lá bài ${seed.nameVi} trong bộ Rider-Waite-Smith`,
        en: `${seed.nameEn} card from the Rider-Waite-Smith deck`,
      },
      sourcePage: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(
        sourceFilename.replaceAll(" ", "_"),
      )}`,
      author: "Pamela Colman Smith",
      license: "Public Domain Mark 1.0",
      licenseUrl:
        "https://creativecommons.org/publicdomain/mark/1.0/",
    },
  };
}

export const tarotCards: TarotCard[] = [
  ...majorCardSeeds,
  ...minorCardSeeds,
].map(toCard);

export const tarotCardsById = new Map(
  tarotCards.map((card) => [card.id, card]),
);
