"use client";

type SwaggerViewerProps = {
  schema: string;
};

export function SwaggerViewer({ schema }: SwaggerViewerProps) {
  return (
    <section className="h-full rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-lg font-semibold">Swagger Viewer</h2>
      </div>

      <div className="p-4">
        {schema.trim() ? (
          <p className="text-slate-300">
            Schema received. Endpoints will be displayed here.
          </p>
        ) : (
          <p className="text-slate-400">
            Paste a valid OpenAPI schema in the editor to see endpoints.
          </p>
        )}
      </div>
    </section>
  );
}
