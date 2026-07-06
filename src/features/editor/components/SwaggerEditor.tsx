"use client";

import dynamic from "next/dynamic";
import { EditorToolbar } from "@/features/editor/components/EditorToolbar";
import type { SchemaFormat } from "@/types/swagger";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface SwaggerEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "yaml" | "json";
  readOnly?: boolean;
  format: SchemaFormat | null;
  onFormatToggle: () => void;
  onSaveSchema: () => void;
}

export function SwaggerEditor({
  value,
  onChange,
  language = "yaml",
  readOnly = false,
  format,
  onFormatToggle,
  onSaveSchema,
}: SwaggerEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-2">
        <EditorToolbar
          value={value}
          format={format}
          onChange={onChange}
          onFormatToggle={onFormatToggle}
          onSaveSchema={onSaveSchema}
        />
      </div>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={value}
          theme="vs-dark"
          onChange={(value) => onChange(value ?? "")}
          options={{
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            readOnly,
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
}
