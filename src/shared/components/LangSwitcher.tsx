"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-overlay p-1">
      {["ru", "en"].map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            locale === lang
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
