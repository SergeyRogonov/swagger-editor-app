"use client";

import { useState } from "react";
import type { OpenAPIV3 } from "openapi-types";
import { TryItOut } from "./TryItOut";

const METHOD_COLORS: Record<string, string> = {
  get: "bg-blue-600",
  post: "bg-green-600",
  put: "bg-yellow-600",
  patch: "bg-orange-500",
  delete: "bg-red-600",
  head: "bg-purple-600",
  options: "bg-slate-500",
};

type Props = {
  method: string;
  path: string;
  baseUrl: string;
  operation: OpenAPIV3.OperationObject;
};

function generateExample(schema: OpenAPIV3.SchemaObject): unknown {
  if (schema.example !== undefined) return schema.example;
  if (schema.type === "object" && schema.properties) {
    return Object.fromEntries(
      Object.entries(schema.properties).map(([key, prop]) => [
        key,
        generateExample(prop as OpenAPIV3.SchemaObject),
      ]),
    );
  }
  if (schema.type === "array" && schema.items) {
    return [generateExample(schema.items as OpenAPIV3.SchemaObject)];
  }
  const defaults: Record<string, unknown> = {
    string: "string",
    integer: 0,
    number: 0.0,
    boolean: true,
  };
  return defaults[schema.type ?? ""] ?? null;
}

function toXml(value: unknown, tag: string, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (Array.isArray(value)) {
    return value.map((item) => toXml(item, tag, indent)).join("\n");
  }
  if (value !== null && typeof value === "object") {
    const children = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => toXml(v, k, indent + 1))
      .join("\n");
    return `${pad}<${tag}>\n${children}\n${pad}</${tag}>`;
  }
  return `${pad}<${tag}>${value}</${tag}>`;
}

function formatExample(
  value: unknown,
  mime: string,
  schema?: OpenAPIV3.SchemaObject,
): string {
  if (mime.includes("xml")) {
    const rootTag = schema?.xml?.name ?? "root";
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(value, rootTag)}`;
  }
  if (mime.includes("x-www-form-urlencoded")) {
    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join("&");
    }
  }
  return JSON.stringify(value, null, 2);
}

function MediaContent({
  content,
  selectedMime,
  onMimeChange,
}: {
  content: Record<string, OpenAPIV3.MediaTypeObject>;
  selectedMime: string;
  onMimeChange: (mime: string) => void;
}) {
  const [tab, setTab] = useState<"schema" | "example">("schema");
  const mimeTypes = Object.keys(content);
  const media = content[selectedMime];
  const schema = media?.schema as OpenAPIV3.SchemaObject | undefined;

  const exampleValue = (() => {
    if (media?.example !== undefined) return media.example;
    if (media?.examples) {
      const first = Object.values(media.examples)[0] as OpenAPIV3.ExampleObject;
      return first?.value;
    }
    if (schema) return generateExample(schema);
    return null;
  })();

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {mimeTypes.length > 1 ? (
          <select
            value={selectedMime}
            onChange={(e) => onMimeChange(e.target.value)}
            className="bg-elevated border border-overlay rounded px-2 py-0.5 text-xs text-text-primary focus:outline-none focus:border-slate-500"
          >
            {mimeTypes.map((mime) => (
              <option key={mime} value={mime}>
                {mime}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-text-muted">{selectedMime}</span>
        )}

        <div className="flex border border-slate-700 rounded overflow-hidden text-xs">
          <button
            onClick={() => setTab("schema")}
            className={`px-2 py-0.5 ${tab === "schema" ? "bg-overlay text-text-primary" : "bg-elevated text-text-secondary hover:bg-overlay"}`}
          >
            Schema
          </button>
          <button
            onClick={() => setTab("example")}
            className={`px-2 py-0.5 ${tab === "example" ? "bg-overlay text-text-primary" : "bg-elevated text-text-secondary hover:bg-overlay"}`}
          >
            Example
          </button>
        </div>
      </div>

      <pre className="text-xs bg-base rounded p-2 overflow-auto text-text-primary max-h-40">
        {tab === "schema"
          ? JSON.stringify(schema, null, 2)
          : formatExample(exampleValue, selectedMime, schema)}
      </pre>
    </div>
  );
}

function ResponseItem({
  status,
  response,
}: {
  status: string;
  response: OpenAPIV3.ResponseObject;
}) {
  const mimeTypes = Object.keys(response.content ?? {});
  const [selectedMime, setSelectedMime] = useState(
    mimeTypes[0] ?? "application/json",
  );

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            status.startsWith("2")
              ? "bg-green-800 text-green-200"
              : status.startsWith("4")
                ? "bg-red-900 text-red-200"
                : status.startsWith("5")
                  ? "bg-orange-900 text-orange-200"
                  : "bg-slate-700 text-slate-300"
          }`}
        >
          {status}
        </span>
        <span className="text-text-secondary text-xs">
          {response.description}
        </span>
      </div>
      {response.content && (
        <MediaContent
          content={response.content}
          selectedMime={selectedMime}
          onMimeChange={setSelectedMime}
        />
      )}
    </div>
  );
}

