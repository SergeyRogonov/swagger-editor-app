import { useTranslations } from "next-intl";
import * as yup from "yup";

export default function passwordValidation(
  t: ReturnType<typeof useTranslations>,
) {
  return yup
    .string()
    .required(t("password.required"))
    .test({
      message: t("password.number"),
      test: (value) => /\p{Nd}/u.test(value),
    })
    .test({
      message: t("password.uppercase"),
      test: (value) => /\p{Lu}/u.test(value),
    })
    .test({
      message: t("password.lowercase"),
      test: (value) => /\p{Ll}/u.test(value),
    })
    .test({
      message: t("password.specialSymbol"),
      test: (value) => /[^\p{L}\p{Nd}]/u.test(value),
    })
    .min(8, t("password.minLength"));
}
