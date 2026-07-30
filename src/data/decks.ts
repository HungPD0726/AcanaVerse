import type { TarotDeckDefinition } from "@/domain/tarot";

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
    badgeText: {
      vi: "Mặc định",
      en: "Classic",
    },
    accentColor: "#536b54",
    cardBorderClass: "border-line",
    auraGlowClass: "rgba(169, 188, 164, 0.5)",
    frontImageFilter: "none",
    frameOverlayClass: "border border-amber-900/20",
  },
  {
    slug: "celestial-mystic",
    name: {
      vi: "Arcana Celestial (Vũ Trụ Ánh Kim)",
      en: "Celestial Arcana (Cosmic Edition)",
    },
    description: {
      vi: "Bộ bài mang năng lượng chòm sao vũ trụ lung linh với tông màu vàng kim và hoàng hôn tím mộng mơ.",
      en: "A luminous cosmic deck imbued with starlight energy, gold accents, and deep mystical vision.",
    },
    cardBackSrc: "/images/brand/card-back-celestial.webp",
    badgeText: {
      vi: "Nổi bật ✨",
      en: "Featured ✨",
    },
    accentColor: "#d4af37",
    cardBorderClass: "border-amber-500/40",
    auraGlowClass: "rgba(212, 175, 55, 0.6)",
    frontImageFilter: "brightness(1.08) contrast(1.15) saturate(1.25) sepia(0.2)",
    frameOverlayClass: "border-2 border-amber-400/80 shadow-[0_0_18px_rgba(212,175,55,0.4)]",
  },
  {
    slug: "ethereal-moonlight",
    name: {
      vi: "Ethereal Moonlight (Ánh Trăng Huyền Ảo)",
      en: "Ethereal Moonlight (Moonlit Edition)",
    },
    description: {
      vi: "Bộ bài mang năng lượng ánh trăng xanh bạc dịu mát giúp làm dịu tâm trí và đánh thức trực giác.",
      en: "A serene silver-blue moonlit deck designed to calm the mind and awaken deep intuitive foresight.",
    },
    cardBackSrc: "/images/brand/card-back-moonlight.webp",
    badgeText: {
      vi: "Trực giác 🌙",
      en: "Intuitive 🌙",
    },
    accentColor: "#7eb0d5",
    cardBorderClass: "border-sky-400/40",
    auraGlowClass: "rgba(126, 176, 213, 0.6)",
    frontImageFilter: "brightness(1.05) contrast(1.1) hue-rotate(185deg) saturate(1.35)",
    frameOverlayClass: "border-2 border-sky-300/80 shadow-[0_0_18px_rgba(126,176,213,0.5)]",
  },
];

export const tarotDecksBySlug = new Map(
  tarotDecks.map((deck) => [deck.slug, deck]),
);

export const defaultDeck = tarotDecks[0];