export function EndpointItem({ method, path, baseUrl, operation }: Props) {
  const [open, setOpen] = useState(false);

  const parameters = (operation.parameters ??
    []) as OpenAPIV3.ParameterObject[];
  const byLocation = {
    path: parameters.filter((p) => p.in === "path"),
    query: parameters.filter((p) => p.in === "query"),
    header: parameters.filter((p) => p.in === "header"),
    cookie: parameters.filter((p) => p.in === "cookie"),
  };

  const requestBody = operation.requestBody as
    OpenAPIV3.RequestBodyObject | undefined;
  const responses = operation.responses as OpenAPIV3.ResponsesObject;

  const requestMimeTypes = Object.keys(requestBody?.content ?? {});
  const [selectedRequestMime, setSelectedRequestMime] = useState(
    requestMimeTypes[0] ?? "application/json",
  );

  const firstResponse = Object.values(responses)[0] as
    OpenAPIV3.ResponseObject | undefined;
  const acceptMime =
    Object.keys(firstResponse?.content ?? {})[0] ?? "application/json";

  return (
    <div className="border border-slate-700 rounded overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-elevated hover:bg-overlay text-left"
      >
        <span
          className={`${METHOD_COLORS[method] ?? "bg-slate-600"} text-white text-xs font-bold uppercase px-2 py-0.5 rounded w-16 text-center flex-none`}
        >
          {method}
        </span>
        <span className="font-mono text-sm text-text-primary flex-1">
          {path}
        </span>
        {operation.summary && (
          <span className="text-text-secondary text-sm hidden sm:block">
            {operation.summary}
          </span>
        )}
        <span className="text-text-muted text-xs ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 py-4 bg-surface space-y-4 text-sm">
          {operation.description && (
            <p className="text-text-secondary">{operation.description}</p>
          )}

          <TryItOut
            method={method}
            path={path}
            baseUrl={baseUrl}
            parameters={parameters}
            requestBody={requestBody}
            selectedMime={selectedRequestMime}
            acceptMime={acceptMime}
          />

          {Object.entries(byLocation).some(
            ([, params]) => params.length > 0,
          ) && (
            <div>
              <h4 className="border-l-2 border-blue-500 pl-2 font-semibold mb-2 text-text-primary">
                Parameters
              </h4>
              {Object.entries(byLocation).map(([loc, params]) =>
                params.length === 0 ? null : (
                  <div key={loc} className="mb-3">
                    <span className="text-xs uppercase text-text-muted font-semibold">
                      {loc}
                    </span>
                    <table className="w-full mt-1 text-xs">
                      <thead>
                        <tr className="text-text-muted text-left">
                          <th className="pr-4 pb-1">Name</th>
                          <th className="pr-4 pb-1">Required</th>
                          <th className="pr-4 pb-1">Type</th>
                          <th className="pb-1">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {params.map((p) => (
                          <tr key={p.name} className="border-t border-overlay">
                            <td className="pr-4 py-1 font-mono text-text-primary">
                              {p.name}
                            </td>
                            <td className="pr-4 py-1 text-text-secondary">
                              {p.required ? (
                                <span className="text-red-400">yes</span>
                              ) : (
                                "no"
                              )}
                            </td>
                            <td className="pr-4 py-1 text-text-secondary">
                              {(p.schema as OpenAPIV3.SchemaObject)?.type ??
                                "—"}
                            </td>
                            <td className="py-1 text-text-secondary">
                              {p.description ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
              )}
            </div>
          )}

          {requestBody && (
            <div data-testid="request-body">
              <h4 className="border-l-2 border-blue-500 pl-2 font-semibold mb-2 text-text-primary">
                Request Body
                {requestBody.required && (
                  <span className="text-red-400 text-xs ml-1">required</span>
                )}
              </h4>
              <MediaContent
                content={requestBody.content ?? {}}
                selectedMime={selectedRequestMime}
                onMimeChange={setSelectedRequestMime}
              />
            </div>
          )}

          <div>
            <h4 className="border-l-2 border-blue-500 pl-2 font-semibold mb-2 text-text-primary">
              Responses
            </h4>
            {Object.entries(responses).map(([status, response]) => (
              <ResponseItem
                key={status}
                status={status}
                response={response as OpenAPIV3.ResponseObject}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
