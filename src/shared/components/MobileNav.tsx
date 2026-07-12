"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  isAuth: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileNav({
  isAuth,
  isOpen,
  onOpenChange,
}: MobileNavProps) {
  const locale = useLocale();
  const t = useTranslations("header");

  return (
    <>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="p-2 rounded-md hover:bg-elevated transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed top-17 border-t left-0 right-0 bg-base border-b border-overlay z-40 md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            <Link
              href={`/${locale}/about`}
              className="rounded-md border border-overlay px-3 py-2 text-sm hover:bg-elevated text-center"
              onClick={() => onOpenChange(false)}
            >
              {t("about")}
            </Link>

            {isAuth ? (
              <>
                <Link
                  href={`/${locale}/history`}
                  className="rounded-md border border-overlay px-3 py-2 text-sm hover:bg-elevated text-center"
                  onClick={() => onOpenChange(false)}
                >
                  {t("history")}
                </Link>
                <Link
                  href={`/${locale}/sign-out`}
                  className="rounded-md bg-danger text-white px-3 py-2 text-sm font-medium hover:bg-red-500 text-center"
                  onClick={() => onOpenChange(false)}
                >
                  {t("signOut")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/sign-in`}
                  className="rounded-md border border-overlay px-3 py-2 text-sm hover:bg-elevated text-center"
                  onClick={() => onOpenChange(false)}
                >
                  {t("signIn")}
                </Link>
                <Link
                  href={`/${locale}/sign-up`}
                  className="rounded-md bg-accent text-white px-3 py-2 text-sm font-medium hover:bg-accent-hover text-center"
                  onClick={() => onOpenChange(false)}
                >
                  {t("signUp")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
