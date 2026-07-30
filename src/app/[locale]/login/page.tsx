import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoLoginForm } from "@/components/demo-login-form";
import type { AppLocale } from "@/i18n/routing";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Login");

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:gap-18 lg:px-8 lg:py-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-5 max-w-[12ch] font-editorial text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted">
          {t("body")}
        </p>
      </div>
      <DemoLoginForm />
    </section>
  );
}
