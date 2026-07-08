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

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-600",
  POST: "bg-green-600",
  PUT: "bg-yellow-600",
  PATCH: "bg-orange-500",
  DELETE: "bg-red-600",
};

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

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      {records.length === 0 ? (
        <div className="text-slate-400 space-y-3">
          <p>{t("empty")}</p>
          <p>
            {t.rich("goTo", {
              editor: (chunks) => (
                <Link href="/" className="text-blue-400 hover:underline">
                  {chunks}
                </Link>
              ),
              viewer: (chunks) => (
                <Link href="/" className="text-blue-400 hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <details
              key={r.id}
              className="border border-slate-700 rounded overflow-hidden"
            >
              <summary className="flex items-center gap-3 px-4 py-3 bg-slate-800 cursor-pointer hover:bg-slate-750">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded text-white ${METHOD_COLORS[r.method] ?? "bg-slate-500"}`}
                >
                  {r.method}
                </span>
                <span className="font-mono text-sm text-slate-100 flex-1 truncate">
                  {r.url}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    r.res_status < 300
                      ? "bg-green-800 text-green-200"
                      : r.res_status < 500
                        ? "bg-red-900 text-red-200"
                        : "bg-orange-900 text-orange-200"
                  }`}
                >
                  {r.res_status || "ERR"}
                </span>
                {r.duration_ms != null && (
                  <span className="text-slate-400 text-xs">
                    {t("durationUnit", { duration: r.duration_ms })}
                  </span>
                )}
                <span className="text-slate-500 text-xs">
                  {new Date(r.executed_at).toLocaleString()}
                </span>
              </summary>

              <div className="px-4 py-3 bg-slate-900 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-slate-400">
                  <div>
                    <span className="uppercase font-semibold text-slate-500">
                      {t("method")}
                    </span>
                    <p>{r.method}</p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-slate-500">
                      {t("status")}
                    </span>
                    <p>{r.res_status || t("none")}</p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-slate-500">
                      {t("duration")}
                    </span>
                    <p>
                      {r.duration_ms != null
                        ? t("durationUnit", { duration: r.duration_ms })
                        : t("none")}
                    </p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-slate-500">
                      {t("timestamp")}
                    </span>
                    <p>{new Date(r.executed_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-slate-500">
                      {t("requestSize")}
                    </span>
                    <p>
                      {r.req_size != null
                        ? t("requestSizeUnit", { size: r.req_size })
                        : t("none")}
                    </p>
                  </div>
                  <div>
                    <span className="uppercase font-semibold text-slate-500">
                      {t("responseSize")}
                    </span>
                    <p>
                      {r.res_size != null
                        ? t("responseSizeUnit", { size: r.res_size })
                        : t("none")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="uppercase font-semibold text-slate-500">
                      {t("endpoint")}
                    </span>
                    <p className="font-mono truncate">{r.url}</p>
                  </div>
                </div>

                {r.error_details && (
                  <div>
                    <span className="text-red-400 uppercase font-semibold">
                      {t("error")}
                    </span>
                    <pre className="mt-1 bg-slate-950 rounded p-2 text-red-300 overflow-auto max-h-24">
                      {r.error_details}
                    </pre>
                  </div>
                )}

                {r.req_body && (
                  <div>
                    <span className="text-slate-500 uppercase font-semibold">
                      {t("requestBody")}
                    </span>
                    <pre className="mt-1 bg-slate-950 rounded p-2 text-slate-300 overflow-auto max-h-32">
                      {r.req_body}
                    </pre>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 uppercase font-semibold">
                    {t("responseBody")}
                  </span>
                  <pre className="mt-1 bg-slate-950 rounded p-2 text-slate-300 overflow-auto max-h-40">
                    {r.res_body
                      ? (() => {
                          try {
                            return JSON.stringify(
                              JSON.parse(r.res_body),
                              null,
                              2,
                            );
                          } catch {
                            return r.res_body;
                          }
                        })()
                      : t("none")}
                  </pre>
                </div>

                <details>
                  <summary className="text-slate-500 cursor-pointer">
                    {t("responseHeaders")}
                  </summary>
                  <pre className="mt-1 bg-slate-950 rounded p-2 text-slate-400 overflow-auto max-h-32">
                    {JSON.stringify(r.res_headers, null, 2)}
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
