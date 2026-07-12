import { describe, expect, it } from "vitest";
import { decrypt } from "./jwtLib";

describe("JWT", () => {
  it("should throw for invalid token", async () => {
    await expect(decrypt("invalid.jwt.token")).rejects.toThrow();
  });
});
