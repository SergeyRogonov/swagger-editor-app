import {
  getAccessTokenCookie,
  removeAccessTokenCookie,
} from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";
import { createClient } from "@/utils/supabase/server";
import { JWTExpired } from "jose/errors";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

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

    const { error: errorRemoveAccessToken } = await supabase
      .from("access_tokens")
      .delete()
      .eq("access_token", ACCESS_TOKEN);

    if (errorRemoveAccessToken) {
      return NextResponse.json(
        {
          message: errorRemoveAccessToken.message,
        },
        { status: 500 },
      );
    }

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
