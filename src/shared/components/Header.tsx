"use client";

import { useAuth } from "@/provider/AuthProvider";
import Link from "next/link";
import LanguageSwitcher from "./LangSwitcher";
import { useLocale } from "next-intl";

export function Header() {
  const { isAuth, isLoading } = useAuth();
  const locale = useLocale();

  if (isLoading) {
    return <div>Проверка авторизации {locale}</div>;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Swagger Editor App
        </Link>
        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/about`}
            className="text-sm text-slate-300 hover:text-white"
          >
            About
          </Link>
          {isAuth ? (
            <>
              <Link
                href={`/${locale}/history`}
                className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
              >
                History
              </Link>
              <Link
                href={`/${locale}/sign-out`}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500"
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/sign-in`}
                className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href={`/${locale}/sign-up`}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
