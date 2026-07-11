import { vi } from "vitest";

export const mockNextIntl = () => {
  vi.mock("next-intl", () => ({
    useTranslations: (namespace: string) => (key: string) =>
      `${namespace}.${key}`,
  }));
};
