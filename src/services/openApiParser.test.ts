import { describe, expect, it } from "vitest";

import { parseSchema } from "./openApiParser";

describe("parseSchema", () => {
  it("returns an error when format cannot be determined", () => {
    expect(parseSchema('{"openapi":"3.0.0"}', null)).toEqual({
      schema: null,
      error: "Unable to determine schema format.",
    });
  });

  it("returns an error for empty schema text", () => {
    expect(parseSchema("   ", "json")).toEqual({
      schema: null,
      error: "Schema is empty.",
    });
  });

  it("parses a JSON schema", () => {
    const result = parseSchema(
      '{"openapi":"3.0.0","info":{"title":"Test","version":"1.0.0"}}',
      "json",
    );

    expect(result.error).toBeNull();
    expect(result.schema).toEqual({
      openapi: "3.0.0",
      info: {
        title: "Test",
        version: "1.0.0",
      },
    });
  });

  it("parses a YAML schema", () => {
    const result = parseSchema(
      `
openapi: 3.0.0
info:
  title: Test
  version: 1.0.0
`,
      "yaml",
    );

    expect(result.error).toBeNull();
    expect(result.schema).toEqual({
      openapi: "3.0.0",
      info: {
        title: "Test",
        version: "1.0.0",
      },
    });
  });

  it("rejects non-object JSON values", () => {
    expect(parseSchema('"hello"', "json")).toEqual({
      schema: null,
      error: "Schema must be a JSON/YAML object.",
    });
  });

  it("rejects empty YAML values", () => {
    expect(parseSchema("null", "yaml")).toEqual({
      schema: null,
      error: "Schema must be a JSON/YAML object.",
    });
  });

  it("returns a parsing error for invalid JSON", () => {
    const result = parseSchema("{invalid json", "json");

    expect(result.schema).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it("returns a parsing error for invalid YAML", () => {
    const result = parseSchema("openapi: [", "yaml");

    expect(result.schema).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
