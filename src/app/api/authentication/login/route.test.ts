import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "./route";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import isValidEmail from "@/utils/isValidEmail/isValidEmail";
import { verifyPassword } from "@/utils/hashPasswordLib/hashPasswordLib";
import { encrypt } from "@/utils/jwtLib";
import { setAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/utils/isValidEmail/isValidEmail", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/hashPasswordLib/hashPasswordLib", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("@/utils/jwtLib", () => ({
  encrypt: vi.fn(),
}));

vi.mock("@/utils/cookieHelper/cookieHelper", () => ({
  setAccessTokenCookie: vi.fn(),
}));

type SupabaseResponse<T> = {
  data: T;
  error: {
    message: string;
  } | null;
};

type QueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
};

describe("POST /api/authentication/login", () => {
  const cookieStore = {};

  let usersSelectResponse: SupabaseResponse<
    Array<{
      id: string;
      password_hash: string;
    }>
  >;

  let accessTokenInsertResponse: SupabaseResponse<null>;

  let usersQuery: QueryBuilder;
  let accessTokensQuery: QueryBuilder;

  beforeEach(() => {
    vi.clearAllMocks();

    usersSelectResponse = {
      data: [
        {
          id: "user-1",
          password_hash: "hashed-password",
        },
      ],
      error: null,
    };

    accessTokenInsertResponse = {
      data: null,
      error: null,
    };

    usersQuery = {
      select: vi.fn(),
      eq: vi.fn(),
      limit: vi.fn(),
      insert: vi.fn(),
    };

    accessTokensQuery = {
      select: vi.fn(),
      eq: vi.fn(),
      limit: vi.fn(),
      insert: vi.fn(),
    };

    usersQuery.select.mockImplementation(() => usersQuery);
    usersQuery.eq.mockImplementation(() => usersQuery);
    usersQuery.limit.mockResolvedValue(usersSelectResponse);

    accessTokensQuery.insert.mockResolvedValue(accessTokenInsertResponse);

    vi.mocked(cookies).mockResolvedValue(
      cookieStore as Awaited<ReturnType<typeof cookies>>,
    );

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn((table: string) => {
        if (table === "users") {
          return usersQuery;
        }

        return accessTokensQuery;
      }),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    vi.mocked(isValidEmail).mockReturnValue(true);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(encrypt).mockResolvedValue("jwt-token");
  });

  it("returns 400 when email is missing", async () => {
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        password: "password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "EMAIL_IS_REQUIRED",
    });
  });

  it("returns 400 when email is invalid", async () => {
    vi.mocked(isValidEmail).mockReturnValue(false);

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "invalid",
        password: "password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "INVALID_EMAIL",
    });
  });

  it("returns 400 when password is missing", async () => {
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "PASSWORD_IS_REQUIRED",
    });
  });

  it("returns 500 when finding user fails", async () => {
    usersSelectResponse.error = {
      message: "database error",
    };

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: "database error",
    });
  });

  it("returns 404 when user does not exist", async () => {
    usersSelectResponse.data = [];

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      message: "USER_NOT_FOUND",
    });
  });

  it("returns 409 when password is incorrect", async () => {
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "wrong-password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      message: "NO_SUCCESS_PASSWORD",
    });

    expect(verifyPassword).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    );
  });

  it("returns 500 when inserting access token fails", async () => {
    accessTokenInsertResponse.error = {
      message: "insert token failed",
    };

    const request = new NextRequest("http://localhost", {
      method: "POST",
      headers: {
        "x-forwarded-for": "1.1.1.1",
        "x-real-ip": "2.2.2.2",
        "cf-connecting-ip": "3.3.3.3",
      },
      body: JSON.stringify({
        email: "john@test.com",
        password: "password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: "insert token failed",
    });
  });

  it("logs in successfully", async () => {
    const request = new NextRequest("http://localhost", {
      method: "POST",
      headers: {
        "x-forwarded-for": "1.1.1.1",
        "x-real-ip": "2.2.2.2",
        "cf-connecting-ip": "3.3.3.3",
      },
      body: JSON.stringify({
        email: "john@test.com",
        password: "password",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    expect(await response.json()).toEqual({
      message: "AUTH_SUCCESS",
      data: {
        accessToken: "jwt-token",
      },
    });

    expect(verifyPassword).toHaveBeenCalledWith("password", "hashed-password");

    expect(encrypt).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        type: "access",
      },
    });

    expect(accessTokensQuery.insert).toHaveBeenCalledWith([
      {
        id_user: "user-1",
        access_token: "jwt-token",
        ip_x_forwarded_for: "1.1.1.1",
        ip_x_real_ip: "2.2.2.2",
        ip_cf_connecting_ip: "3.3.3.3",
      },
    ]);

    expect(setAccessTokenCookie).toHaveBeenCalledOnce();
  });

  it("returns 500 when request.json throws", async () => {
    const request = {
      json: vi.fn().mockRejectedValue(new Error("invalid json")),
    } as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: "Error: invalid json",
    });
  });
});
