"use client";

import {
  CardsThreeIcon,
  CompassIcon,
  HouseIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AppSidebar() {
  const t = useTranslations("Common");

  return (
    <aside className="fixed left-4 top-24 z-30 hidden flex-col items-center gap-6 rounded-[2rem] border-2 border-black bg-surface/90 p-3 shadow-[5px_5px_0px_0px_#000] backdrop-blur-md lg:flex">
      <Link
        href="/"
        title={t("home")}
        className="group flex flex-col items-center gap-1 rounded-full p-3 transition-transform hover:scale-110"
      >
        <div className="flex size-11 items-center justify-center rounded-full border-2 border-black bg-canvas shadow-[2px_2px_0px_0px_#000] group-hover:bg-accent-soft">
          <HouseIcon size={20} weight="bold" />
        </div>
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          {t("home")}
        </span>
      </Link>

      <Link
        href="/decks"
        title={t("decks")}
        className="group flex flex-col items-center gap-1 rounded-full p-3 transition-transform hover:scale-110"
      >
        <div className="flex size-11 items-center justify-center rounded-full border-2 border-black bg-canvas shadow-[2px_2px_0px_0px_#000] group-hover:bg-accent-soft">
          <CardsThreeIcon size={20} weight="bold" />
        </div>
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          {t("decks")}
        </span>
      </Link>

      <Link
        href="/reading/daily-insight"
        title={t("practice")}
        className="group flex flex-col items-center gap-1 rounded-full p-3 transition-transform hover:scale-110"
      >
        <div className="flex size-11 items-center justify-center rounded-full border-2 border-black bg-purple-200 text-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-purple-300">
          <SparkleIcon size={20} weight="bold" />
        </div>
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          {t("practice")}
        </span>
      </Link>

      <Link
        href="/credits"
        title={t("explore")}
        className="group flex flex-col items-center gap-1 rounded-full p-3 transition-transform hover:scale-110"
      >
        <div className="flex size-11 items-center justify-center rounded-full border-2 border-black bg-canvas shadow-[2px_2px_0px_0px_#000] group-hover:bg-accent-soft">
          <CompassIcon size={20} weight="bold" />
        </div>
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          {t("explore")}
        </span>
      </Link>
    </aside>
  );
}
