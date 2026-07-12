import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAccessTokenCookie } from "@/utils/cookieHelper/cookieHelper";
import { decrypt } from "@/utils/jwtLib";
import { createServiceClient } from "@/utils/supabase/service";

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

type ProcessedHistoryRecord = HistoryRecord & {
  methodColor: string;
  statusClassName: string;
  executedAtLabel: string;
  responseBodyText: string;
  responseHeadersText: string;
};

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-600",
  POST: "bg-green-600",
  PUT: "bg-yellow-600",
  PATCH: "bg-orange-500",
  DELETE: "bg-red-600",
};

const getStatusClassName = (status: number) => {
  if (status < 300) return "bg-green-800 text-green-200";
  if (status < 500) return "bg-red-900 text-red-200";
  return "bg-orange-900 text-orange-200";
};

const formatExecutedAt = (value: string) => new Date(value).toLocaleString();

const formatResponseBody = (body: string | null) => {
  if (!body) return null;

  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
};

const getProcessedRecords = (
  records: HistoryRecord[],
  t: Awaited<ReturnType<typeof getTranslations>>,
): ProcessedHistoryRecord[] =>
  records.map((record) => ({
    ...record,
    methodColor: METHOD_COLORS[record.method] ?? "bg-text-muted",
    statusClassName: getStatusClassName(record.res_status),
    executedAtLabel: formatExecutedAt(record.executed_at),
    responseBodyText: formatResponseBody(record.res_body) ?? t("none"),
    responseHeadersText: JSON.stringify(record.res_headers, null, 2),
  }));

export default async function HistoryPage() {
  let records: HistoryRecord[] = [];

  try {
    const accessToken = await getAccessTokenCookie();
    if (!accessToken) redirect("/");

    const payload = await decrypt(accessToken);
    const userId = payload.data?.userId;
    if (!userId) redirect("/");

    const supabase = createServiceClient();
    const { data } = await supabase
      .from("request_history")
      .select("*")
      .eq("user_id", userId)
      .order("executed_at", { ascending: false })
      .limit(100);
    records = (data as HistoryRecord[]) ?? [];
  } catch {
    redirect("/");
  }

  const t = await getTranslations("history");
  const processedRecords = getProcessedRecords(records, t);
  const hasRecords = processedRecords.length > 0;
  const emptyStateContent = t.rich("goTo", {
    editor: (chunks) => (
      <Link href="/" className="text-accent hover:underline">
        {chunks}
      </Link>
    ),
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      {!hasRecords ? (
        <div className="text-text-secondary space-y-3">
          <p>{t("empty")}</p>
          <p>{emptyStateContent}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {processedRecords.map((record) => (
            <details
              key={record.id}
              className="border border-overlay rounded overflow-hidden"
            >
              <summary className="flex items-center gap-3 px-4 py-3 bg-elevated cursor-pointer hover:bg-surface">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded text-white ${record.methodColor}`}
                >
                  {record.method}
                </span>
                <span className="font-mono text-sm text-text-primary flex-1 truncate">
                  {record.url}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${record.statusClassName}`}
                >
                  {record.res_status || "ERR"}
                </span>
                {record.duration_ms != null && (
                  <span className="text-text-secondary text-xs">
                    {t("durationUnit", { duration: record.duration_ms })}
                  </span>
                )}
                <span className="text-text-muted text-xs">
                  {record.executedAtLabel}
                </span>
              </summary>

              <div className="px-4 py-3 bg-surface space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-text-secondary">
                  <div>
                    <span className="uppercase font-semibold text-text-muted">
                      {t("method")}
                    </span>
                    <p>{record.method}</p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-text-muted">
                      {t("status")}
                    </span>
                    <p>{record.res_status || t("none")}</p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-text-muted">
                      {t("duration")}
                    </span>
                    <p>
                      {record.duration_ms != null
                        ? t("durationUnit", { duration: record.duration_ms })
                        : t("none")}
                    </p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-text-muted">
                      {t("timestamp")}
                    </span>
                    <p>{record.executedAtLabel}</p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-text-muted">
                      {t("requestSize")}
                    </span>
                    <p>
                      {record.req_size != null
                        ? t("requestSizeUnit", { size: record.req_size })
                        : t("none")}
                    </p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-text-muted">
                      {t("responseSize")}
                    </span>
                    <p>
                      {record.res_size != null
                        ? t("responseSizeUnit", { size: record.res_size })
                        : t("none")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="uppercase font-semibold text-text-muted">
                      {t("endpoint")}
                    </span>
                    <p className="font-mono truncate">{record.url}</p>
                  </div>
                </div>

                {record.error_details && (
                  <div>
                    <span className="text-red-400 uppercase font-semibold">
                      {t("error")}
                    </span>
                    <pre className="mt-1 bg-base rounded p-2 text-red-300 overflow-auto max-h-24">
                      {record.error_details}
                    </pre>
                  </div>
                )}

                {record.req_body && (
                  <div>
                    <span className="text-text-muted uppercase font-semibold">
                      {t("requestBody")}
                    </span>
                    <pre className="mt-1 bg-base rounded p-2 text-text-primary overflow-auto max-h-32">
                      {record.req_body}
                    </pre>
                  </div>
                )}

                <div>
                  <span className="text-text-muted uppercase font-semibold">
                    {t("responseBody")}
                  </span>
                  <pre className="mt-1 bg-base rounded p-2 text-text-primary overflow-auto max-h-40">
                    {record.responseBodyText}
                  </pre>
                </div>

                <details>
                  <summary className="text-text-muted cursor-pointer">
                    {t("responseHeaders")}
                  </summary>
                  <pre className="mt-1 bg-base rounded p-2 text-text-secondary overflow-auto max-h-32">
                    {record.responseHeadersText}
                  </pre>
                </details>
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
