import { describe, it, expect, vi } from "vitest";
import { createServiceClient } from "./service";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn().mockReturnValue({ auth: {}, from: {} }),
}));

vi.mock("./connect", () => ({
  getSupabaseUrl: vi.fn().mockReturnValue("https://example.supabase.co"),
  getSupabaseServiceRoleKey: vi.fn().mockReturnValue("sb_secret_123"),
}));

describe("createServiceClient", () => {
  it("should create service client", () => {
    const client = createServiceClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });
});
