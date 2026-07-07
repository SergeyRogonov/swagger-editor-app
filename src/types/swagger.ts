import type { OpenAPIV3 } from "openapi-types";

export type SchemaFormat = "json" | "yaml";

export interface ValidationError {
  message: string;
  path?: string;
}

export interface SwaggerEditorState {
  rawText: string;
  format: SchemaFormat | null;
  schema: OpenAPIV3.Document | null;
  derefSchema: OpenAPIV3.Document | null;
  isValid: boolean;
  errors: ValidationError[];
}

export interface ParseResult {
  schema: OpenAPIV3.Document | null;
  error: string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
