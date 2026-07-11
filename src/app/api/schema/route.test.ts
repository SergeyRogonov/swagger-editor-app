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

function createNextRequestWithJson(
  payload: Record<string, unknown>,
): NextRequest {
  return new Request("http://localhost/api/schema", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }) as unknown as NextRequest;
}

function mockSupabaseChainForGet(args: {
  selectReturn?: unknown;
  maybeSingleReturnData?: unknown;
  maybeSingleReturnError?: { message: string } | null;
}) {
  const maybeSingleMock = vi.fn().mockResolvedValue({
    data: args.maybeSingleReturnData,
    error: args.maybeSingleReturnError
      ? { message: args.maybeSingleReturnError.message }
      : null,
  });

  const eqMock = vi.fn().mockReturnValue({
    maybeSingle: maybeSingleMock,
  });

  const selectMock = vi.fn().mockReturnValue({
    eq: eqMock,
  });

  const fromMock = vi.fn().mockReturnValue({
    select: selectMock,
  });

  return { fromMock, selectMock, eqMock, maybeSingleMock };
}

function mockSupabaseChainForUpsert(args: {
  upsertError?: { message: string } | null;
}) {
  const upsertMock = vi.fn().mockResolvedValue({
    error: args.upsertError ? { message: args.upsertError.message } : null,
  });

  const fromMock = vi.fn().mockReturnValue({
    upsert: upsertMock,
  });

  return { fromMock, upsertMock };
}

describe("schema/route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 401 when no token cookie", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock } = mockSupabaseChainForGet({
      maybeSingleReturnData: { schema_content: "abc" },
      maybeSingleReturnError: null,
    });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.GET();

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("GET returns 500 when supabase returns error", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock } = mockSupabaseChainForGet({
      maybeSingleReturnData: null,
      maybeSingleReturnError: { message: "db failed" },
    });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.GET();

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "db failed" });
  });

  it("GET returns 204 when no data", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock } = mockSupabaseChainForGet({
      maybeSingleReturnData: null,
      maybeSingleReturnError: null,
    });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.GET();

    expect(res.status).toBe(204);
  });

  it("GET returns schema content on success", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock } = mockSupabaseChainForGet({
      maybeSingleReturnData: { schema_content: "schema-1" },
      maybeSingleReturnError: null,
    });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.GET();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ content: "schema-1" });
  });

  it("POST returns 401 when no token cookie", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("");

    const res = await route.POST(createNextRequestWithJson({ content: "x" }));

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("POST returns 400 when content is not a string", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock } = mockSupabaseChainForUpsert({ upsertError: null });
    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.POST(createNextRequestWithJson({ content: 123 }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: "content is required" });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("POST returns 500 when upsert returns error", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock } = mockSupabaseChainForUpsert({
      upsertError: { message: "upsert failed" },
    });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.POST(
      createNextRequestWithJson({ content: "schema-x" }),
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "upsert failed" });
  });

  it("POST returns success true when upsert succeeds", async () => {
    vi.mocked(cookieHelper.getAccessTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtLib.decrypt).mockResolvedValue({
      data: { type: "access", userId: 123 },
    });

    const { fromMock, upsertMock } = mockSupabaseChainForUpsert({
      upsertError: null,
    });

    vi.mocked(supabaseSvc.createServiceClient).mockReturnValue({
      from: fromMock,
    } as unknown as ReturnType<typeof supabaseSvc.createServiceClient>);

    const res = await route.POST(
      createNextRequestWithJson({ content: "schema-x" }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true });

    expect(upsertMock).toHaveBeenCalledTimes(1);
  });
});
