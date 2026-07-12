import { ISupabaseUsersDto } from "@/types/users";
import { setAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { generateHashPassword } from "@/utils/hashPasswordLib/hashPasswordLib";
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
        {
          status: 400,
          message: "EMAIL_IS_REQUIRED",
        },
        { status: 200 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          status: 400,
          message: "INVALID_EMAIL",
        },
        { status: 200 },
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          status: 400,
          message: "PASSWORD_IS_REQUIRED",
        },
        { status: 200 },
      );
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: usersByEmail, error: errorFindUserByEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (errorFindUserByEmail) {
      return NextResponse.json(
        {
          status: 500,
          message: errorFindUserByEmail.message,
        },
        { status: 200 },
      );
    }

    if (usersByEmail.length > 0) {
      return NextResponse.json(
        {
          status: 409,
          message: "EMAIL_ALREADY_TAKEN",
        },
        { status: 200 },
      );
    }

    const HASH_PASSWORD = await generateHashPassword(password);

    const { data: newUser, error: errorCreateNewUser } = (await supabase
      .from("users")
      .insert([
        {
          email: email,
          password_hash: HASH_PASSWORD,
        },
      ])
      .select()) as ISupabaseUsersDto;

    if (errorCreateNewUser) {
      return NextResponse.json(
        {
          status: 500,
          message: errorCreateNewUser.message,
        },
        { status: 200 },
      );
    }

    const USER_ID = newUser[0].id;
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
          status: 500,
          message: errorInsertAccessToken.message,
        },
        { status: 200 },
      );
    }

    const RESPONSE = NextResponse.json(
      {
        status: 201,
        message: "AUTH_SUCCESS",
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
        status: 500,
        message: `${exception}`,
      },
      { status: 200 },
    );
  }
}
