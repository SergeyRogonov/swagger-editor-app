import { load } from "js-yaml";
import type { OpenAPIV3 } from "openapi-types";

import type { ParseResult, SchemaFormat } from "@/types/swagger";

export function parseSchema(
  text: string,
  format: SchemaFormat | null,
): ParseResult {
  if (!format) {
    return {
      schema: null,
      error: "Unable to determine schema format.",
    };
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return {
      schema: null,
      error: "Schema is empty.",
    };
  }

  try {
    let parsed: unknown;

    if (format === "json") {
      parsed = JSON.parse(trimmed);
    } else {
      parsed = load(trimmed);
    }

    if (!parsed || typeof parsed !== "object") {
      return {
        schema: null,
        error: "Schema must be a JSON/YAML object.",
      };
    }

    return {
      schema: parsed as OpenAPIV3.Document,
      error: null,
    };
  } catch (error) {
    return {
      schema: null,
      error: error instanceof Error ? error.message : "Failed to parse schema.",
    };
  }
}
