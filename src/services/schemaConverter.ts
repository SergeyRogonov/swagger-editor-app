import { dump } from "js-yaml";

import type { OpenAPIV3 } from "openapi-types";
import type { SchemaFormat } from "@/types/swagger";

export interface ConversionResult {
  text: string | null;
  error: string | null;
}

export function convertSchema(
  schema: OpenAPIV3.Document,
  targetFormat: SchemaFormat,
): ConversionResult {
  try {
    if (targetFormat === "json") {
      return {
        text: JSON.stringify(schema, null, 2),
        error: null,
      };
    }

    return {
      text: dump(schema, {
        indent: 2,
        noRefs: true,
        lineWidth: -1,
      }),
      error: null,
    };
  } catch (error) {
    return {
      text: null,
      error:
        error instanceof Error ? error.message : "Failed to convert schema.",
    };
  }
}
