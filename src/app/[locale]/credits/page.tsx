import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

const collectionUrl =
  "https://commons.wikimedia.org/wiki/Category:Rider-Waite-Smith_tarot_deck_(TaionWC)";
const licenseUrl = "https://creativecommons.org/publicdomain/mark/1.0/";

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Credits");

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

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="rounded-panel border border-line bg-surface p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            78 / 78
          </span>
          <h2 className="mt-10 font-editorial text-3xl text-ink">
            {t("deckTitle")}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            {t("deckBody")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={collectionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-canvas focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {t("viewCollection")}
              <ArrowSquareOutIcon size={16} weight="bold" aria-hidden />
            </a>
            <a
              href={licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-medium text-ink hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {t("viewLicense")}
              <ArrowSquareOutIcon size={16} aria-hidden />
            </a>
          </div>
        </article>

        <article className="grid overflow-hidden rounded-panel border border-line bg-soft sm:grid-cols-[0.72fr_1.28fr] lg:grid-cols-1">
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
