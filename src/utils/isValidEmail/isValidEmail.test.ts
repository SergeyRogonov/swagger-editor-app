import { describe, it, expect } from "vitest";
import isValidEmail from "./isValidEmail";

describe("isValidEmail", () => {
  it("should validate email correctly", () => {
    expect(isValidEmail("user@host.domain")).toBe(true);
    expect(isValidEmail("user@host.subdomain.domain")).toBe(true);
    expect(isValidEmail("user@host.subdomain.subdomain.domain")).toBe(true);

    expect(isValidEmail("user")).toBe(false);
    expect(isValidEmail("user@host")).toBe(false);
    expect(isValidEmail("user@host.")).toBe(false);
    expect(isValidEmail("user@.")).toBe(false);
    expect(isValidEmail("user@.domain")).toBe(false);

    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("@")).toBe(false);
  });
});
