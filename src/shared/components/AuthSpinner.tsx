import { useTranslations } from "next-intl";

export default function AuthSpinner() {
  const t = useTranslations("auth-spinner");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 border-r-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-white text-sm font-medium tracking-wider animate-pulse">
          {t("authCheck")}
        </p>
      </div>
    </div>
  );
}
