import { describe, it, expect, vi } from "vitest";
import passwordValidation from "./passwordValidation";

describe("passwordValidation", () => {
  const t = vi.fn(() => "") as unknown as ReturnType<
    typeof import("next-intl").useTranslations
  >;

  const validate = async (password: string | undefined) => {
    const schema = passwordValidation(t);
    try {
      await schema.validate(password);
      return { valid: true };
    } catch (error: unknown) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  it("validates password correctly", async () => {
    const valid = await validate("Test123!");
    expect(valid.valid).toBe(true);

    const invalid = await validate("test");
    expect(invalid.valid).toBe(false);
    expect(invalid.error).toBeDefined();
  });
});
