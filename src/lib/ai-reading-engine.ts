"use client";

import type { DrawnCard, Locale, SpreadPosition, TarotCard } from "@/domain/tarot";

export interface AIInterpretationResult {
  summary: string;
  keyThemes: string[];
  insight: string;
  reflectionQuestion: string;
  advice: string;
}

export function generateAIInterpretation({
  drawnCard,
  card,
  position,
  locale,
}: {
  drawnCard: DrawnCard;
  card: TarotCard;
  position: SpreadPosition;
  locale: Locale;
}): AIInterpretationResult {
  const isUpright = drawnCard.orientation === "upright";
  const cardMeaning = isUpright ? card.upright : card.reversed;

  if (locale === "vi") {
    return {
      summary: `Năng lượng của ${card.name.vi} (${isUpright ? "Xuôi" : "Ngược"}) tại vị trí "${position.label.vi}" phản chiếu sự chuyển hóa quan trọng.`,
      keyThemes: cardMeaning.keywords.map((k) => k.vi),
      insight: `Ở vị trí ${position.order} (${position.label.vi}), lá bài ${card.name.vi} nhấn mạnh: ${cardMeaning.meaning.vi} Hãy lưu ý năng lượng này để điều chỉnh góc nhìn và đưa ra quyết định sáng suốt nhất.`,
      reflectionQuestion: position.promptHint.vi,
      advice: `Lời khuyên dành cho bạn: Đừng ngần ngại đón nhận thông điệp này như một tấm gương phản chiếu để thấu hiểu bản thân hơn.`,
    };
  }

  return {
    summary: `The energy of ${card.name.en} (${isUpright ? "Upright" : "Reversed"}) in the "${position.label.en}" position reveals an essential transformation.`,
    keyThemes: cardMeaning.keywords.map((k) => k.en),
    insight: `In position ${position.order} (${position.label.en}), ${card.name.en} highlights: ${cardMeaning.meaning.en} Mindfully integrate this wisdom to navigate your next step.`,
    reflectionQuestion: position.promptHint.en,
    advice: `Guidance for you: Embrace this perspective as a clear mirror for self-awareness and quiet wisdom.`,
  };
}
