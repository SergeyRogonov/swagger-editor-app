"use client";

import { SwaggerEditor } from "@/features/editor/components/SwaggerEditor";
import { ValidationPanel } from "@/features/editor/components/ValidationPanel";
import { SwaggerViewer } from "@/features/viewer/components/SwaggerViewer";
import { DEFAULT_SCHEMA } from "@/lib/editor-defaults";
import { useSwaggerEditor } from "@/hooks/useSwaggerEditor";
import { useEffect, useState } from "react";
import { convertSchema } from "@/services/schemaConverter";
import { useOrientation } from "@/hooks/useOrientation";
import { loadSchema, saveSchema } from "@/services/schemaStorage";
import { useAuth } from "@/provider/AuthProvider";

export default function HomePage() {
  const isLandscape = useOrientation();
  const {
    rawText,
    schema,
    derefSchema,
    format,
    displayFormat,
    setDisplayFormat,
    errors,
    updateContent,
  } = useSwaggerEditor(DEFAULT_SCHEMA);
  const { isAuth, isLoading } = useAuth();

  const [editorSizePct, setEditorSizePct] = useState(50);
  const [editorReady, setEditorReady] = useState(false);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const split = e.currentTarget.parentElement;
    if (!split) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const rect = split.getBoundingClientRect();
      const position = isLandscape
        ? ev.clientX - rect.left
        : ev.clientY - rect.top;

      const minPx = 260;
      const maxPx = isLandscape ? rect.width - 260 : rect.height - 260;

      const clampedPosition = clamp(position, minPx, maxPx);
      const totalSize = isLandscape ? rect.width : rect.height;

      const pct = (clampedPosition / totalSize) * 100;
      setEditorSizePct(pct);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleFormatToggle = async () => {
    if (!schema || !format) return;

    const targetFormat = format === "yaml" ? "json" : "yaml";
    setDisplayFormat(targetFormat);

    const result = convertSchema(schema, targetFormat);
    if (result.text) {
      await updateContent(result.text);
    }
  };

  const handleSaveSchema = async () => {
    await saveSchema(rawText);
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const initializeEditor = async () => {
      if (isAuth) {
        const saved = await loadSchema();

        if (saved) {
          updateContent(saved, false);
        }
      }

      setEditorReady(true);
    };

    void initializeEditor();
  }, [isLoading, isAuth, updateContent]);

  if (isLandscape === null || !editorReady) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="h-full flex flex-col mx-auto">
      <section className="flex-1 min-h-0 overflow-hidden px-0 py-0">
        <div
          className={`split h-full min-h-0 overflow-hidden flex ${
            isLandscape ? "flex-row" : "flex-col"
          }`}
        >
          <div
            className="min-h-0 overflow-hidden"
            style={
              isLandscape
                ? { width: `${editorSizePct}%` }
                : { height: `${editorSizePct}%` }
            }
          >
            <SwaggerEditor
              value={rawText}
              format={displayFormat}
              onChange={updateContent}
              onFormatToggle={handleFormatToggle}
              onSaveSchema={handleSaveSchema}
              canSave={isAuth && !isLoading}
            />
          </div>

          <div
            onPointerDown={onDragStart}
            className={`resizer ${isLandscape ? "cursor-col-resize" : "cursor-row-resize"} bg-slate-200/40 hover:bg-slate-300/60 flex-none`}
            style={isLandscape ? { width: 10 } : { height: 10 }}
            role="separator"
            aria-orientation={isLandscape ? "vertical" : "horizontal"}
            aria-label="Resize editor and viewer"
          />

          <div className="flex-1 overflow-y-scroll bg-surface">
            <div className="flex min-h-full flex-col">
              <ValidationPanel errors={errors} />
              <SwaggerViewer schema={derefSchema} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
