import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadSchema, saveSchema } from "./schemaStorage";

describe("saveSchema", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("saves schema content", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    await saveSchema("openapi: 3.0.0");

    expect(fetchMock).toHaveBeenCalledWith("/api/schema", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "openapi: 3.0.0",
      }),
    });
  });

  it("throws when saving fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    await expect(saveSchema("schema")).rejects.toThrow("Failed to save schema");
  });
});

describe("loadSchema", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads schema content", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          content: "openapi: 3.0.0",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    await expect(loadSchema()).resolves.toBe("openapi: 3.0.0");
  });

  it("returns null when no schema exists", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );

    await expect(loadSchema()).resolves.toBeNull();
  });

  it("returns null when loading fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    await expect(loadSchema()).resolves.toBeNull();
  });
});
