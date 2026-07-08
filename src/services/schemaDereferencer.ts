import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIV3 } from "openapi-types";

export async function dereferenceSchema(
  schema: OpenAPIV3.Document,
): Promise<OpenAPIV3.Document> {
  const clone = JSON.parse(JSON.stringify(schema));
  return (await SwaggerParser.dereference(clone)) as OpenAPIV3.Document;
}
