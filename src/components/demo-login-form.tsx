"use client";

import { CheckCircleIcon, LockKeyIcon } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import type { Locale } from "@/domain/tarot";

export function DemoLoginForm() {
  const t = useTranslations("Login");
  const locale = useLocale() as Locale;
  const { user, signIn } = useAuth();
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const nextErrors: { email?: string; password?: string } = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t("emailError");
    }
    if (password.length < 12) {
      nextErrors.password = t("passwordError");
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const displayName = email.split("@")[0] || "Reader";
      signIn({ email, displayName, locale });
      form.reset();
    }
  };

  return (
    <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
      {user ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-control border border-accent bg-accent-soft p-4 text-sm text-ink"
        >
          <CheckCircleIcon size={22} weight="fill" aria-hidden />
          <div>
            <p className="font-semibold">{t("success")}</p>
            <p className="mt-1 text-muted">
              {t("loggedInAs", { email: user.email })}
            </p>
          </div>
        </div>
      ) : null}

      <form className={user ? "mt-7" : ""} onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="demo-email" className="text-sm font-medium text-ink">
            {t("email")}
          </label>
          <input
            id="demo-email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "demo-email-error" : undefined}
            placeholder={t("emailPlaceholder")}
            className="mt-2 min-h-12 w-full rounded-control border border-line bg-canvas px-3 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.email ? (
            <p id="demo-email-error" className="mt-2 text-sm text-danger">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <label
            htmlFor="demo-password"
            className="text-sm font-medium text-ink"
          >
            {t("password")}
          </label>
          <input
            id="demo-password"
            name="password"
            type="password"
            minLength={12}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "demo-password-error"
                : "demo-password-help"
            }
            placeholder={t("passwordPlaceholder")}
            className="mt-2 min-h-12 w-full rounded-control border border-line bg-canvas px-3 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <p
            id="demo-password-help"
            className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted"
          >
            <LockKeyIcon size={15} className="mt-0.5 shrink-0" aria-hidden />
            {t("passwordHelp")}
          </p>
          {errors.password ? (
            <p id="demo-password-error" className="mt-2 text-sm text-danger">
              {errors.password}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-control bg-ink px-5 text-sm font-semibold text-canvas transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
