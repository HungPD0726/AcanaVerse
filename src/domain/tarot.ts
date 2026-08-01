export type Locale = "vi" | "en";
export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Orientation = "upright" | "reversed";
export type ReadingPhase =
  | "setup"
  | "shuffling"
  | "selecting"
  | "laid-out"
  | "revealing"
  | "completed";

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface OrientationContent {
  keywords: LocalizedText[];
  meaning: LocalizedText;
}

export interface CardImage {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
  sourcePage: string;
  author: string;
  license: string;
  licenseUrl: string;
}

export interface TarotCard {
  id: string;
  cardCode: string;
  slug: string;
  arcana: Arcana;
  suit?: Suit;
  rank?: string;
  number?: number;
  name: LocalizedText;
  upright: OrientationContent;
  reversed: OrientationContent;
  image: CardImage;
}

export interface SpreadPosition {
  order: number;
  key: string;
  label: LocalizedText;
  promptHint: LocalizedText;
  x: number;
  y: number;
  angle?: number;
}

export interface SpreadDefinition {
  slug: "daily-insight" | "past-present-future" | "celtic-cross";
  name: LocalizedText;
  description: LocalizedText;
  instruction: LocalizedText;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  cardId: string;
  positionKey: string;
  positionOrder: number;
  orientation: Orientation;
  isRevealed: boolean;
}

export interface TarotDeckDefinition {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  cardBackSrc: string;
  cardFaceDirectory?: string;
  artworkAuthor: string;
  artworkPeriod: LocalizedText;
  sourcePage: string;
  license: string;
  licenseUrl: string;
  mappingNote?: LocalizedText;
  badgeText?: LocalizedText;
  accentColor: string;
  cardBorderClass?: string;
  auraGlowClass?: string;
  frameOverlayClass?: string;
}

export interface ReadingSession {
  version: 1;
  id: string;
  locale: Locale;
  spreadSlug: SpreadDefinition["slug"];
  deckSlug: string;
  question: string;
  phase: ReadingPhase;
  shuffledCardIds: string[];
  drawnCards: DrawnCard[];
  startedAt: string;
  completedAt?: string;
}

export interface DemoUser {
  email: string;
  displayName: string;
  locale: Locale;
}
