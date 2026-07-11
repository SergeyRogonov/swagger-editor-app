import { describe, it, expect } from "vitest";
import AsyncSleep from "./sleep";

describe("AsyncSleep", () => {
  it("should resolve after specified time", async () => {
    const start = Date.now();
    const delay = 100;

    await AsyncSleep(delay);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(delay);
  });
});
