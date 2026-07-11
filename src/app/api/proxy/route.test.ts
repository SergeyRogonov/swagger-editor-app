import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

vi.mock("@/utils/cookieHelper/cookieHelper", () => ({
  getAccessTokenCookie: vi.fn(),
}));

vi.mock("@/utils/jwtLib", () => ({
  decrypt: vi.fn(),
}));

vi.mock("@/utils/supabase/service", () => ({
  createServiceClient: vi.fn(),
}));

const cookieHelper = await import("@/utils/cookieHelper/cookieHelper");
const jwtLib = await import("@/utils/jwtLib");
const supabaseSvc = await import("@/utils/supabase/service");

const route = await import("./route");

type JsonValue =
  string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function createNextRequestWithJson(
  payload: Record<string, unknown>,
): NextRequest {
  return new Request("http://localhost/api/proxy", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload as Record<string, JsonValue>),
  }) as unknown as NextRequest;
}

describe("proxy/route POST", () => {
  const fetchMock = vi.fn();
  const insertMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    insertMock.mockReset();

    vi.stubGlobal("fetch", fetchMock);

    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);
  });

  it("returns 400 when url is missing", async () => {
    const req = createNextRequestWithJson({ method: "GET" });

    const res = await route.POST(req);

    expect(res).toBeInstanceOf(NextResponse);
    const body = await res.json();
    expect(body).toEqual({ error: "url and method are required" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("records history and returns 502 when fetch throws", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const req = createNextRequestWithJson({
      url: "https://example.com/data",
      method: "POST",
      headers: { "x-a": "b" },
      body: { hello: "world" },
    });

    const res = await route.POST(req);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = await res.json();
    expect(body).toEqual({ error: "network down" });
    expect(res.status).toBe(502);

    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(row.user_id).toBe(123);
    expect(row.method).toBe("POST");
    expect(row.url).toBe("https://example.com/data");
    expect(row.res_status).toBe(0);
    expect(row.error_details).toBe("network down");
    expect(row.req_headers).toEqual({ "x-a": "b" });
    expect(row.req_body).toBe(JSON.stringify({ hello: "world" }));
    expect(typeof row.duration_ms).toBe("number");
    expect(typeof row.req_size).toBe("number");
  });

  it("parses JSON response and records history on success", async () => {
    const responseHeaders = new Headers({
      "content-type": "application/json",
      "x-r": "1",
    });
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true, n: 3 }), {
        status: 201,
        statusText: "Created",
        headers: responseHeaders,
      }),
    );

    const reqHeaders: Record<string, string> = { "x-test": "1" };

    const req = createNextRequestWithJson({
      url: "https://example.com/create",
      method: "post",
      headers: reqHeaders,
      body: { a: 1 },
    });

    const res = await route.POST(req);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const fetchCall = fetchMock.mock.calls[0]?.[1] as {
      method?: string;
      headers?: Record<string, string>;
      body?: string;
    };
    expect(fetchCall.method).toBe("POST");
    expect(fetchCall.headers).toEqual(reqHeaders);
    expect(fetchCall.body).toBe(JSON.stringify({ a: 1 }));

    const body = await res.json();
    expect(body.status).toBe(201);
    expect(body.statusText).toBe("Created");
    expect(body.headers["content-type"]).toBe("application/json");
    expect(body.headers["x-r"]).toBe("1");
    expect(body.body).toEqual({ ok: true, n: 3 });

    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(row.user_id).toBe(123);
    expect(row.method).toBe("POST");
    expect(row.url).toBe("https://example.com/create");
    expect(row.res_status).toBe(201);
    expect(row.error_details).toBe(null);
    expect(row.res_headers).toEqual({
      "content-type": "application/json",
      "x-r": "1",
    });
    expect(row.res_body).toBe(JSON.stringify({ ok: true, n: 3 }));
    expect(typeof row.duration_ms).toBe("number");
    expect(typeof row.req_size).toBe("number");
    expect(typeof row.res_size).toBe("number");
  });

  it("handles non-JSON response body (returns raw text) and still records history", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("not json", {
        status: 200,
        statusText: "OK",
        headers: new Headers({ "x-plain": "y" }),
      }),
    );

    const req = createNextRequestWithJson({
      url: "https://example.com/text",
      method: "GET",
      headers: { "x-q": "z" },
      body: null,
    });

    const res = await route.POST(req);
    const body = await res.json();

    expect(body.status).toBe(200);
    expect(body.body).toBe("not json");
    expect(body.headers["x-plain"]).toBe("y");

    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(row.method).toBe("GET");
    expect(row.req_body).toBe(null);
    expect(row.res_body).toBe("not json");
    expect(row.error_details).toBe(null);
  });

  it("does not record history when no access token cookie exists", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("");

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: 1 }), {
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "application/json" }),
      }),
    );

    const req = createNextRequestWithJson({
      url: "https://example.com/no-token",
      method: "POST",
      headers: {},
      body: { x: 1 },
    });

    const res = await route.POST(req);
    const body = await res.json();
    expect(body.body).toEqual({ ok: 1 });

    expect(insertMock).not.toHaveBeenCalled();
  });
});
