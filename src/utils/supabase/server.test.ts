import { describe, expect, it, vi } from "vitest";
import { createClient } from "./server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => "client"),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("./connect", () => ({
  getSupabaseUrl: () => "https://test.supabase.co",
  getSupabaseKey: () => "test-key",
}));

describe("createClient", () => {
  it("uses provided cookie store", async () => {
    const store = {
      getAll: vi.fn(() => []),
      set: vi.fn(),
    } as unknown as ReadonlyRequestCookies;

    const client = await createClient(store);

    expect(client).toBe("client");
    expect(cookies).not.toHaveBeenCalled();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    );
  });

  it("uses next cookies when store is not provided", async () => {
    const store = {
      getAll: vi.fn(() => []),
      set: vi.fn(),
    } as unknown as ReadonlyRequestCookies;

    vi.mocked(cookies).mockResolvedValue(store);

    await createClient();

    expect(cookies).toHaveBeenCalled();
  });
});
