import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/provider/AuthProvider";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <div className="flex h-screen min-h-0 flex-col">
          <Header />

          <main className="min-h-0 flex-1 overflow-y-scroll">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
