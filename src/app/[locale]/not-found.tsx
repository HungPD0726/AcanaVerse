import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="mx-auto flex min-h-[65dvh] max-w-4xl flex-col items-start justify-center px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-5 font-editorial text-5xl tracking-tight text-ink sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-muted">
        {t("body")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-control bg-ink px-5 text-sm font-semibold text-canvas focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {t("action")}
      </Link>
    </section>
  );
}
