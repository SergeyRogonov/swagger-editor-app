import { useTranslations } from "next-intl";
import type { ValidationError } from "@/types/swagger";

interface ValidationPanelProps {
  errors: ValidationError[];
}

export function ValidationPanel({ errors }: ValidationPanelProps) {
  const t = useTranslations("editor.validation");

  if (errors.length === 0) {
    return null;
  }

  const error = errors[0];

  return (
    <div className="border border-red-200 bg-red-50 p-3">
      <p className="mb-2 font-medium text-red-700">{t("title")}</p>

      <pre className="whitespace-pre-wrap wrap-break-word text-sm text-red-600 font-sans">
        {error.message}
      </pre>
    </div>
  );
}
