import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import TarotAboutPage from "./page-client";

export const metadata: Metadata = {
  title: "Tarot là gì? Lịch sử & Ý nghĩa | ArcanaVerse",
  description:
    "Khám phá lịch sử 600 năm của Tarot — từ trò chơi bài quý tộc Ý thế kỷ XV đến công cụ khám phá tâm lý hiện đại. Tìm hiểu ý nghĩa của 78 lá bài và tại sao Tarot vẫn tồn tại đến ngày nay.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TarotAboutPage />;
}
