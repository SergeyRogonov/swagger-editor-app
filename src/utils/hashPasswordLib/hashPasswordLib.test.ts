import { describe, it, expect } from "vitest";
import { generateHashPassword, verifyPassword } from "./hashPasswordLib";

describe("password functions", () => {
  it("should generate and verify password", async () => {
    const PASSWORD = "secret";

    const HASHED_PASSWORD = await generateHashPassword(PASSWORD);

    expect(HASHED_PASSWORD).toBeDefined();
    expect(typeof HASHED_PASSWORD).toBe("string");
    expect(HASHED_PASSWORD).not.toBe(PASSWORD);

    const IS_VALID = await verifyPassword(PASSWORD, HASHED_PASSWORD);
    expect(IS_VALID).toBe(true);

    const IS_INVALID = await verifyPassword("wrongPassword", HASHED_PASSWORD);
    expect(IS_INVALID).toBe(false);
  });
});
