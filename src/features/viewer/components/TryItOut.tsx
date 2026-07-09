"use client";

import { useState } from "react";
import type { OpenAPIV3 } from "openapi-types";

type Parameter = OpenAPIV3.ParameterObject;

type Props = {
  method: string;
  path: string;
  baseUrl: string;
  parameters: Parameter[];
  requestBody?: OpenAPIV3.RequestBodyObject;
  selectedMime: string;
  acceptMime: string;
};

type ResponseResult = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
};

function formatResponseBody(body: unknown, contentType: string): string {
  const text = typeof body === "string" ? body : JSON.stringify(body, null, 2);

  if (contentType.includes("xml")) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "application/xml");
      const serializer = new XMLSerializer();
      const raw = serializer.serializeToString(doc);
      let indent = 0;
      return raw
        .replace(/></g, ">\n<")
        .split("\n")
        .map((line) => {
          if (line.match(/^<\/\w/)) indent--;
          const padded = "  ".repeat(Math.max(0, indent)) + line;
          if (line.match(/^<\w[^>]*[^/]>/) && !line.includes("</")) indent++;
          return padded;
        })
        .join("\n");
    } catch {
      return text;
    }
  }

  return text;
}

export function TryItOut({
  method,
  path,
  baseUrl,
  parameters,
  requestBody,
  selectedMime,
  acceptMime,
}: Props) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyText, setBodyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResponseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCurl, setShowCurl] = useState(false);

  const byLocation = {
    path: parameters.filter((p) => p.in === "path"),
    query: parameters.filter((p) => p.in === "query"),
    header: parameters.filter((p) => p.in === "header"),
    cookie: parameters.filter((p) => p.in === "cookie"),
  };

  const setParam = (name: string, value: string) =>
    setParamValues((prev) => ({ ...prev, [name]: value }));

  const buildUrl = () => {
    let resolvedPath = path;
    for (const p of byLocation.path) {
      resolvedPath = resolvedPath.replace(
        `{${p.name}}`,
        paramValues[p.name] ?? "",
      );
    }
    const query = byLocation.query
      .filter((p) => paramValues[p.name])
      .map(
        (p) =>
          `${encodeURIComponent(p.name)}=${encodeURIComponent(paramValues[p.name])}`,
      )
      .join("&");
    return `${baseUrl}${resolvedPath}${query ? `?${query}` : ""}`;
  };

  const buildHeaders = () => {
    const headers: Record<string, string> = {};
    for (const p of byLocation.header) {
      if (paramValues[p.name]) headers[p.name] = paramValues[p.name];
    }
    if (requestBody) headers["Content-Type"] = selectedMime;
    headers["Accept"] = acceptMime;
    return headers;
  };

  const buildCurl = () => {
    const url = buildUrl();
    const headers = buildHeaders();
    const parts = [`curl -X ${method.toUpperCase()} '${url}'`];
    for (const [key, value] of Object.entries(headers)) {
      parts.push(`  -H '${key}: ${value}'`);
    }
    if (bodyText && !["GET", "HEAD"].includes(method.toUpperCase())) {
      parts.push(`  -d '${bodyText.replace(/'/g, "\\'")}'`);
    }
    return parts.join(" \\\n");
  };

  const execute = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: buildUrl(),
          method,
          headers: buildHeaders(),
          body: bodyText ? JSON.parse(bodyText) : undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
      setShowCurl(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = async () => {
    await navigator.clipboard.writeText(buildCurl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-overlay mt-4 pt-4 space-y-4">
      <h4 className="border-l-2 border-blue-500 pl-2 font-semibold mb-2 text-text-primary">
        Try it out
      </h4>

      {showCurl && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase text-text-muted font-semibold">
              cURL
            </span>
            <button
              onClick={copyCurl}
              className="text-xs px-2 py-0.5 bg-elevated hover:bg-overlay text-text-primary rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="text-xs bg-base rounded p-2 overflow-auto text-text-primary max-h-32">
            {buildCurl()}
          </pre>
        </div>
      )}

      {Object.entries(byLocation).map(([loc, params]) =>
        params.length === 0 ? null : (
          <div key={loc}>
            <span className="text-xs uppercase text-text-muted font-semibold">
              {loc}
            </span>
            <div className="mt-1 space-y-2">
              {params.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <label className="text-xs font-mono text-text-primary w-32 flex-none">
                    {p.name}
                    {p.required && (
                      <span className="text-red-400 ml-0.5">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={p.description ?? p.name}
                    value={paramValues[p.name] ?? ""}
                    onChange={(e) => setParam(p.name, e.target.value)}
                    className="flex-1 bg-base border border-overlay rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-text-muted"
                  />
                </div>
              ))}
            </div>
          </div>
        ),
      )}

      {requestBody && (
        <div>
          <span className="text-xs uppercase text-text-muted font-semibold">
            body
            {requestBody.required && (
              <span className="text-red-400 ml-0.5">*</span>
            )}
          </span>
          <textarea
            rows={5}
            placeholder='{"key": "value"}'
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="mt-1 w-full bg-base border border-overlay rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none focus:border-text-muted resize-y"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={execute}
          disabled={loading}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded"
        >
          {loading ? "Executing..." : "Execute"}
        </button>
        <button
          onClick={() => {
            setBodyText("");
            setResult(null);
            setError(null);
            setShowCurl(false);
          }}
          className="px-4 py-1.5 bg-elevated hover:bg-overlay text-text-primary text-sm rounded"
        >
          Clear
        </button>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                result.status < 300
                  ? "bg-green-800 text-green-200"
                  : result.status < 500
                    ? "bg-red-900 text-red-200"
                    : "bg-orange-900 text-orange-200"
              }`}
            >
              {result.status} {result.statusText}
            </span>
          </div>

          <details className="text-xs">
            <summary className="text-text-muted cursor-pointer">
              Response headers
            </summary>
            <pre className="bg-base rounded p-2 mt-1 text-text-secondary overflow-auto max-h-32">
              {JSON.stringify(result.headers, null, 2)}
            </pre>
          </details>

          <div>
            <span className="text-xs text-text-muted">Response body</span>
            <pre className="bg-base rounded p-2 mt-1 text-xs text-text-primary overflow-auto max-h-60">
              {formatResponseBody(
                result.body,
                result.headers["content-type"] ?? acceptMime,
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
