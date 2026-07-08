import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const t = useTranslations("history");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
    </main>
  );
}
