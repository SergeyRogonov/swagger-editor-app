"use client";

import { useAuth } from "@/provider/AuthProvider";
import Link from "next/link";
import LanguageSwitcher from "./LangSwitcher";
import { useLocale, useTranslations } from "next-intl";
import AuthSpinner from "./AuthSpinner";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { isAuth, isLoading } = useAuth();
  const locale = useLocale();

  const t = useTranslations("header");

  if (isLoading) {
    return <AuthSpinner />;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-overlay bg-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}/`} className="text-lg font-semibold">
          {t("appName")}
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href={`/${locale}/about`}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t("about")}
          </Link>
          {isAuth ? (
            <>
              <Link
                href={`/${locale}/history`}
                className="rounded-md border border-overlay px-3 py-2 text-sm hover:bg-elevated"
              >
                {t("history")}
              </Link>
              <Link
                href={`/${locale}/sign-out`}
                className="rounded-md bg-danger text-white px-3 py-2 text-sm font-medium hover:bg-red-500"
              >
                {t("signOut")}
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/sign-in`}
                className="rounded-md border border-overlay px-3 py-2 text-sm hover:bg-elevated"
              >
                {t("signIn")}
              </Link>
              <Link
                href={`/${locale}/sign-up`}
                className="rounded-md bg-accent text-white px-3 py-2 text-sm font-medium hover:bg-accent-hover"
              >
                {t("signUp")}
              </Link>
            </>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
