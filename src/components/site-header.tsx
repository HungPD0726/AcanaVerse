"use client";

import {
  CardsThreeIcon,
  MoonIcon,
  SignInIcon,
  SpeakerHighIcon,
  SpeakerSimpleSlashIcon,
  SunIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import type { AppLocale } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";
import { audioEngine } from "@/lib/audio-engine";

export function SiteHeader() {
  const t = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const nextLocale: AppLocale = locale === "vi" ? "en" : "vi";
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isReady } = useAuth();
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsAudioActive(!audioEngine.getIsMuted()));
  }, []);

  const handleToggleAudio = () => {
    const active = audioEngine.toggleMute();
    setIsAudioActive(active);
    if (active) audioEngine.playFlipSound();
  };

  const iconButtonClass =
    "inline-flex size-10 items-center justify-center rounded-control border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <header className="sticky top-0 z-header border-b border-line bg-surface/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-editorial text-2xl font-semibold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {t("brand")}
        </Link>

        <nav
          aria-label={t("primaryNavigation")}
          className="flex items-center gap-2"
        >
          <Link
            href="/decks"
            className="hidden min-h-10 items-center gap-2 rounded-control px-3 text-xs font-semibold text-muted transition-colors hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
          >
            <CardsThreeIcon size={17} aria-hidden />
            {t("decks")}
          </Link>
          <Link
            href="/credits"
            className="hidden min-h-10 items-center rounded-control px-3 text-xs font-semibold text-muted transition-colors hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:inline-flex"
          >
            {t("credits")}
          </Link>

          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isAudioActive ? t("muteAudio") : t("enableAudio")}
            title={isAudioActive ? t("audioOn") : t("audioOff")}
            className={iconButtonClass}
          >
            {isAudioActive ? (
              <SpeakerHighIcon size={18} weight="fill" aria-hidden />
            ) : (
              <SpeakerSimpleSlashIcon size={18} aria-hidden />
            )}
          </button>

          <Link
            href={pathname}
            locale={nextLocale}
            aria-label={
              locale === "vi"
                ? t("switchToEnglish")
                : t("switchToVietnamese")
            }
            className={`${iconButtonClass} text-[0.68rem] font-semibold`}
          >
            <TranslateIcon size={16} aria-hidden />
            <span className="sr-only">{nextLocale.toUpperCase()}</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? t("darkTheme") : t("lightTheme")}
            className={iconButtonClass}
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
              className="inline-flex size-10 items-center justify-center rounded-control bg-ink text-xs font-semibold uppercase text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {user.displayName.slice(0, 1)}
            </button>
          ) : (
            <Link
              href="/login"
              aria-label={t("login")}
              className="inline-flex size-10 items-center justify-center rounded-control bg-ink text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto sm:px-4"
            >
              <SignInIcon size={17} aria-hidden />
              <span className="ml-2 hidden text-xs font-semibold sm:inline">
                {t("login")}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
