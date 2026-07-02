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
          message: "Вы не авторизованы",
          messageMore:
            "Вы не авторизованы, так как не указан Access Token в Cookie",
        },
        { status: 401 },
      );
    }

    try {
      await decrypt(ACCESS_TOKEN);
    } catch (exception) {
      if (exception instanceof JWTExpired) {
        return NextResponse.json(
          {
            message: "Вы не авторизованы",
            messageMore: "Вы не авторизованы, так как Access Token просрочен",
          },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(
      {
        message: "Вы авторизованы",
      },
      { status: 200 },
    );
  } catch (exception) {
    return NextResponse.json(
      {
        message: `${exception}`,
      },
      { status: 500 },
    );
  }
}
