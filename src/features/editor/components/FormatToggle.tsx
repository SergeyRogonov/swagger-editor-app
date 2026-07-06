import { useTranslations } from "next-intl";

interface FormatToggleProps {
  currentFormat: "json" | "yaml" | null;
  disabled?: boolean;
  onToggle: () => void;
}

export function FormatToggle({
  currentFormat,
  disabled = false,
  onToggle,
}: FormatToggleProps) {
  const t = useTranslations("editor.formatToggle");

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="rounded border border-slate-600 px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {t(currentFormat === "yaml" ? "toJson" : "toYaml")}
    </button>
  );
}
