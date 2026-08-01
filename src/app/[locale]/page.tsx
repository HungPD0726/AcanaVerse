import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpreadMark } from "@/components/spread-mark";
import { spreads } from "@/data/spreads";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-6 font-editorial text-5xl font-medium leading-[0.98] tracking-[-0.035em] text-ink sm:text-7xl lg:text-[5.5rem]">
            {t("title")}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/reading/daily-insight"
              className="inline-flex min-h-12 items-center gap-3 rounded-control bg-ink px-5 text-sm font-semibold text-canvas transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {t("primaryCta")}
              <ArrowRightIcon size={17} weight="bold" aria-hidden />
            </Link>
            <a
              href="#spreads"
              className="border-b border-ink pb-1 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {t("chooseSpread")}
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] min-h-80 overflow-hidden rounded-panel border border-line bg-soft">
          <Image
            src="/images/brand/hero-editorial.webp"
            alt={t("heroAlt")}
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
            priority
          />
          <p className="absolute bottom-4 left-4 border border-line bg-surface/90 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted backdrop-blur-sm">
            {t("heroCaption")}
          </p>
        </div>
      </section>

      <section
        id="spreads"
        className="border-y border-line bg-surface scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                01 / {t("spreadEyebrow")}
              </p>
              <h2 className="mt-5 font-editorial text-4xl font-medium leading-tight tracking-[-0.02em] text-ink sm:text-5xl">
                {t("spreadsTitle")}
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
                {t("spreadsBody")}
              </p>
            </div>

            <div className="grid border-t border-line md:grid-cols-3">
              {spreads.map((spread, index) => (
                <Link
                  key={spread.slug}
                  href={`/reading/${spread.slug}`}
                  className="group relative flex min-h-80 flex-col justify-between border-b border-line px-1 py-7 transition-colors hover:bg-soft/60 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-accent md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                >
                  <div className="flex items-start justify-between gap-4 text-accent">
                    <span className="text-xs font-semibold tracking-[0.18em]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="origin-top-right transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                      <SpreadMark spread={spread} compact />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted">
                      {t("cardCount", { count: spread.cardCount })}
                    </p>
                    <h3 className="mt-3 font-editorial text-3xl font-medium leading-tight text-ink">
                      {spread.name[locale]}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted">
                      {spread.description[locale]}
                    </p>
                    <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                      {t("chooseSpread")}
                      <ArrowRightIcon
                        size={15}
                        weight="bold"
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          02 / {t("ritualEyebrow")}
        </p>
        <div className="max-w-2xl">
          <h2 className="font-editorial text-3xl font-medium text-ink sm:text-4xl">
            {t("ritualTitle")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            {t("ritualBody")}
          </p>
          <p className="mt-7 border-l border-accent pl-4 text-xs leading-5 text-muted">
            {t("ritualNote")}
          </p>
        </div>
      </section>
    </div>
  );
}
