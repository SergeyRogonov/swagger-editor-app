import { ISupabaseUsersDto } from "@/app/dto/users";
import { setAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import isValidEmail from "@/utils/isValidEmail/isValidEmail";
import { encrypt } from "@/utils/jwtLib";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
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

    const { data: usersByEmail, error: errorFindUserByEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (errorFindUserByEmail) {
      return NextResponse.json(
        {
          message: errorFindUserByEmail.message,
        },
        { status: 500 },
      );
    }

    if (usersByEmail.length > 0) {
      return NextResponse.json(
        {
          message: "Такой email уже занят",
        },
        { status: 409 },
      );
    }

    const { data: newUser, error: errorCreateNewUser } = (await supabase
      .from("users")
      .insert([
        {
          email: email,
          password_hash: password,
        },
      ])
      .select()) as ISupabaseUsersDto;

    if (errorCreateNewUser) {
      return NextResponse.json(
        {
          message: errorCreateNewUser.message,
        },
        { status: 500 },
      );
    }

    const USER_ID = newUser[0].id;
    const ACCESS_TOKEN = await encrypt({
      data: {
        userId: USER_ID,
        type: "access",
      },
    });

    setAccessTokenCookie(response, ACCESS_TOKEN);

    return NextResponse.json(
      {
        message: "Вы зарегистрированы",
        data: {
          accessToken: ACCESS_TOKEN,
        },
      },
      { status: 201 },
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
