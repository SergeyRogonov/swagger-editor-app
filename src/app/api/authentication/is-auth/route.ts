import { getAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";
import { JWTExpired } from "jose/errors";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const ACCESS_TOKEN: string = await getAccessTokenCookie();

    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        {
          status: 401,
          message: "NO_AUTH_NO_TOKEN",
        },
        { status: 200 },
      );
    }

    try {
      await decrypt(ACCESS_TOKEN);
    } catch (exception) {
      if (exception instanceof JWTExpired) {
        return NextResponse.json(
          {
            status: 401,
            message: "NO_AUTH_EXPIRED_TOKEN",
          },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      {
        status: 200,
        message: "AUTH_SUCCESS",
      },
      { status: 200 },
    );
  } catch (exception) {
    return NextResponse.json(
      {
        status: 500,
        message: `${exception}`,
      },
      { status: 200 },
    );
  }
}
