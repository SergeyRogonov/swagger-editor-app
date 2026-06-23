"use client";

import { useState } from "react";
import { SwaggerEditor } from "@/features/editor/components/SwaggerEditor";
import { SwaggerViewer } from "@/features/viewer/components/SwaggerViewer";

export default function HomePage() {
  const [schema, setSchema] = useState("");

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold">Swagger/OpenAPI UI</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Edit OpenAPI specifications and test REST endpoints in one app.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SwaggerEditor value={schema} onChange={setSchema} />
        <SwaggerViewer schema={schema} />
      </section>
    </main>
  );
}
