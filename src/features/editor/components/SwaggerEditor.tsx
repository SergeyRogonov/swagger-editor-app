"use client";
type SwaggerEditorProps = {
  value: string;
  onChange: (value: string) => void;
};
export function SwaggerEditor({ value, onChange }: SwaggerEditorProps) {
  return (
    <section className="h-full rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="text-lg font-semibold">Swagger Editor</h2>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          JSON / YAML
        </span>
      </div>
      <div className="p-4">
        <textarea
          className="min-h-[520px] w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-blue-500"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste your OpenAPI/Swagger schema here..."
        />
      </div>
    </section>
  );
}
