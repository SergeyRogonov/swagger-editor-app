import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import type { ReactElement } from "react";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }): ReactElement => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

const getTranslationsMock = vi.fn();

vi.mock("next-intl/server", () => ({
  getTranslations: (...args: unknown[]) => getTranslationsMock(...args),
}));

const getAccessTokenCookieMock = vi.fn();

vi.mock("@/utils/cookieHelper/cookieHelper", () => ({
  getAccessTokenCookie: (...args: unknown[]) =>
    getAccessTokenCookieMock(...args),
}));

const decryptMock = vi.fn();

vi.mock("@/utils/jwtLib", () => ({
  decrypt: (...args: unknown[]) => decryptMock(...args),
}));

type HistoryRecord = {
  id: number;
  method: string;
  url: string;
  req_headers: Record<string, string>;
  req_body: string | null;
  res_status: number;
  res_headers: Record<string, string>;
  res_body: string | null;
  executed_at: string;
  duration_ms: number | null;
  req_size: number | null;
  res_size: number | null;
  error_details: string | null;
};

type SupabaseQuery = {
  select: () => SupabaseQuery;
  eq: (column: string, value: string) => SupabaseQuery;
  order: (column: string, opts: { ascending: boolean }) => SupabaseQuery;
  limit: (n: number) => Promise<{ data: HistoryRecord[] | null }>;
};

const createServiceClientMock = vi.fn();

vi.mock("@/utils/supabase/service", () => ({
  createServiceClient: () => createServiceClientMock(),
}));

function mockSupabaseRecords(records: HistoryRecord[]) {
  const supabaseFrom: SupabaseQuery = {
    select: () => supabaseFrom,
    eq: () => supabaseFrom,
    order: () => supabaseFrom,
    limit: () => Promise.resolve({ data: records }),
  };

  createServiceClientMock.mockReturnValue({
    from: () => supabaseFrom,
  });
}

type TranslationFn = ((
  key: string,
  values?: Record<string, unknown>,
) => string) & {
  rich: (key: string, values: Record<string, unknown>) => React.ReactNode;
};

function setupTranslations() {
  getTranslationsMock.mockImplementation(() => {
    const t: TranslationFn = ((key: string) => {
      const map: Record<string, string> = {
        title: "History",
        empty: "No history yet.",
        goTo: "Go to the <editor>Editor</editor> to make your first request.",
        method: "Method",
        status: "Status",
        duration: "Duration",
        timestamp: "Timestamp",
        requestSize: "Request size",
        responseSize: "Response size",
        endpoint: "Endpoint",
        error: "Error",
        requestBody: "Request body",
        responseBody: "Response body",
        responseHeaders: "Response headers",
        none: "None",
        durationUnit: "duration",
        requestSizeUnit: "req size",
        responseSizeUnit: "res size",
      };
      return map[key] ?? key;
    }) as TranslationFn;

    t.rich = (
      key: string,
      values: Record<string, unknown>,
    ): React.ReactNode => {
      if (key === "goTo") {
        return (
          <>
            Go to the{" "}
            {(values.editor as (chunks: React.ReactNode) => React.ReactNode)(
              "Editor",
            )}{" "}
            to make your first request.
          </>
        );
      }

      return key;
    };

    return t;
  });
}

async function renderPage() {
  const mod = await import("./page");
  const Page = mod.default as () => Promise<ReactElement>;
  return render(await Page());
}

describe("HistoryPage", () => {
  beforeEach(() => {
    redirectMock.mockClear();

    getAccessTokenCookieMock.mockReset();
    decryptMock.mockReset();
    createServiceClientMock.mockReset();

    getTranslationsMock.mockReset();
    setupTranslations();
  });

  it("redirects to / when no access token", async () => {
    getAccessTokenCookieMock.mockResolvedValue(null);

    await renderPage();

    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("redirects to / when decrypt has no userId", async () => {
    getAccessTokenCookieMock.mockResolvedValue("token");
    decryptMock.mockResolvedValue({ data: {} });

    await renderPage();

    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("renders empty state when there are no records", async () => {
    getAccessTokenCookieMock.mockResolvedValue("token");
    decryptMock.mockResolvedValue({ data: { userId: "user-1" } });

    mockSupabaseRecords([]);

    await renderPage();

    expect(screen.getByText("No history yet.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Editor" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders a record and pretty-prints JSON response body", async () => {
    getAccessTokenCookieMock.mockResolvedValue("token");
    decryptMock.mockResolvedValue({ data: { userId: "user-1" } });

    mockSupabaseRecords([
      {
        id: 1,
        method: "GET",
        url: "/api/things",
        req_headers: { "content-type": "application/json" },
        req_body: '{"a":1}',
        res_status: 200,
        res_headers: { "x-test": "1" },
        res_body: '{"ok":true}',
        executed_at: "2026-01-01T00:00:00.000Z",
        duration_ms: 123,
        req_size: 10,
        res_size: 20,
        error_details: null,
      },
    ]);

    await renderPage();

    const endpointLabel = screen.getByText("Endpoint");
    const endpointSection = endpointLabel.closest("div");
    expect(
      within(endpointSection as HTMLElement).getByText("/api/things"),
    ).toBeInTheDocument();

    const statusLabel = screen.getByText("Status");
    const statusSection = statusLabel.closest("div")!;

    expect(within(statusSection).getByText("200")).toBeInTheDocument();
  });

  it("falls back to raw response body when JSON.parse fails", async () => {
    getAccessTokenCookieMock.mockResolvedValue("token");
    decryptMock.mockResolvedValue({ data: { userId: "user-1" } });

    mockSupabaseRecords([
      {
        id: 2,
        method: "POST",
        url: "/api/bad-json",
        req_headers: {},
        req_body: null,
        res_status: 500,
        res_headers: {},
        res_body: "NOT_JSON",
        executed_at: "2026-01-01T00:00:00.000Z",
        duration_ms: null,
        req_size: null,
        res_size: null,
        error_details: null,
      },
    ]);

    await renderPage();

    expect(screen.getByText("NOT_JSON")).toBeInTheDocument();
  });
});
