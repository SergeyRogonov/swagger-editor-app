import * as yup from "yup";
import emailValidation from "./emailValidation";
import { useTranslations } from "next-intl";

export function useForgetPasswordSchema(t: ReturnType<typeof useTranslations>) {
  return yup.object({
    email: emailValidation(t),
  });
}
