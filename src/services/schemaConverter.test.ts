import { describe, expect, it } from "vitest";
import type { OpenAPIV3 } from "openapi-types";

import { convertSchema } from "./schemaConverter";

const schema: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  paths: {},
};

describe("convertSchema", () => {
  it("converts a schema to JSON", () => {
    const result = convertSchema(schema, "json");

    expect(result.error).toBeNull();
    expect(result.text).toBe(JSON.stringify(schema, null, 2));
  });

  it("converts a schema to YAML", () => {
    const result = convertSchema(schema, "yaml");

    expect(result.error).toBeNull();
    expect(result.text).toContain("openapi: 3.0.0");
    expect(result.text).toContain("title: Test API");
    expect(result.text).toContain("version: 1.0.0");
  });

  it("returns an error when conversion fails", () => {
    const circularSchema = structuredClone(schema);
    Object.defineProperty(circularSchema, "self", {
      value: circularSchema,
      enumerable: true,
    });

    const result = convertSchema(circularSchema, "json");

    expect(result.text).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
