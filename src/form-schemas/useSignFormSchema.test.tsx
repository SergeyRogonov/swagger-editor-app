import { describe, it, expect, vi } from "vitest";
import { useSignFormSchema } from "./useSignFormSchema";

describe("useSignFormSchema", () => {
  const t = vi.fn(() => "") as unknown as ReturnType<
    typeof import("next-intl").useTranslations
  >;
  const schema = useSignFormSchema(t);

  it("validates email and password", async () => {
    expect(
      await schema.isValid({ email: "user@domain.host", password: "Test123!" }),
    ).toBe(true);
    expect(
      await schema.isValid({ email: "invalid", password: "Test123!" }),
    ).toBe(false);
  });
});
