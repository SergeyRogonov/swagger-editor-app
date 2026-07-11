import { describe, it, expect } from "vitest";
import generateRandomPassword from "./generateRandomPassword";

describe("generateRandomPassword", () => {
  it("should generate a password of length 8", () => {
    const password = generateRandomPassword();
    expect(password).toHaveLength(8);
  });

  it("should contain at least one uppercase letter", () => {
    const password = generateRandomPassword();
    expect(password).toMatch(/[A-Z]/);
  });

  it("should contain at least one lowercase letter", () => {
    const password = generateRandomPassword();
    expect(password).toMatch(/[a-z]/);
  });

  it("should contain at least one digit", () => {
    const password = generateRandomPassword();
    expect(password).toMatch(/[0-9]/);
  });

  it("should contain at least one special symbol", () => {
    const password = generateRandomPassword();
    expect(password).toMatch(/[!@#$%^&*()_=/*-]/);
  });

  it("should only contain allowed characters", () => {
    const password = generateRandomPassword();
    const allowedChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_=/*-";
    const allCharsValid = password
      .split("")
      .every((char) => allowedChars.includes(char));
    expect(allCharsValid).toBe(true);
  });
});
