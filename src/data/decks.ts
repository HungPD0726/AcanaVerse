import type { TarotCard, TarotDeckDefinition } from "@/domain/tarot";

const publicDomainUrl =
  "https://creativecommons.org/publicdomain/mark/1.0/";

export const tarotDecks: TarotDeckDefinition[] = [
  {
    slug: "rws-classic",
    name: {
      vi: "Rider-Waite-Smith Cổ Điển",
      en: "Classic Rider-Waite-Smith",
    },
    description: {
      vi: "Bộ bài Tarot truyền thống 78 lá mang tính biểu tượng nhất với các biểu tượng cổ xưa sâu sắc.",
      en: "The most iconic traditional 78-card Tarot deck filled with rich esoteric symbolism.",
    },
    cardBackSrc: "/images/brand/card-back.webp",
    artworkAuthor: "Pamela Colman Smith",
    artworkPeriod: {
      vi: "Xuất bản năm 1910",
      en: "Published in 1910",
    },
    sourcePage:
      "https://commons.wikimedia.org/wiki/Category:Rider-Waite-Smith_tarot_deck_(TaionWC)",
    license: "Public Domain Mark 1.0",
    licenseUrl: publicDomainUrl,
    badgeText: {
      vi: "Mặc định",
      en: "Classic",
    },
    accentColor: "#536b54",
    cardBorderClass: "border-line",
    auraGlowClass: "rgba(169, 188, 164, 0.5)",
    frameOverlayClass: "border border-amber-900/20",
  },
  {
    slug: "tarot-de-marseille",
    name: {
      vi: "Tarot de Marseille",
      en: "Tarot de Marseille",
    },
    description: {
      vi: "Mộc bản Pháp cổ điển, màu phẳng đậm và biểu tượng trực diện — một ngôn ngữ thị giác hoàn toàn khác Rider-Waite-Smith.",
      en: "Historic French woodcut imagery with bold flat color and direct symbolism—a visual language distinct from Rider-Waite-Smith.",
    },
    cardBackSrc: "/images/brand/card-back-celestial.webp",
    cardFaceDirectory: "/images/decks/tarot-de-marseille",
    artworkAuthor: "Traditional Tarot de Marseille artwork",
    artworkPeriod: {
      vi: "Truyền thống thế kỷ 17–18",
      en: "17th–18th century tradition",
    },
    sourcePage:
      "https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_(Single_Cards)",
    license: "Public Domain Mark 1.0",
    licenseUrl: publicDomainUrl,
    mappingNote: {
      vi: "Justice VIII và Strength XI được ghép theo đúng danh tính lịch sử của Marseille.",
      en: "Justice VIII and Strength XI are matched to their historical Marseille identities.",
    },
    badgeText: {
      vi: "Mộc bản Pháp",
      en: "French woodcut",
    },
    accentColor: "#a87332",
    cardBorderClass: "border-amber-500/40",
    auraGlowClass: "rgba(168, 115, 50, 0.48)",
    frameOverlayClass: "border-2 border-amber-700/45",
  },
  {
    slug: "sola-busca",
    name: {
      vi: "Sola Busca",
      en: "Sola Busca",
    },
    description: {
      vi: "Bộ bài Phục Hưng Ý khoảng năm 1491, nổi bật với nhân vật cổ điển và đủ hình minh họa cho cả 78 lá.",
      en: "An Italian Renaissance deck from around 1491, known for classical figures and fully illustrated imagery across all 78 cards.",
    },
    cardBackSrc: "/images/brand/card-back-moonlight.webp",
    cardFaceDirectory: "/images/decks/sola-busca",
    artworkAuthor:
      "Sola Busca, attributed to Nicola di Maestro Antonio d'Ancona",
    artworkPeriod: {
      vi: "Khoảng năm 1491",
      en: "Circa 1491",
    },
    sourcePage:
      "https://commons.wikimedia.org/wiki/Category:Sola-Busca_tarot_deck",
    license: "Public Domain Mark 1.0",
    licenseUrl: publicDomainUrl,
    mappingNote: {
      vi: "Các lá được ghép theo cấu trúc 78 vị trí lịch sử; hình và tên Ẩn chính của Sola Busca khác hệ Rider-Waite-Smith.",
      en: "Cards use historical 78-position correspondence; Sola Busca trump imagery and names differ from Rider-Waite-Smith.",
    },
    badgeText: {
      vi: "Phục Hưng Ý",
      en: "Italian Renaissance",
    },
    accentColor: "#7c6b8d",
    cardBorderClass: "border-violet-400/35",
    auraGlowClass: "rgba(124, 107, 141, 0.48)",
    frameOverlayClass: "border-2 border-violet-300/45",
  },
];

export const tarotDecksBySlug = new Map(
  tarotDecks.map((deck) => [deck.slug, deck]),
);

export const defaultDeck = tarotDecks[0];

export function getDeckCardImageSrc(
  deck: TarotDeckDefinition,
  card: TarotCard,
) {
  return deck.cardFaceDirectory
    ? `${deck.cardFaceDirectory}/${card.slug}.webp`
    : card.image.src;
}
