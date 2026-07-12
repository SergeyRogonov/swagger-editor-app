import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "./route";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import isValidEmail from "@/utils/isValidEmail/isValidEmail";
import { generateHashPassword } from "@/utils/hashPasswordLib/hashPasswordLib";
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
  generateHashPassword: vi.fn(),
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

describe("POST /api/authentication/register", () => {
  const cookieStore = {};

  let usersSelectResponse: SupabaseResponse<Array<{ id: string }>>;
  let usersInsertResponse: SupabaseResponse<Array<{ id: string }>>;
  let accessTokenInsertResponse: SupabaseResponse<null>;

  let usersQuery: QueryBuilder;
  let accessTokensQuery: QueryBuilder;

  beforeEach(() => {
    vi.clearAllMocks();

    usersSelectResponse = {
      data: [],
      error: null,
    };

    usersInsertResponse = {
      data: [{ id: "user-1" }],
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

    usersQuery.insert.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue(usersInsertResponse),
    }));

    accessTokensQuery.insert.mockResolvedValue(accessTokenInsertResponse);

    vi.mocked(cookies).mockResolvedValue(
      cookieStore as Awaited<ReturnType<typeof cookies>>,
    );

    const mockedCreateClient = vi.mocked(createClient);

    mockedCreateClient.mockResolvedValue({
      from: vi.fn((table: string) => {
        if (table === "users") {
          return usersQuery;
        }

        return accessTokensQuery;
      }),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    vi.mocked(isValidEmail).mockReturnValue(true);

    vi.mocked(generateHashPassword).mockResolvedValue("hashed-password");

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

    const DATA = await response.json();

    expect(DATA.status).toBe(400);

    expect(DATA).toEqual({
      status: 400,
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

    const DATA = await response.json();

    expect(DATA.status).toBe(400);

    expect(DATA).toEqual({
      status: 400,
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
    const DATA = await response.json();

    expect(DATA.status).toBe(400);

    expect(DATA).toEqual({
      status: 400,
      message: "PASSWORD_IS_REQUIRED",
    });
  });

  it("returns 409 when email already exists", async () => {
    usersSelectResponse.data = [{ id: "existing-user" }];

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "password",
      }),
    });

    const response = await POST(request);
    const DATA = await response.json();

    expect(DATA.status).toBe(409);

    expect(DATA).toEqual({
      status: 409,
      message: "EMAIL_ALREADY_TAKEN",
    });
  });

  it("returns 500 when finding the user fails", async () => {
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
    const DATA = await response.json();

    expect(DATA.status).toBe(500);

    expect(DATA).toEqual({
      status: 500,
      message: "database error",
    });
  });

  it("returns 500 when creating the user fails", async () => {
    usersInsertResponse.error = {
      message: "insert failed",
    };

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "password",
      }),
    });

    const response = await POST(request);
    const DATA = await response.json();

    expect(DATA.status).toBe(500);

    expect(DATA).toEqual({
      status: 500,
      message: "insert failed",
    });
  });

  it("returns 500 when inserting the access token fails", async () => {
    accessTokenInsertResponse.error = {
      message: "token insert failed",
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
    const DATA = await response.json();

    expect(DATA.status).toBe(500);

    expect(DATA).toEqual({
      status: 500,
      message: "token insert failed",
    });
  });

  it("creates a new user successfully", async () => {
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
    const DATA = await response.json();

    expect(DATA.status).toBe(201);

    expect(DATA).toEqual({
      status: 201,
      message: "AUTH_SUCCESS",
      data: {
        accessToken: "jwt-token",
      },
    });

    expect(generateHashPassword).toHaveBeenCalledWith("password");

    expect(encrypt).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        type: "access",
      },
    });

    expect(setAccessTokenCookie).toHaveBeenCalledOnce();

    expect(accessTokensQuery.insert).toHaveBeenCalledWith([
      {
        id_user: "user-1",
        access_token: "jwt-token",
        ip_x_forwarded_for: "1.1.1.1",
        ip_x_real_ip: "2.2.2.2",
        ip_cf_connecting_ip: "3.3.3.3",
      },
    ]);
  });

  it("returns 500 when request.json throws", async () => {
    const request = {
      json: vi.fn().mockRejectedValue(new Error("invalid json")),
    } as unknown as NextRequest;

    const response = await POST(request);
    const DATA = await response.json();

    expect(DATA.status).toBe(500);

    expect(DATA).toEqual({
      status: 500,
      message: "Error: invalid json",
    });
  });
});
