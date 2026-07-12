import { useTranslations } from "next-intl";

interface SaveSchemaButtonProps {
  disabled?: boolean;
  canSave: boolean;
  onSave: () => void;
}

export function SaveSchemaButton({
  disabled = false,
  canSave,
  onSave,
}: SaveSchemaButtonProps) {
  const t = useTranslations("editor.save");

  return (
    <button
      type="button"
      disabled={disabled || !canSave}
      onClick={onSave}
      title={!canSave ? t("hoverTitle") : undefined}
      className="rounded border border-overlay px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm text-text-primary hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
    >
      {t("button")}
    </button>
  );
}
