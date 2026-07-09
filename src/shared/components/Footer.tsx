import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("header");

  return (
    <footer className="border-t border-overlay">
      <div className="mx-auto flex max-w-7xl justify-between px-6 py-4 text-sm text-text-secondary">
        <span>{t("appName")}</span>
        <Link href="/about" className="hover:text-text-primary">
          {t("about")}
        </Link>
      </div>
    </footer>
  );
}
