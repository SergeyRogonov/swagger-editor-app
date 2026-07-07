"use client";

import { useState } from "react";
import type { OpenAPIV3 } from "openapi-types";
import { EndpointItem } from "./EndpointItem";

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
] as const;

type EndpointEntry = {
  method: string;
  path: string;
  operation: OpenAPIV3.OperationObject;
};
type Props = { schema: OpenAPIV3.Document };

function TagGroup({
  tag,
  description,
  endpoints,
  baseUrl,
}: {
  tag: string;
  description?: string;
  endpoints: EndpointEntry[];
  baseUrl: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-slate-700 rounded overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-750 text-left"
      >
        <span className="font-semibold text-slate-100 flex-1">{tag}</span>
        {description && (
          <span className="text-slate-500 text-xs hidden sm:block">
            {description}
          </span>
        )}
        <span className="text-slate-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-2 space-y-2 bg-slate-900">
          {endpoints.map(({ method, path, operation }) => (
            <EndpointItem
              key={`${method}-${path}`}
              method={method}
              path={path}
              baseUrl={baseUrl}
              operation={operation}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function EndpointList({ schema }: Props) {
  const paths = schema.paths ?? {};

  if (Object.keys(paths).length === 0) {
    return <p className="text-slate-500 p-4">No endpoints defined.</p>;
  }

  const baseUrl = schema.servers?.[0]?.url ?? "";

  const tagDescriptions = Object.fromEntries(
    (schema.tags ?? []).map((t) => [t.name, t.description]),
  );

  const groups = new Map<string, EndpointEntry[]>();

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem?.[method] as
        OpenAPIV3.OperationObject | undefined;
      if (!operation) continue;
      const tag = operation.tags?.[0] ?? "default";
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag)!.push({ method, path, operation });
    }
  }

  return (
    <div className="space-y-2 p-4 overflow-auto h-full">
      {[...groups.entries()].map(([tag, endpoints]) => (
        <TagGroup
          key={tag}
          tag={tag}
          description={tagDescriptions[tag]}
          endpoints={endpoints}
          baseUrl={baseUrl}
        />
      ))}
    </div>
  );
}
