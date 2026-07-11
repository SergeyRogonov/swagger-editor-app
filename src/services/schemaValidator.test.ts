import { describe, expect, it, vi } from "vitest";
import type { OpenAPIV3 } from "openapi-types";

import SwaggerParser from "@apidevtools/swagger-parser";

import { validateSchema } from "./schemaValidator";

vi.mock("@apidevtools/swagger-parser", () => ({
  default: {
    validate: vi.fn(),
  },
}));

const schema: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  paths: {},
};

describe("validateSchema", () => {
  it("returns valid when SwaggerParser validation succeeds", async () => {
    vi.mocked(SwaggerParser.validate).mockResolvedValue(schema);

    await expect(validateSchema(schema)).resolves.toEqual({
      valid: true,
      errors: [],
    });
  });

  it("returns validation errors when SwaggerParser validation fails", async () => {
    vi.mocked(SwaggerParser.validate).mockRejectedValue(
      new Error("Invalid OpenAPI document"),
    );

    await expect(validateSchema(schema)).resolves.toEqual({
      valid: false,
      errors: [
        {
          message: "Invalid OpenAPI document",
        },
      ],
    });
  });

  it("uses fallback error message for non-Error throws", async () => {
    vi.mocked(SwaggerParser.validate).mockRejectedValue("validation failed");

    await expect(validateSchema(schema)).resolves.toEqual({
      valid: false,
      errors: [
        {
          message: "Schema validation failed.",
        },
      ],
    });
  });
});
