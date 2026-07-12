import { describe, expect, it } from "vitest";
import { detectFormat } from "./formatDetection";

describe("detectFormat", () => {
  it("detects JSON", () => {
    expect(detectFormat('{"openapi": "3.0.0"}')).toBe("json");
  });

  it("ignores surrounding whitespace", () => {
    expect(detectFormat('  {"openapi": "3.0.0"}  ')).toBe("json");
  });

  it("detects YAML when JSON parsing fails", () => {
    expect(detectFormat("openapi: 3.0.0")).toBe("yaml");
  });

  it("returns null for empty input", () => {
    expect(detectFormat("   ")).toBeNull();
  });

  it("treats invalid JSON as YAML", () => {
    expect(detectFormat("{invalid json")).toBe("yaml");
  });
});
