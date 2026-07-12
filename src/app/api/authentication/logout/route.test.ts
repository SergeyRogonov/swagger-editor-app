import { beforeEach, describe, expect, it, vi } from "vitest";
import { JWTExpired } from "jose/errors";

import { POST } from "./route";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  getAccessTokenCookie,
  removeAccessTokenCookie,
} from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/utils/cookieHelper/cookieHelper", () => ({
  getAccessTokenCookie: vi.fn(),
  removeAccessTokenCookie: vi.fn(),
}));

vi.mock("@/utils/jwtLib", () => ({
  decrypt: vi.fn(),
}));

type SupabaseResponse<T> = {
  data: T;
  error: {
    message: string;
  } | null;
};

type DeleteQueryBuilder = {
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
};

describe("POST /api/authentication/logout", () => {
  const cookieStore = {};

  let deleteResponse: SupabaseResponse<null>;
  let accessTokensQuery: DeleteQueryBuilder;

  beforeEach(() => {
    vi.clearAllMocks();

    deleteResponse = {
      data: null,
      error: null,
    };

    accessTokensQuery = {
      delete: vi.fn(),
      eq: vi.fn(),
    };

    accessTokensQuery.delete.mockReturnValue(accessTokensQuery);
    accessTokensQuery.eq.mockResolvedValue(deleteResponse);

    vi.mocked(cookies).mockResolvedValue(
      cookieStore as Awaited<ReturnType<typeof cookies>>,
    );

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn(() => accessTokensQuery),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    vi.mocked(getAccessTokenCookie).mockResolvedValue("jwt-token");
    vi.mocked(decrypt).mockResolvedValue({
      data: {
        userId: 123,
        type: "access",
      },
    });
  });

  it("returns 401 when access token cookie is missing", async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue("");

    const response = await POST();
    const DATA = await response.json();

    expect(DATA.status).toBe(401);

    expect(DATA).toEqual({
      status: 401,
      message: "Вы не авторизованы",
      messageMore:
        "Вы не авторизованы, так как не указан Access Token в Cookie",
    });
  });

  it("returns 401 when access token is expired", async () => {
    vi.mocked(decrypt).mockRejectedValue(
      new JWTExpired("expired", {
        claims: {},
        currentDate: new Date(),
      }),
    );

    const response = await POST();
    const DATA = await response.json();

    expect(DATA.status).toBe(401);

    expect(DATA).toEqual({
      status: 401,
      message: "Вы не авторизованы",
      messageMore: "Вы не авторизованы, так как Access Token просрочен",
    });
  });

  it("returns 500 when deleting access token fails", async () => {
    deleteResponse.error = {
      message: "database error",
    };

    const response = await POST();
    const DATA = await response.json();

    expect(DATA.status).toBe(500);

    expect(DATA).toEqual({
      status: 500,
      message: "database error",
    });
  });

  it("logs out successfully", async () => {
    const response = await POST();
    const DATA = await response.json();

    expect(DATA.status).toBe(200);

    expect(DATA).toEqual({
      status: 200,
      message: "Вы вышли из аккаунта",
    });

    expect(decrypt).toHaveBeenCalledWith("jwt-token");

    expect(accessTokensQuery.delete).toHaveBeenCalledOnce();

    expect(accessTokensQuery.eq).toHaveBeenCalledWith(
      "access_token",
      "jwt-token",
    );

    expect(removeAccessTokenCookie).toHaveBeenCalledOnce();
  });

  it("returns 500 when createClient throws", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("supabase failed"));

    const response = await POST();
    const DATA = await response.json();

    expect(DATA.status).toBe(500);

    expect(DATA).toEqual({
      status: 500,
      message: "Error: supabase failed",
    });
  });
});
