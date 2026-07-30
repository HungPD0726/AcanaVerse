import type { SpreadDefinition } from "@/domain/tarot";

export const spreads: SpreadDefinition[] = [
  {
    slug: "daily-insight",
    name: { vi: "Thông điệp hôm nay", en: "Daily insight" },
    description: {
      vi: "Một lá để đặt lại nhịp và nhìn rõ điều đáng chú ý nhất hôm nay.",
      en: "One card to reset your pace and notice what matters most today.",
    },
    instruction: {
      vi: "Giữ một ý niệm đơn giản trong đầu rồi chọn lá khiến bạn chú ý.",
      en: "Hold one simple thought, then choose the card that draws your attention.",
    },
    cardCount: 1,
    positions: [
      {
        order: 1,
        key: "insight",
        label: { vi: "Thông điệp", en: "Insight" },
        promptHint: {
          vi: "Điều gì cần được nhìn nhận trong hôm nay?",
          en: "What deserves your attention today?",
        },
        x: 50,
        y: 50,
      },
    ],
  },
  {
    slug: "past-present-future",
    name: { vi: "Quá khứ, hiện tại, tương lai", en: "Past, present, future" },
    description: {
      vi: "Ba điểm trên cùng một đường thời gian để nhận ra điều đang chuyển động.",
      en: "Three points on one timeline to reveal what is changing.",
    },
    instruction: {
      vi: "Chọn ba lá theo nhịp tự nhiên. Mỗi lá sẽ được mở theo thứ tự.",
      en: "Choose three cards at a natural pace. They will open in order.",
    },
    cardCount: 3,
    positions: [
      {
        order: 1,
        key: "past",
        label: { vi: "Quá khứ", en: "Past" },
        promptHint: {
          vi: "Điều gì đã định hình hoàn cảnh này?",
          en: "What shaped this situation?",
        },
        x: 18,
        y: 50,
      },
      {
        order: 2,
        key: "present",
        label: { vi: "Hiện tại", en: "Present" },
        promptHint: {
          vi: "Năng lượng nào đang hiện diện?",
          en: "What energy is present now?",
        },
        x: 50,
        y: 50,
      },
      {
        order: 3,
        key: "future",
        label: { vi: "Tương lai", en: "Future" },
        promptHint: {
          vi: "Hướng đi nào đang dần mở ra?",
          en: "What direction is beginning to open?",
        },
        x: 82,
        y: 50,
      },
    ],
  },
  {
    slug: "celtic-cross",
    name: { vi: "Celtic Cross", en: "Celtic Cross" },
    description: {
      vi: "Mười vị trí để quan sát một câu hỏi từ hoàn cảnh, nội tâm đến kết quả.",
      en: "Ten positions that examine a question from context to inner life and outcome.",
    },
    instruction: {
      vi: "Dành thời gian cho từng lựa chọn. Trải bài này phù hợp với câu hỏi có nhiều lớp.",
      en: "Take your time with each choice. This spread suits layered questions.",
    },
    cardCount: 10,
    positions: [
      {
        order: 1,
        key: "present",
        label: { vi: "Hiện tại", en: "Present" },
        promptHint: {
          vi: "Trung tâm của hoàn cảnh lúc này.",
          en: "The heart of the situation now.",
        },
        x: 34,
        y: 50,
      },
      {
        order: 2,
        key: "challenge",
        label: { vi: "Thử thách", en: "Challenge" },
        promptHint: {
          vi: "Điều cản trở hoặc đòi hỏi sự chú ý.",
          en: "What crosses you or demands attention.",
        },
        x: 34,
        y: 50,
        angle: 90,
      },
      {
        order: 3,
        key: "foundation",
        label: { vi: "Nền tảng", en: "Foundation" },
        promptHint: {
          vi: "Gốc rễ sâu hơn của câu hỏi.",
          en: "The deeper root of the question.",
        },
        x: 34,
        y: 84,
      },
      {
        order: 4,
        key: "recent-past",
        label: { vi: "Quá khứ gần", en: "Recent past" },
        promptHint: {
          vi: "Điều vừa lùi lại phía sau.",
          en: "What is moving behind you.",
        },
        x: 12,
        y: 50,
      },
      {
        order: 5,
        key: "possibilities",
        label: { vi: "Khả năng", en: "Possibilities" },
        promptHint: {
          vi: "Điều có thể được nhận biết hoặc hướng tới.",
          en: "What may be known or aimed toward.",
        },
        x: 34,
        y: 16,
      },
      {
        order: 6,
        key: "near-future",
        label: { vi: "Tương lai gần", en: "Near future" },
        promptHint: {
          vi: "Điều đang tiến lại gần.",
          en: "What is approaching.",
        },
        x: 56,
        y: 50,
      },
      {
        order: 7,
        key: "self",
        label: { vi: "Bản thân", en: "Self" },
        promptHint: {
          vi: "Cách bạn đang đứng trong hoàn cảnh này.",
          en: "How you stand within this situation.",
        },
        x: 84,
        y: 84,
      },
      {
        order: 8,
        key: "environment",
        label: { vi: "Môi trường", en: "Environment" },
        promptHint: {
          vi: "Ảnh hưởng từ người khác và bối cảnh.",
          en: "Influences from others and your surroundings.",
        },
        x: 84,
        y: 62,
      },
      {
        order: 9,
        key: "hopes-fears",
        label: { vi: "Hy vọng và nỗi sợ", en: "Hopes and fears" },
        promptHint: {
          vi: "Mong muốn và lo ngại đang đan xen.",
          en: "Desires and concerns that are intertwined.",
        },
        x: 84,
        y: 38,
      },
      {
        order: 10,
        key: "outcome",
        label: { vi: "Kết quả", en: "Outcome" },
        promptHint: {
          vi: "Hướng kết quả nếu năng lượng hiện tại tiếp diễn.",
          en: "The likely direction if the current energy continues.",
        },
        x: 84,
        y: 16,
      },
    ],
  },
];

export function getSpread(slug: string) {
  return spreads.find((spread) => spread.slug === slug);
}
