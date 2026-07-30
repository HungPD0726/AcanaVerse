"use client";

import { useState, useEffect } from "react";
import {
  ArrowSquareOutIcon,
  CardsThreeIcon,
  MoonIcon,
  SignInIcon,
  SpeakerHighIcon,
  SpeakerSimpleSlashIcon,
  SunIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { audioEngine } from "@/lib/audio-engine";

import { JournalDrawer } from "@/components/journal/journal-drawer";

export function SiteHeader() {
  const t = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const nextLocale: AppLocale = locale === "vi" ? "en" : "vi";
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isReady } = useAuth();
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    setIsAudioActive(!audioEngine.getIsMuted());
  }, []);

  const handleToggleAudio = () => {
    const active = audioEngine.toggleMute();
    setIsAudioActive(active);
    if (active) {
      audioEngine.playFlipSound();
    }
  };

  return (
    <header className="sticky top-0 z-header border-b-2 border-black bg-surface/92 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-editorial text-2xl font-bold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {t("brand")}
        </Link>

        <nav
          aria-label={t("home")}
          className="flex items-center gap-1.5 sm:gap-3"
        >
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isAudioActive ? "Tắt âm thanh" : "Bật âm thanh"}
            title={isAudioActive ? "Âm thanh: Bật" : "Âm thanh: Tắt"}
            className={`inline-flex size-10 items-center justify-center rounded-full border-2 border-black transition-transform active:scale-95 ${
              isAudioActive
                ? "bg-amber-200 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-surface text-muted shadow-[2px_2px_0px_0px_#000]"
            }`}
          >
            {isAudioActive ? (
              <SpeakerHighIcon size={19} weight="bold" aria-hidden />
            ) : (
              <SpeakerSimpleSlashIcon size={19} aria-hidden />
            )}
          </button>

          <JournalDrawer />

          <Link
            href="/decks"
            className="hidden min-h-10 items-center gap-1.5 rounded-full border-2 border-black bg-surface px-4 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <CardsThreeIcon size={16} weight="bold" />
            <span>{locale === "vi" ? "Bộ Bài" : "Digital Decks"}</span>
          </Link>

          <Link
            href="/about"
            className="hidden min-h-10 items-center gap-1.5 rounded-full border-2 border-black bg-[#e2c6ff] px-4 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5 xl:inline-flex"
          >
            <span>{locale === "vi" ? "🌙 Về Tarot" : "🌙 About Tarot"}</span>
          </Link>

          <Link
            href="/credits"
            className="hidden min-h-10 items-center gap-2 rounded-full border-2 border-black bg-surface px-4 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            {t("credits")}
            <ArrowSquareOutIcon size={15} aria-hidden />
          </Link>

          <Link
            href={pathname}
            locale={nextLocale}
            aria-label={
              locale === "vi"
                ? t("switchToEnglish")
                : t("switchToVietnamese")
            }
            className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-full border-2 border-black bg-surface px-3 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
          >
            <TranslateIcon size={16} aria-hidden />
            <span>{nextLocale.toUpperCase()}</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? t("darkTheme") : t("lightTheme")}
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-black bg-surface text-black shadow-[2px_2px_0px_0px_#000]"
          >
            {theme === "light" ? (
              <MoonIcon size={18} aria-hidden />
            ) : (
              <SunIcon size={18} aria-hidden />
            )}
          </button>

          {isReady && user ? (
            <button
              type="button"
              onClick={signOut}
              title={t("logout")}
              aria-label={`${t("logout")}: ${user.email}`}
              className="moonlight-button inline-flex min-h-10 items-center justify-center rounded-full bg-purple-200 px-4 text-xs font-bold text-black"
            >
              {user.displayName.slice(0, 1)}
            </button>
          ) : (
            <Link
              href="/login"
              aria-label={t("login")}
              className="moonlight-button inline-flex min-h-10 items-center justify-center rounded-full bg-[#e2c6ff] px-5 text-xs font-bold text-black"
            >
              {t("login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
