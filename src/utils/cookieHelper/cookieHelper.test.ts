import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { NextResponse } from "next/server";

import { removeAccessTokenCookie, setAccessTokenCookie } from "./cookieHelper";

describe("access token cookies", () => {
  const response = {
    cookies: {
      set: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as NextResponse;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets access token cookie", () => {
    setAccessTokenCookie(response, "test-token");

    expect(response.cookies.set).toHaveBeenCalledWith({
      name: "access_token",
      value: "test-token",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  });

  it("removes access token cookie", () => {
    const result = removeAccessTokenCookie(response);

    expect(response.cookies.delete).toHaveBeenCalledWith("access_token");
    expect(result).toBe(response);
  });
});
