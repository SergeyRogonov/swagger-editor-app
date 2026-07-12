import { describe, it, expect, vi } from "vitest";
import emailValidation from "./emailValidation";

describe("emailValidation", () => {
  const t = vi.fn(() => "") as unknown as ReturnType<
    typeof import("next-intl").useTranslations
  >;

  const EMAIL_TEST = emailValidation(t);

  it("requires email", async () => {
    await expect(EMAIL_TEST.validate(undefined)).rejects.toThrow();
    await expect(EMAIL_TEST.validate(null)).rejects.toThrow();
    await expect(EMAIL_TEST.validate("")).rejects.toThrow();
  });

  it("accepts valid emails", async () => {
    const valid = [
      "user@host.domain",
      "user@host.subdomain.domain",
      "user_123@host.domain",
      "user.123@host.domain",
    ];
    for (const email of valid) {
      await expect(EMAIL_TEST.validate(email)).resolves.toBe(email);
    }
  });

  describe("must have exactly one @", () => {
    it("rejects email without @", async () => {
      await expect(EMAIL_TEST.validate("userhost.domain")).rejects.toThrow();
    });

    it("rejects email with multiple @", async () => {
      await expect(EMAIL_TEST.validate("user@@host.domain")).rejects.toThrow();
      await expect(EMAIL_TEST.validate("user@host@domain")).rejects.toThrow();
    });
  });

  describe("must have non-empty local part", () => {
    it("rejects empty local part", async () => {
      await expect(EMAIL_TEST.validate("@host.domain")).rejects.toThrow();
    });
  });

  describe("must have valid domain", () => {
    it("rejects domain with one part", async () => {
      await expect(EMAIL_TEST.validate("user@host")).rejects.toThrow();
    });

    it("rejects domain with consecutive dots", async () => {
      await expect(EMAIL_TEST.validate("user@host..domain")).rejects.toThrow();
    });
  });

  describe("must have valid username", () => {
    it("rejects username starting with dot", async () => {
      await expect(EMAIL_TEST.validate(".user@host.domain")).rejects.toThrow();
    });

    it("rejects username ending with dot", async () => {
      await expect(EMAIL_TEST.validate("user.@host.domain")).rejects.toThrow();
    });

    it("rejects username with invalid characters", async () => {
      await expect(EMAIL_TEST.validate("us$er@host.domain")).rejects.toThrow();
      await expect(EMAIL_TEST.validate("us*er@host.domain")).rejects.toThrow();
      await expect(EMAIL_TEST.validate("user!@host.domain")).rejects.toThrow();
    });
  });
});
