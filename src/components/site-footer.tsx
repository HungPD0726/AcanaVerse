import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Common");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div>
          <p className="font-editorial text-lg text-ink">{t("brand")}</p>
          <p className="mt-2 max-w-xl leading-relaxed">{t("disclaimer")}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          <Link className="hover:text-ink" href="/credits">
            {t("credits")}
          </Link>
          <span>{t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
