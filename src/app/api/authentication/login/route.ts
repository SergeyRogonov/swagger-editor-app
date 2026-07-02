import { ISupabasePasswordUsersDto } from "@/app/dto/users";
import { setAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import isValidEmail from "@/utils/isValidEmail/isValidEmail";
import { encrypt } from "@/utils/jwtLib";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Не указан параметр email" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Вы передаете не валидный email" },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Не указан параметр password" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: usersByEmail, error: errorFindUserByEmail } = (await supabase
      .from("users")
      .select("id, password_hash")
      .eq("email", email)
      .limit(1)) as ISupabasePasswordUsersDto;

    if (errorFindUserByEmail) {
      return NextResponse.json(
        {
          message: errorFindUserByEmail.message,
        },
        { status: 500 },
      );
    }

    if (usersByEmail.length == 0) {
      return NextResponse.json(
        {
          message: "Пользователь с таким email не зарегистрирован",
        },
        { status: 404 },
      );
    }

    if (usersByEmail[0].password_hash !== password) {
      return NextResponse.json(
        {
          message: "Не верный пароль",
        },
        { status: 409 },
      );
    }

    const USER_ID = usersByEmail[0].id;
    const ACCESS_TOKEN = await encrypt({
      data: {
        userId: USER_ID,
        type: "access",
      },
    });

    const { error: errorInsertAccessToken } = await supabase
      .from("access_tokens")
      .insert([
        {
          id_user: USER_ID,
          access_token: ACCESS_TOKEN,
          ip_x_forwarded_for: request.headers.get("x-forwarded-for"),
          ip_x_real_ip: request.headers.get("x-real-ip"),
          ip_cf_connecting_ip: request.headers.get("cf-connecting-ip"),
        },
      ]);

    if (errorInsertAccessToken) {
      return NextResponse.json(
        {
          message: errorInsertAccessToken.message,
        },
        { status: 500 },
      );
    }

    const RESPONSE = NextResponse.json(
      {
        message: "Вы авторизованы",
        data: {
          accessToken: ACCESS_TOKEN,
        },
      },
      { status: 200 },
    );

    setAccessTokenCookie(RESPONSE, ACCESS_TOKEN);

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
