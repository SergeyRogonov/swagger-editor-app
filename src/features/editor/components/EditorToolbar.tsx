"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { loadTextFile } from "@/services/fileLoader";
import { FormatToggle } from "./FormatToggle";
import { SaveSchemaButton } from "./SaveSchemaButton";

import type { SchemaFormat } from "@/types/swagger";

interface EditorToolbarProps {
  value: string;
  format: SchemaFormat | null;
  onChange: (value: string) => void;
  onFormatToggle: () => void;
  onSaveSchema: () => void;
  canSave: boolean;
}

export function EditorToolbar({
  value,
  format,
  onChange,
  onFormatToggle,
  onSaveSchema,
  canSave,
}: EditorToolbarProps) {
  const t = useTranslations("editor.toolbar");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await loadTextFile(file);

    onChange(text);

    event.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className="rounded border border-overlay px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm text-text-primary hover:bg-elevated"
      >
        {t("clear")}
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded border border-overlay px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm text-text-primary hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("load")}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.yaml,.yml"
        className="hidden"
        onChange={handleFileChange}
      />

      <FormatToggle
        currentFormat={format}
        disabled={!value.trim()}
        onToggle={onFormatToggle}
      />

      <SaveSchemaButton
        disabled={!value.trim()}
        canSave={canSave}
        onSave={onSaveSchema}
      />
    </div>
  );
}
