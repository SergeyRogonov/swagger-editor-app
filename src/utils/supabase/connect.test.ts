import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSupabaseUrl,
  getSupabaseKey,
  getSupabaseServiceRoleKey,
} from "./connect";

describe("Supabase environment variable functions", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  describe("getSupabaseUrl", () => {
    it("should return the Supabase URL from environment variables", () => {
      const MOCK_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_URL = MOCK_URL;

      const RESULT = getSupabaseUrl();

      expect(RESULT).toBe(MOCK_URL);
    });
  });

  describe("getSupabaseKey", () => {
    it("should return the Supabase publishable key from environment variables", () => {
      const MOCK_KEY = "sb_publishable_x";
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = MOCK_KEY;

      const RESULT = getSupabaseKey();

      expect(RESULT).toBe(MOCK_KEY);
    });
  });

  describe("getSupabaseServiceRoleKey", () => {
    it("should return the Supabase role key from environment variables", () => {
      const MOCK_ROLE_KEY = "sb_secret_x";
      process.env.SUPABASE_SERVICE_ROLE_KEY = MOCK_ROLE_KEY;

      const RESULT = getSupabaseServiceRoleKey();

      expect(RESULT).toBe(MOCK_ROLE_KEY);
    });
  });
});
