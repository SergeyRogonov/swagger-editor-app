import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import LocaleLayout, { generateStaticParams } from "./layout";

import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(),
  setRequestLocale: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("@/provider/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/shared/components/Header", () => ({
  Header: () => <header>Header</header>,
}));

vi.mock("@/shared/components/Footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));

vi.mock("@/shared/components/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/i18n/routing", () => ({
  routing: {
    locales: ["en", "ru"],
  },
}));

describe("LocaleLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getMessages).mockResolvedValue({});
  });

  it("renders the application layout", async () => {
    const ui = await LocaleLayout({
      children: <div>Page Content</div>,
      params: Promise.resolve({ locale: "en" }),
    });

    render(ui);

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();

    expect(setRequestLocale).toHaveBeenCalledWith("en");
    expect(getMessages).toHaveBeenCalled();
  });

  it("calls notFound for an unsupported locale", async () => {
    await expect(
      LocaleLayout({
        children: <div />,
        params: Promise.resolve({ locale: "de" }),
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(setRequestLocale).not.toHaveBeenCalled();
    expect(getMessages).not.toHaveBeenCalled();
  });
});

describe("generateStaticParams", () => {
  it("returns supported locales", () => {
    expect(generateStaticParams()).toEqual([
      { locale: "en" },
      { locale: "ru" },
    ]);
  });
});
