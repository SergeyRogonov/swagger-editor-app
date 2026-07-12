import { beforeEach, describe, expect, it, vi } from "vitest";
import { JWTExpired } from "jose/errors";

import { POST } from "./route";

import { getAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";

vi.mock("@/utils/cookieHelper/cookieHelper", () => ({
  getAccessTokenCookie: vi.fn(),
}));

vi.mock("@/utils/jwtLib", () => ({
  decrypt: vi.fn(),
}));

describe("POST /api/authentication/is-auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({
      message: "Вы не авторизованы",
      messageMore:
        "Вы не авторизованы, так как не указан Access Token в Cookie",
    });
  });

  it("returns 401 when access token has expired", async () => {
    vi.mocked(decrypt).mockRejectedValue(
      new JWTExpired("expired", {
        claims: {},
        currentDate: new Date(),
      }),
    );

    const response = await POST();

    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({
      message: "Вы не авторизованы",
      messageMore: "Вы не авторизованы, так как Access Token просрочен",
    });
  });

  it("returns 200 when access token is valid", async () => {
    const response = await POST();

    expect(response.status).toBe(200);

    expect(await response.json()).toEqual({
      message: "Вы авторизованы",
    });

    expect(getAccessTokenCookie).toHaveBeenCalledOnce();

    expect(decrypt).toHaveBeenCalledWith("jwt-token");
  });

  it("returns 500 when getting access token cookie throws", async () => {
    vi.mocked(getAccessTokenCookie).mockRejectedValue(
      new Error("cookie error"),
    );

    const response = await POST();

    expect(response.status).toBe(500);

    expect(await response.json()).toEqual({
      message: "Error: cookie error",
    });
  });
});
