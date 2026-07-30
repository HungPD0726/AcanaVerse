import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ReadingExperience } from "@/components/reading/reading-experience";
import { getSpread, spreads } from "@/data/spreads";
import type { AppLocale } from "@/i18n/routing";
import { createReadingSession } from "@/lib/reading-engine";

export function generateStaticParams() {
  return spreads.map((spread) => ({ spreadSlug: spread.slug }));
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; spreadSlug: string }>;
}) {
  const { locale, spreadSlug } = await params;
  setRequestLocale(locale);
  const spread = getSpread(spreadSlug);
  if (!spread) {
    notFound();
  }

  return (
    <ReadingExperience
      spread={spread}
      initialSession={createReadingSession(spread, locale)}
    />
  );
}
