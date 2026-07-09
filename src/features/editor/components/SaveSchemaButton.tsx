import { useTranslations } from "next-intl";

interface SaveSchemaButtonProps {
  disabled?: boolean;
  onSave: () => void;
}

export function SaveSchemaButton({
  disabled = false,
  onSave,
}: SaveSchemaButtonProps) {
  const t = useTranslations("editor.save");

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSave}
      className="rounded border border-overlay px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm text-text-primary hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
    >
      {t("button")}
    </button>
  );
}
