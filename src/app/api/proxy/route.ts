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

  const reqBodyStr = body ? JSON.stringify(body) : null;
  const reqSize = reqBodyStr ? new TextEncoder().encode(reqBodyStr).length : 0;

  const start = Date.now();
  let response: Response;
  let errorDetails: string | null = null;

  try {
    response = await fetch(url, {
      method: method.toUpperCase(),
      headers: reqHeaders ?? {},
      body: ["GET", "HEAD"].includes(method.toUpperCase())
        ? undefined
        : (reqBodyStr ?? undefined),
    });
  } catch (err) {
    errorDetails = err instanceof Error ? err.message : String(err);

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
            req_body: reqBodyStr,
            res_status: 0,
            res_headers: {},
            res_body: null,
            duration_ms: Date.now() - start,
            req_size: reqSize,
            res_size: 0,
            error_details: errorDetails,
          });
        }
      }
    } catch {
      /* ignore */
    }

    return NextResponse.json({ error: errorDetails }, { status: 502 });
  }

  const durationMs = Date.now() - start;
  const responseText = await response.text();
  const resSize = new TextEncoder().encode(responseText).length;

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
          req_body: reqBodyStr,
          res_status: response.status,
          res_headers: responseHeaders,
          res_body: responseText,
          duration_ms: durationMs,
          req_size: reqSize,
          res_size: resSize,
          error_details: null,
        });
      }
    }
  } catch {
    /* ignore */
  }

  return NextResponse.json({
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body: responseBody,
  });
}
