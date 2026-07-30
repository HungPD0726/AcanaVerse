import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DailyCardWidget } from "@/components/home/daily-card-widget";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SpreadMark } from "@/components/spread-mark";
import { MarqueeTicker } from "@/components/ui/marquee-ticker";
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
  const featured = spreads[1];
  const smaller = [spreads[0], spreads[2]];

  return (
    <div className="bg-moonlight-grid relative min-h-screen">
      <AppSidebar />

      {/* Hero Section (Matching Screenshot 1) */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="moonlight-shadow relative overflow-hidden rounded-[2.5rem] bg-surface p-6 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            {/* Left Arch Portal Artwork - Fan of real tarot cards */}
            <div className="moonlight-arch-portal relative flex h-72 w-full items-center justify-center overflow-hidden border-2 border-black bg-[#a5d8e6] shadow-[4px_4px_0px_0px_#000] sm:h-96">
              {/* 3-card fan spread */}
              <div className="relative flex items-end justify-center" style={{ height: "220px", width: "200px" }}>
                <div className="absolute bottom-0" style={{ left: "0px", transform: "rotate(-18deg)", transformOrigin: "bottom center", zIndex: 1 }}>
                  <div className="relative h-44 w-28 overflow-hidden rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
                    <Image src="/images/cards/the-star.webp" alt="The Star" fill sizes="120px" className="object-cover" priority />
                  </div>
                </div>
                <div className="absolute bottom-0" style={{ left: "40px", transform: "rotate(0deg)", transformOrigin: "bottom center", zIndex: 2 }}>
                  <div className="relative h-52 w-32 overflow-hidden rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                    <Image src="/images/cards/the-moon.webp" alt="The Moon" fill sizes="140px" className="object-cover" priority />
                  </div>
                </div>
                <div className="absolute bottom-0" style={{ left: "88px", transform: "rotate(18deg)", transformOrigin: "bottom center", zIndex: 1 }}>
                  <div className="relative h-44 w-28 overflow-hidden rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
                    <Image src="/images/cards/the-sun.webp" alt="The Sun" fill sizes="120px" className="object-cover" priority />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Text & Buttons */}
            <div>
              <span className="rounded-full border-2 border-black bg-purple-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                ✨ {t("eyebrow")}
              </span>
              <h1 className="mt-5 font-editorial text-5xl font-normal tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Do tarot anywhere
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-muted sm:text-lg">
                {t("subtitle")}
              </p>

              {/* 3 Hard Offset Shadow Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/reading/daily-insight"
                  className="moonlight-button inline-flex min-h-12 items-center gap-2 rounded-full bg-[#e2c6ff] px-6 text-sm font-bold text-black"
                >
                  {t("primaryCta")}
                  <ArrowRightIcon size={18} weight="bold" aria-hidden />
                </Link>

                <Link
                  href="/decks"
                  className="moonlight-button inline-flex min-h-12 items-center gap-2 rounded-full bg-surface px-6 text-sm font-bold text-black"
                >
                  Digital Decks
                </Link>

                <Link
                  href="/credits"
                  className="moonlight-button inline-flex min-h-12 items-center gap-2 rounded-full bg-surface px-6 text-sm font-bold text-black"
                >
                  {t("secondaryCta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Spreads & Daily Card Ritual */}
      <section id="spreads" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
          <div className="max-w-xl">
            <span className="rounded-full border-2 border-black bg-amber-200 px-3 py-1 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_0px_#000]">
              01 • Spreads
            </span>
            <h2 className="mt-5 font-editorial text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              {t("spreadsTitle")}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              {t("spreadsBody")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.12fr_0.88fr]">
            <Link
              href={`/reading/${featured.slug}`}
              className="moonlight-shadow group flex min-h-[24rem] flex-col justify-between rounded-[2rem] bg-canvas p-6 transition-all sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 text-accent">
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  02
                </span>
                <SpreadMark spread={featured} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">
                  {t("cardCount", { count: featured.cardCount })}
                </p>
                <h3 className="mt-2 font-editorial text-4xl leading-tight text-ink">
                  {featured.name[locale]}
                </h3>
                <p className="mt-3 text-xs leading-5 text-muted">
                  {featured.description[locale]}
                </p>
                <span className="moonlight-button mt-6 inline-flex items-center gap-2 rounded-full bg-purple-200 px-4 py-2 text-xs font-bold text-black">
                  {t("chooseSpread")}
                  <ArrowRightIcon size={15} weight="bold" />
                </span>
              </div>
            </Link>

            <div className="grid gap-4">
              {smaller.map((spread, index) => (
                <Link
                  key={spread.slug}
                  href={`/reading/${spread.slug}`}
                  className="moonlight-shadow group flex min-h-44 flex-col justify-between rounded-[1.5rem] bg-surface p-5 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 text-accent">
                    <span className="text-xs font-bold uppercase tracking-[0.18em]">
                      0{index + 3}
                    </span>
                    <SpreadMark spread={spread} compact />
                  </div>
                  <div>
                    <p className="text-[0.7rem] text-muted">
                      {t("cardCount", { count: spread.cardCount })}
                    </p>
                    <h3 className="mt-1 font-editorial text-2xl text-ink">
                      {spread.name[locale]}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <DailyCardWidget />
      </section>

      {/* Section 3: "Our journey" (Matching Screenshot 2) */}
      <section className="mt-16 border-y-2 border-black bg-[#f3c498] py-16 text-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <h2 className="font-editorial text-5xl font-normal leading-tight tracking-tight sm:text-6xl">
              Our journey
            </h2>
            <p className="mt-4 font-editorial text-2xl font-medium leading-relaxed">
              We build beautiful technology to support 21st century tarot.
            </p>
            <p className="mt-4 text-sm leading-6 opacity-90">
              ArcanaVerse builds solutions for tarot enthusiasts with a trusted suite of tools and services to expand tarot into a practice that's approachable, playful, inspiring, and deeply integrated into our modern world.
            </p>
            <Link
              href="/reading/daily-insight"
              className="moonlight-button mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
            >
              Start your journey
            </Link>
          </div>

          <div className="moonlight-shadow relative flex h-96 items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#fbf5eb] p-6">
            <div className="relative h-80 w-52 overflow-hidden rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Image
                src="/images/cards/temperance.webp"
                alt="Temperance Tarot Card"
                fill
                sizes="250px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: "New forms of visual storytelling" (Matching Screenshot 3) */}
      <section className="bg-[#e2c6ff] py-18 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="moonlight-shadow rounded-[2.5rem] bg-black p-8 text-white sm:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-editorial text-5xl font-normal leading-tight tracking-tight sm:text-6xl">
                  New forms of visual storytelling
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 opacity-80 sm:text-base">
                  Tarot is like a role-playing game, where you map out scenarios in your own life. Every session is a conversation between you, the cards, and the evocative artwork.
                </p>
                <Link
                  href="/reading/past-present-future"
                  className="moonlight-button mt-8 inline-flex items-center gap-2 rounded-full bg-[#f3c498] px-6 py-3 text-sm font-bold text-black"
                >
                  <SparkleIcon size={18} weight="bold" />
                  Explore readings
                </Link>
              </div>

              <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white/20 bg-white/5 p-6 backdrop-blur-md sm:h-96">
                {/* 2-card display */}
                <div className="relative flex gap-4 items-end">
                  <div className="relative h-56 w-36 rotate-[-6deg] overflow-hidden rounded-lg border-2 border-white/80 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                    <Image src="/images/cards/the-hermit.webp" alt="The Hermit" fill sizes="160px" className="rounded-lg object-cover" />
                  </div>
                  <div className="relative h-64 w-40 rotate-[4deg] overflow-hidden rounded-lg border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
                    <Image src="/images/cards/the-high-priestess.webp" alt="The High Priestess" fill sizes="180px" className="rounded-lg object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Marquee Ticker */}
      <MarqueeTicker />
    </div>
  );
}
