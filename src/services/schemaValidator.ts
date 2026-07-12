import type { OpenAPIV3 } from "openapi-types";
import SwaggerParser from "@apidevtools/swagger-parser";

import type { ValidationError, ValidationResult } from "@/types/swagger";

interface SwaggerValidationResult {
  valid: boolean;
  error: string | null;
}

export async function validateSchema(
  schema: OpenAPIV3.Document,
): Promise<ValidationResult> {
  const result = await validateOpenApiSchema(schema);

  if (result.valid) {
    return {
      valid: true,
      errors: [],
    };
  }

  const errors: ValidationError[] = [
    {
      message: result.error ?? "Schema validation failed.",
    },
  ];

  return {
    valid: false,
    errors,
  };
}

async function validateOpenApiSchema(
  schema: OpenAPIV3.Document,
): Promise<SwaggerValidationResult> {
  try {
    await SwaggerParser.validate(schema);

    return {
      valid: true,
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : "Schema validation failed.",
    };
  }
}
