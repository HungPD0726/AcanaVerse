"use client";

import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { useLocale } from "next-intl";
import { tarotCardsById } from "@/data/cards";
import type { DrawnCard, Locale, SpreadDefinition } from "@/domain/tarot";

export function ExportReadingCard({
  spread,
  drawnCards,
  question,
}: {
  spread: SpreadDefinition;
  drawnCards: DrawnCard[];
  question?: string;
}) {
  const locale = useLocale() as Locale;

  const handleDownloadImage = () => {
    // Generate simple SVG/Canvas card graphic for sharing
    const width = 600;
    const height = 800;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0d0e15");
    grad.addColorStop(1, "#181a24");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Brand Title
    ctx.fillStyle = "#c5a059";
    ctx.font = "600 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ARCANA VERSE", width / 2, 75);

    // Spread Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px serif";
    ctx.fillText(spread.name[locale].toUpperCase(), width / 2, 120);

    // Question
    if (question) {
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "italic 16px sans-serif";
      ctx.fillText(`"${question}"`, width / 2, 160);
    }

    // Render Drawn Cards List
    drawnCards.forEach((drawnCard, index) => {
      const card = tarotCardsById.get(drawnCard.cardId);
      const position = spread.positions[index];
      const y = 230 + index * 110;

      // Card slot box
      ctx.fillStyle = "#1e202e";
      ctx.fillRect(60, y, width - 120, 90);
      ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(60, y, width - 120, 90);

      // Number badge
      ctx.fillStyle = "#c5a059";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`0${index + 1}. ${position?.label[locale] ?? ""}`, 80, y + 35);

      // Card Name & Orientation
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px serif";
      ctx.fillText(
        `${card?.name[locale] ?? ""} (${
          drawnCard.orientation === "upright"
            ? locale === "vi"
              ? "Xuôi"
              : "Upright"
            : locale === "vi"
              ? "Ngược"
              : "Reversed"
        })`,
        80,
        y + 68,
      );
    });

    // Footer
    ctx.fillStyle = "#71717a";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("arcanaverse.app • Bắt Đầu Khoảng Lặng", width / 2, height - 50);

    // Trigger Download
    const link = document.createElement("a");
    link.download = `arcana-reading-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <button
      type="button"
      onClick={handleDownloadImage}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-accent/40 bg-accent-soft/20 px-4 text-xs font-semibold text-accent transition-all hover:bg-accent-soft/50 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <DownloadSimpleIcon size={16} weight="bold" />
      {locale === "vi" ? "Tải Ảnh Quẻ Bài Kỷ Niệm" : "Export Reading Card Image"}
    </button>
  );
}
