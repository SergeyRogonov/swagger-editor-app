export interface StoredSchema {
  content: string;
  updatedAt: string;
}

export async function saveSchema(): Promise<void> {
  // TODO:
  // Replace with authenticated API call when
  // auth and backend persistence are implemented.
}

export async function loadSchema(): Promise<string | null> {
  // TODO:
  // Replace with authenticated API call when
  // auth and backend persistence are implemented.

  return null;
}
