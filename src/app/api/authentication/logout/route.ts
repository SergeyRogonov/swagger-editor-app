import { removeAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const RESPONSE = NextResponse.json(
      {
        message: "Вы вышли из аккаунта",
      },
      { status: 200 },
    );

    removeAccessTokenCookie(RESPONSE);

    return RESPONSE;
  } catch (exception) {
    return NextResponse.json(
      {
        message: `${exception}`,
      },
      { status: 500 },
    );
  }
}
