import { ISupabaseForgetPasswordUsersDto } from "@/types/users";
import sendEmail from "@/utils/sendEmail/sendEmail";
import generateRandomPassword from "@/utils/generateRandomPassword/generateRandomPassword";
import { generateHashPassword } from "@/utils/hashPasswordLib/hashPasswordLib";
import isValidEmail from "@/utils/isValidEmail/isValidEmail";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email } = body;

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

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: usersByEmail, error: errorFindUserByEmail } = (await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .limit(1)) as ISupabaseForgetPasswordUsersDto;

    if (errorFindUserByEmail) {
      return NextResponse.json(
        {
          status: 500,
          message: errorFindUserByEmail.message,
        },
        { status: 200 },
      );
    }

    if (usersByEmail.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          message: "USER_NOT_FOUND",
        },
        { status: 200 },
      );
    }

    const USER_ID = usersByEmail[0].id;
    const USER_EMAIL = usersByEmail[0].email;
    const NEW_PASSWORD = await generateRandomPassword();
    const HASH_PASSWORD = await generateHashPassword(NEW_PASSWORD);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: HASH_PASSWORD })
      .eq("id", USER_ID)
      .eq("email", USER_EMAIL);

    if (updateError) {
      return NextResponse.json(
        {
          status: 500,
          message: updateError.message,
        },
        { status: 200 },
      );
    }

    const EMAIL_TO: string = USER_EMAIL;
    const EMAIL_TITLE: string = "Change password";
    const EMAIL_HTML: string = `
      <p>Your new password: ${NEW_PASSWORD}.</p>
      <p>Date and time of sending: ${new Date().toJSON().slice(0, 19)}.</p>
      <p>After logging in with the new generated password, change your password to a new one.</p>
    `;

    await sendEmail(EMAIL_TO, EMAIL_TITLE, EMAIL_HTML);

    const RESPONSE = NextResponse.json(
      {
        status: 200,
        message: "SUCCESS",
      },
      { status: 200 },
    );

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
