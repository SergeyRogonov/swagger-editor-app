import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";
import { createServiceClient } from "@/utils/supabase/service";

export async function POST(req: NextRequest) {
  const { url, method, headers: reqHeaders, body } = await req.json();

  if (!url || !method) {
    return NextResponse.json(
      { error: "url and method are required" },
      { status: 400 },
    );
  }

  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: reqHeaders ?? {},
    body: ["GET", "HEAD"].includes(method.toUpperCase())
      ? undefined
      : body
        ? JSON.stringify(body)
        : undefined,
  });

  const responseText = await response.text();
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  let responseBody: unknown;
  try {
    responseBody = JSON.parse(responseText);
  } catch {
    responseBody = responseText;
  }

  try {
    const accessToken = await getAccessTokenCookie();
    if (accessToken) {
      const payload = await decrypt(accessToken);
      const userId = payload.data?.userId;
      if (userId) {
        const supabase = createServiceClient();
        await supabase.from("request_history").insert({
          user_id: userId,
          method: method.toUpperCase(),
          url,
          req_headers: reqHeaders ?? {},
          req_body: body ? JSON.stringify(body) : null,
          res_status: response.status,
          res_headers: responseHeaders,
          res_body: responseText,
        });
      }
    }
  } catch {
    // silently ignore — history saving should never break the proxy
  }

  return NextResponse.json({
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body: responseBody,
  });
}
