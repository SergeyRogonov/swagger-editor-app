import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function setAccessTokenCookie(
  response: NextResponse,
  accessToken: string,
) {
  response.cookies.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getAccessTokenCookie(): Promise<string> {
  const COOKIE_STORE = await cookies();
  const ACCESS_TOKEN = COOKIE_STORE.get("access_token")?.value || "";
  return ACCESS_TOKEN;
}

export function removeAccessTokenCookie(response: NextResponse) {
  response.cookies.delete("access_token");
  return response;
}
