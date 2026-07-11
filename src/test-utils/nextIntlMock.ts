import { vi } from "vitest";

export const mockNextIntl = () => {
  vi.mock("next-intl", () => ({
    useLocale: () => "en",
    useTranslations: (namespace: string) => (key: string) =>
      `${namespace}.${key}`,
  }));
};
