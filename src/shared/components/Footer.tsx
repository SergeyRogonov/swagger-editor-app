import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("header");

  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto flex max-w-7xl justify-between px-6 py-4 text-sm text-slate-400">
        <span>{t("appName")}</span>
        <Link href="/about" className="hover:text-white">
          {t("about")}
        </Link>
      </div>
    </footer>
  );
}
