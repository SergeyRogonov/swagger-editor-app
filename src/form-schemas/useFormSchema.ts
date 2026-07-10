import * as yup from "yup";
import emailValidation from "./emailValidation";
import passwordValidation from "./passwordValidation";
import { useTranslations } from "next-intl";

export function getFormSchema(t: ReturnType<typeof useTranslations>) {
  return yup.object({
    email: emailValidation(t),
    password: passwordValidation(t),
  });
}
