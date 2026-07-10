import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";
import { createServiceClient } from "@/utils/supabase/service";

async function getUserId(): Promise<number | null> {
  const token = await getAccessTokenCookie();

  if (!token) return null;

  try {
    const payload = await decrypt(token);
    return payload.data?.userId ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("user_schemas")
    .select("schema_content")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({
    content: data.schema_content,
  });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  if (typeof content !== "string") {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("user_schemas").upsert(
    {
      user_id: userId,
      schema_content: content,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
