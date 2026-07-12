import { useTranslations } from "next-intl";
import * as yup from "yup";

export default function emailValidation(t: ReturnType<typeof useTranslations>) {
  return yup
    .string()
    .required(t("email.required"))
    .test({
      message: t("email.oneAt"),
      test: (value) => {
        if (!value) {
          return;
        }

        return value.split("@").length === 2;
      },
    })
    .test({
      message: t("email.localPart"),
      test: (value) => {
        if (!value) {
          return;
        }

        const ARRAY = value.split("@");
        if (ARRAY.length < 2) {
          return;
        }

        const LOCAL_PART = ARRAY[0];
        return LOCAL_PART.length > 0;
      },
    })
    .test({
      message: t("email.domain"),
      test: (value) => {
        if (!value) {
          return;
        }

        const ARRAY = value.split("@");
        if (ARRAY.length < 2) {
          return;
        }

        const DOMAIN_PART = ARRAY[1];
        const DOMAINS = DOMAIN_PART.split(".");

        for (let i = 0; i < DOMAINS.length; i++) {
          if (DOMAINS[i].length < 1) {
            return;
          }
        }

        return DOMAINS.length >= 2;
      },
    })
    .test({
      message: t("email.nameSymbols"),
      test: (value) => {
        if (!value) {
          return;
        }

        const ARRAY = value.split("@");
        if (ARRAY.length < 2) {
          return;
        }

        const USER_NAME_PART = ARRAY[0];

        if (USER_NAME_PART.length == 0) {
          return;
        }

        if (USER_NAME_PART[0] === ".") {
          return;
        }

        if (USER_NAME_PART[USER_NAME_PART.length - 1] === ".") {
          return;
        }

        const AVAILABLE_SYMBOLS_ON_USER_NAME_PART =
          "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm._1234567890";
        for (let i = 0; i < USER_NAME_PART.length; i++) {
          const CHAR = USER_NAME_PART[i];
          if (!AVAILABLE_SYMBOLS_ON_USER_NAME_PART.includes(CHAR)) {
            return;
          }
        }

        return true;
      },
    });
}
