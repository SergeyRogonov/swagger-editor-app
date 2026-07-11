import { describe, expect, it } from "vitest";
import type { OpenAPIV3 } from "openapi-types";

import { dereferenceSchema } from "./schemaDereferencer";

describe("dereferenceSchema", () => {
  it("dereferences schema references", async () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.0.0",
      info: {
        title: "Test API",
        version: "1.0.0",
      },
      paths: {},
      components: {
        schemas: {
          Pet: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    };

    const schemaWithRef = {
      ...schema,
      paths: {
        "/pets": {
          get: {
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Pet",
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as OpenAPIV3.Document;

    const result = await dereferenceSchema(schemaWithRef);

    const responseSchema = result.paths["/pets"]?.get?.responses["200"];

    expect(responseSchema).toBeDefined();
    expect(
      responseSchema &&
        "content" in responseSchema &&
        responseSchema.content?.["application/json"]?.schema,
    ).toEqual({
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    });
  });

  it("does not mutate the original schema", async () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.0.0",
      info: {
        title: "Test API",
        version: "1.0.0",
      },
      paths: {},
      components: {
        schemas: {
          Pet: {
            type: "object",
          },
        },
      },
    };

    const original = JSON.stringify(schema);

    await dereferenceSchema(schema);

    expect(JSON.stringify(schema)).toBe(original);
  });
});
