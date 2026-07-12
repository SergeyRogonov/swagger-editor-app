export interface StoredSchema {
  content: string;
}

export async function saveSchema(content: string): Promise<void> {
  const response = await fetch("/api/schema", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save schema");
  }
}

export async function loadSchema(): Promise<string | null> {
  const response = await fetch("/api/schema");

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const data: StoredSchema = await response.json();

  return data.content;
}
