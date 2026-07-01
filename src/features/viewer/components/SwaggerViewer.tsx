"use client";

import type { OpenAPIV3 } from "openapi-types";

type SwaggerViewerProps = {
  schema: OpenAPIV3.Document | null;
};

export function SwaggerViewer({ schema }: SwaggerViewerProps) {
  return (
    <section className="h-full border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-lg font-semibold">Swagger Viewer</h2>
      </div>

      <div className="p-4">
        <p className="text-slate-300">
          Schema received. Endpoints will be displayed here.
        </p>
      </div>
    </section>
  );
}
