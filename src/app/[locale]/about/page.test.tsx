import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "ru"] },
}));

const setRequestLocaleMock = vi.fn();

vi.mock("next-intl/server", () => ({
  setRequestLocale: (locale: string) => setRequestLocaleMock(locale),
}));

vi.mock("@/features/about/components/AboutPage", () => ({
  default: () => "AboutPage",
}));

import { generateStaticParams, default as Page } from "./page";

describe("About page", () => {
  it("generateStaticParams returns all locales", () => {
    expect(generateStaticParams()).toEqual([
      { locale: "en" },
      { locale: "ru" },
    ]);
  });

  it("calls setRequestLocale with resolved locale and renders AboutPage", async () => {
    setRequestLocaleMock.mockClear();

    const element = await Page({
      params: Promise.resolve({ locale: "ru" }),
    });

    expect(setRequestLocaleMock).toHaveBeenCalledWith("ru");

    const { getByText } = render(element as React.ReactElement);
    expect(getByText("AboutPage")).toBeInTheDocument();
  });
});
