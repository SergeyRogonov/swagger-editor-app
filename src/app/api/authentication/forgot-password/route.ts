import { ISupabaseForgetPasswordUsersDto } from "@/types/users";
import { sendEmail } from "@/utils/emailLib";
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
        { message: "EMAIL_IS_REQUIRED" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "INVALID_EMAIL" }, { status: 400 });
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
          message: errorFindUserByEmail.message,
        },
        { status: 500 },
      );
    }

    if (usersByEmail.length == 0) {
      return NextResponse.json(
        {
          message: "USER_NOT_FOUND",
        },
        { status: 404 },
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
          message: updateError.message,
        },
        { status: 500 },
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

    const RESPONSE = NextResponse.json({ message: "SUCCESS" }, { status: 200 });

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
