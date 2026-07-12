"use client";

import { useAuth } from "@/provider/AuthProvider";
import Link from "next/link";
import LanguageSwitcher from "./LangSwitcher";
import { useLocale, useTranslations } from "next-intl";
import AuthSpinner from "./AuthSpinner";
import { ThemeToggle } from "./ThemeToggle";
import MobileNav from "./MobileNav";
import { useState } from "react";

export function Header() {
  const { isAuth, isLoading } = useAuth();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = useTranslations("header");

  if (isLoading) {
    return <AuthSpinner />;
  }

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-18.25 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <header className="sticky top-0 z-50 border-b border-overlay bg-base/90 backdrop-blur">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={`/${locale}/`} className="text-lg font-semibold">
            {t("appName")}
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href={`/${locale}/about`}
              className="rounded-md border border-overlay px-3 py-2 text-sm hover:bg-elevated"
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
                  className="rounded-md bg-danger px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
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
                  className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                >
                  {t("signUp")}
                </Link>
              </>
            )}

            <LanguageSwitcher />
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />

            <MobileNav
              isAuth={isAuth}
              isOpen={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            />
          </div>
        </div>
      </header>
    </>
  );
}
