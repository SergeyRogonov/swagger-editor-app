import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { routing } from "@/i18n/routing";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex h-screen flex-col">
        <Header />

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
