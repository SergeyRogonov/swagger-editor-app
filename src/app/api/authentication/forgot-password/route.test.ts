import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "./route";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import isValidEmail from "@/utils/isValidEmail/isValidEmail";
import generateRandomPassword from "@/utils/generateRandomPassword/generateRandomPassword";
import { generateHashPassword } from "@/utils/hashPasswordLib/hashPasswordLib";
import sendEmail from "@/utils/sendEmail/sendEmail";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/utils/isValidEmail/isValidEmail", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/generateRandomPassword/generateRandomPassword", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/hashPasswordLib/hashPasswordLib", () => ({
  generateHashPassword: vi.fn(),
}));

vi.mock("@/utils/sendEmail/sendEmail", () => ({
  default: vi.fn(),
}));

type SupabaseResponse<T> = {
  data: T;
  error: {
    message: string;
  } | null;
};

type SelectQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
};

type UpdateQueryBuilder = {
  update: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
};

describe("POST /api/authentication/forgot-password", () => {
  const cookieStore = {};

  let usersSelectResponse: SupabaseResponse<
    Array<{
      id: string;
      email: string;
    }>
  >;

  let updateResponse: SupabaseResponse<null>;

  let selectQuery: SelectQueryBuilder;
  let updateQuery: UpdateQueryBuilder;

  beforeEach(() => {
    vi.clearAllMocks();

    usersSelectResponse = {
      data: [
        {
          id: "user-1",
          email: "john@test.com",
        },
      ],
      error: null,
    };

    updateResponse = {
      data: null,
      error: null,
    };

    selectQuery = {
      select: vi.fn(),
      eq: vi.fn(),
      limit: vi.fn(),
    };

    updateQuery = {
      update: vi.fn(),
      eq: vi.fn(),
    };

    selectQuery.select.mockImplementation(() => selectQuery);
    selectQuery.eq.mockImplementation(() => selectQuery);
    selectQuery.limit.mockResolvedValue(usersSelectResponse);

    updateQuery.update.mockReturnValue(updateQuery);
    updateQuery.eq
      .mockReturnValueOnce(updateQuery)
      .mockResolvedValueOnce(updateResponse);

    vi.mocked(cookies).mockResolvedValue(
      cookieStore as Awaited<ReturnType<typeof cookies>>,
    );

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn(() => ({
        ...selectQuery,
        ...updateQuery,
      })),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    vi.mocked(isValidEmail).mockReturnValue(true);
    vi.mocked(generateRandomPassword).mockResolvedValue("new-password");
    vi.mocked(generateHashPassword).mockResolvedValue("hashed-password");
    vi.mocked(sendEmail).mockResolvedValue(undefined);
  });

  it("returns 400 when email is missing", async () => {
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({}),
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
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    expect(await response.json()).toEqual({
      message: "INVALID_EMAIL",
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
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      message: "USER_NOT_FOUND",
    });
  });

  it("returns 500 when updating password fails", async () => {
    updateResponse.error = {
      message: "update failed",
    };

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);

    expect(await response.json()).toEqual({
      message: "update failed",
    });
  });

  it("resets password successfully", async () => {
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    expect(await response.json()).toEqual({
      message: "SUCCESS",
    });

    expect(generateRandomPassword).toHaveBeenCalledOnce();

    expect(generateHashPassword).toHaveBeenCalledWith("new-password");

    expect(updateQuery.update).toHaveBeenCalledWith({
      password_hash: "hashed-password",
    });

    expect(updateQuery.eq).toHaveBeenNthCalledWith(1, "id", "user-1");

    expect(updateQuery.eq).toHaveBeenNthCalledWith(2, "email", "john@test.com");

    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      "john@test.com",
      "Change password",
      expect.stringContaining("new-password"),
    );
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
