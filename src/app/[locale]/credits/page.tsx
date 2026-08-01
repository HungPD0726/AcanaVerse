import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tarotCardsById } from "@/data/cards";
import { getDeckCardImageSrc, tarotDecks } from "@/data/decks";
import type { AppLocale } from "@/i18n/routing";

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Credits");
  const previewCard = tarotCardsById.get("rws-the-sun");

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-22">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 max-w-[13ch] font-editorial text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
        {t("body")}
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {tarotDecks.map((deck) => (
          <article
            key={deck.slug}
            className="overflow-hidden rounded-panel border border-line bg-surface"
          >
            <div className="relative aspect-[5/4] border-b border-line bg-soft">
              {previewCard ? (
                <Image
                  src={getDeckCardImageSrc(deck, previewCard)}
                  alt={`${deck.name[locale]} — ${previewCard.name[locale]}`}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-contain p-5"
                />
              ) : null}
              <span className="absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
                78 / 78
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <h2 className="font-editorial text-3xl text-ink">
                {deck.name[locale]}
              </h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                {deck.artworkPeriod[locale]}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                {deck.description[locale]}
              </p>
              <p className="mt-4 text-xs leading-5 text-muted">
                {deck.artworkAuthor}
              </p>
              {deck.mappingNote ? (
                <p className="mt-3 border-l border-accent pl-3 text-xs leading-5 text-muted">
                  {deck.mappingNote[locale]}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={deck.sourcePage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded-control bg-ink px-3 text-xs font-semibold text-canvas focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {t("viewCollection")}
                  <ArrowSquareOutIcon size={14} weight="bold" aria-hidden />
                </a>
                <a
                  href={deck.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded-control border border-line px-3 text-xs font-medium text-ink hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {t("viewLicense")}
                  <ArrowSquareOutIcon size={14} aria-hidden />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5">
        <article className="grid overflow-hidden rounded-panel border border-line bg-soft sm:grid-cols-[0.72fr_1.28fr]">
          <div className="relative min-h-72 bg-surface">
            <Image
              src="/images/brand/card-back.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 38vw, 80vw"
              className="object-contain p-8"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="font-editorial text-3xl text-ink">
              {t("generatedTitle")}
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              {t("generatedBody")}
            </p>
            <p className="mt-5 border-l border-accent pl-4 text-xs leading-5 text-muted">
              {t("manifest")}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
