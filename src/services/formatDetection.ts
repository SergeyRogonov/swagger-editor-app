import type { SchemaFormat } from "@/types/swagger";

export function detectFormat(text: string): SchemaFormat | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  try {
    JSON.parse(trimmed);
    return "json";
  } catch {
    return "yaml";
  }
}
