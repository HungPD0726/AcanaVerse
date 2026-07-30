import { getTranslations, setRequestLocale } from "next-intl/server";
import { DeckExplorer } from "@/components/decks/deck-explorer";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    title: `${locale === "vi" ? "Thư Viện Bài Digital Decks" : "Digital Tarot Decks"} | ArcanaVerse`,
    description: t("subtitle"),
  };
}

export default async function DecksPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DeckExplorer />;
}
