"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { Locale } from "@/domain/tarot";

interface QuestionPromptStepProps {
  initialQuestion: string;
  onProceed: (question: string) => void;
  onSkip: () => void;
  locale: Locale;
}

const topics = [
  {
    id: "work",
    label: { vi: "CÔNG VIỆC", en: "WORK" },
    prompts: {
      vi: [
        "Bước tiếp theo trong sự nghiệp của tôi là gì?",
        "Cơ hội nào đang chờ đợi tôi trong công việc?",
        "Tôi nên chuẩn bị gì cho dự án mới?",
        "Làm sao để tôi cân bằng công việc và cuộc sống?",
      ],
      en: [
        "What's next in my career?",
        "What wants to come alive in my work?",
        "What should I know about this opportunity?",
        "What is emerging with this launch?",
      ],
    },
  },
  {
    id: "relationships",
    label: { vi: "TÌNH CẢM", en: "RELATIONSHIPS" },
    prompts: {
      vi: [
        "Năng lượng mối quan hệ hiện tại của tôi ra sao?",
        "Tôi có thể mở lòng hơn bằng cách nào?",
        "Bài học tình cảm quan trọng nhất lúc này là gì?",
        "Tôi cần buông bỏ điều gì để đón nhận tình yêu?",
      ],
      en: [
        "What is the energy of my relationship right now?",
        "How can I open my heart more deeply?",
        "What is my biggest love lesson right now?",
        "What do I need to release for love to flow?",
      ],
    },
  },
  {
    id: "life-changes",
    label: { vi: "ĐỊNH HƯỚNG", en: "LIFE CHANGES" },
    prompts: {
      vi: [
        "Hướng đi tốt nhất cho tôi lúc này là gì?",
        "Tôi đang đứng trước ngã rẽ nào?",
        "Thông điệp từ tiềm thức giúp tôi vượt qua thử thách?",
      ],
      en: [
        "What is the best direction for me right now?",
        "What crossroad am I standing at?",
        "What message does my intuition have for this change?",
      ],
    },
  },
  {
    id: "creativity",
    label: { vi: "SÁNG TẠO", en: "CREATIVITY" },
    prompts: {
      vi: [
        "Làm sao để khơi dậy nguồn cảm hứng sáng tạo?",
        "Điều gì đang cản trở dòng chảy sáng tạo của tôi?",
      ],
      en: [
        "How can I ignite my creative spark?",
        "What is blocking my creative flow right now?",
      ],
    },
  },
  {
    id: "inner-magic",
    label: { vi: "NỘI TÂM", en: "INNER MAGIC" },
    prompts: {
      vi: [
        "Sức mạnh nội tâm nào tôi chưa khai phá?",
        "Làm sao để tôi tĩnh tâm và tin vào bản thân hơn?",
      ],
      en: [
        "What hidden inner strength do I need to reclaim?",
        "How can I find inner peace and trust myself?",
      ],
    },
  },
  {
    id: "idk",
    label: { vi: "KHÔNG BIẾT", en: "IDK" },
    prompts: {
      vi: [
        "Vũ trụ có thông điệp gì dành cho tôi hôm nay?",
        "Tôi nên chú ý đến khía cạnh nào trong cuộc sống?",
      ],
      en: [
        "What general guidance does the universe have for me today?",
        "What aspect of my life needs my attention right now?",
      ],
    },
  },
];

export function QuestionPromptStep({
  initialQuestion,
  onProceed,
  onSkip,
  locale,
}: {
  initialQuestion: string;
  onProceed: (question: string) => void;
  onSkip: () => void;
  locale: Locale;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const activeTopicObj = topics.find((t) => t.id === selectedTopic);

  const handleSelectPrompt = (promptText: string) => {
    setQuestion(promptText);
    onProceed(promptText);
  };

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center text-center">
      {/* Soft Purple Ambient Radial Glow Background (Matching Screenshots 1 & 2) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300/40 blur-3xl dark:bg-purple-900/30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl px-4"
      >
        {/* Title in Whimsical Serif */}
        <h2 className="font-editorial text-5xl font-normal leading-tight text-ink sm:text-6xl">
          {selectedTopic
            ? locale === "vi"
              ? "Bạn Có Gì Trong Đầu?"
              : "Anything in mind?"
            : locale === "vi"
              ? "Đặt Câu Hỏi"
              : "Ask a question"}
        </h2>

        {/* Question Text Input Box */}
        <div className="mt-8">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && question.trim()) {
                onProceed(question);
              }
            }}
            placeholder={
              locale === "vi"
                ? "Nhập câu hỏi hoặc hoàn cảnh của bạn..."
                : "Type your question or scenario..."
            }
            className="w-full rounded-full border-2 border-black bg-surface/90 px-6 py-4 text-center text-base text-ink shadow-[4px_4px_0px_0px_#000] outline-none placeholder:text-muted focus:ring-2 focus:ring-purple-300 sm:text-lg"
          />
        </div>

        {/* Topic Suggestion Pills (Screenshot 1) */}
        {!selectedTopic && (
          <div className="mt-10">
            <p className="font-editorial text-xl italic text-muted">
              {locale === "vi" ? "Hoặc chọn chủ đề" : "Or choose a topic."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className="moonlight-button rounded-full border-2 border-black bg-surface px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-[#e2c6ff]"
                >
                  {t.label[locale]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Questions Sub-list (Screenshot 2) */}
        {selectedTopic && activeTopicObj && (
          <div className="mt-8 space-y-3">
            {activeTopicObj.prompts[locale].map((p, idx) => (
              <motion.button
                key={idx}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => handleSelectPrompt(p)}
                className="moonlight-button flex w-full items-center justify-between rounded-full border-2 border-black bg-surface/90 px-6 py-3.5 text-left text-sm font-medium text-ink shadow-[4px_4px_0px_0px_#000] transition-all hover:bg-[#e2c6ff]"
              >
                <span>{p}</span>
                <span className="text-muted">→</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Action Controls at Bottom */}
        <div className="mt-10 flex items-center justify-center gap-4">
          {question.trim() ? (
            <button
              type="button"
              onClick={() => onProceed(question)}
              className="moonlight-button rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000]"
            >
              {locale === "vi" ? "Tiếp Tục →" : "Proceed →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-semibold underline text-muted hover:text-ink"
            >
              {selectedTopic
                ? locale === "vi"
                  ? "Bỏ qua câu hỏi"
                  : "Skip question"
                : locale === "vi"
                  ? "Bỏ qua chủ đề"
                  : "Skip theme"}
            </button>
          )}

          {selectedTopic && (
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              className="text-xs font-semibold text-muted hover:text-ink"
            >
              {locale === "vi" ? "← Đổi chủ đề khác" : "← Change topic"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
