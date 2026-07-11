import { describe, it, expect, vi } from "vitest";
import { useForgetPasswordSchema } from "./useForgetPasswordSchema";

describe("useForgetPasswordSchema", () => {
  it("validates email", async () => {
    const t = vi.fn(() => "") as unknown as ReturnType<
      typeof import("next-intl").useTranslations
    >;
    const schema = useForgetPasswordSchema(t);

    expect(await schema.isValid({ email: "user@domain.host" })).toBe(true);
    expect(await schema.isValid({ email: "user" })).toBe(false);
  });
});
