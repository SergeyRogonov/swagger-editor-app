"use client";

import { useForgetPasswordSchema } from "@/form-schemas/useForgetPasswordSchema";
import { useAuth } from "@/provider/AuthProvider";
import ReactHookFormError from "@/shared/components/ReactHookFormError";
import FormErrorMessage from "@/shared/components/SignForm/FormErrorMessage";
import FormSuccessMessage from "@/shared/components/SignForm/FormSuccessMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

interface IReactHookFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const { isAuth, isLoading } = useAuth();
  const route = useRouter();

  const t = useTranslations("forgot-password");
  const BACKEND_FORGOT_PASSWORD_TRANSLATE = useTranslations(
    "backend.forgot-password",
  );
  const VALIDATION_TRANSLATE = useTranslations("sign-validation");

  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<null | string>(null);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);

  const LABEL_CLASS_NAME = "block text-sm font-medium text-text-secondary";

  const INPUT_CLASS_NAME =
    "w-full rounded-lg border border-overlay bg-elevated px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IReactHookFormData>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(
      useForgetPasswordSchema(VALIDATION_TRANSLATE),
    ) as Resolver<IReactHookFormData>,
    mode: "onChange",
  });

  async function onSubmit(data: IReactHookFormData) {
    const FORM_DATA: IReactHookFormData = {
      email: data.email,
    };

    try {
      setIsFetch(true);
      const URI = "/api/authentication/forgot-password";
      const RESPOSNE = await fetch(URI, {
        method: "POST",
        body: JSON.stringify(FORM_DATA),
      });

      const HTTP_STATUS = RESPOSNE.status;
      if (HTTP_STATUS !== 200) {
        let message = "";
        try {
          const DATA = await RESPOSNE.json();
          message = DATA.message;

          switch (message) {
            case "EMAIL_IS_REQUIRED":
            case "INVALID_EMAIL":
            case "USER_NOT_FOUND":
              message = BACKEND_FORGOT_PASSWORD_TRANSLATE(message);
              break;
          }
        } catch (exception) {
          const TEXT = await RESPOSNE.text();
          message = `${TEXT}\n${exception}`;
        }

        throw Error(`${message}`);
      }

      await RESPOSNE.json();

      setFetchError(null);
      setSuccessMessage(BACKEND_FORGOT_PASSWORD_TRANSLATE("SUCCESS"));
    } catch (exception) {
      if (exception instanceof Error) {
        setFetchError(`${exception.message}`);
        return;
      }
      setFetchError(`${exception}`);
      setSuccessMessage(null);
    } finally {
      setIsFetch(false);
    }
  }

  useEffect(() => {
    if (!isLoading && isAuth) {
      route.push("/");
    }
  }, [isAuth, isLoading, route]);

  if (isLoading) {
    return null;
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-lg border border-overlay bg-elevated p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary">{t("title")}</h1>
          <p className="mt-2 text-text-muted">{t("subTitle")}</p>
        </div>
        <FormSuccessMessage message={successMessage} />
        <FormErrorMessage message={fetchError} />
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const ID = "form__email";
              return (
                <div>
                  <label htmlFor={ID} className={LABEL_CLASS_NAME}>
                    {t("emailTitle")}
                  </label>
                  <div className="mt-1 pt-1">
                    <input
                      id={ID}
                      type="email"
                      placeholder="example@host.local"
                      className={INPUT_CLASS_NAME}
                      {...field}
                    />
                  </div>
                  <ReactHookFormError error={error} />
                </div>
              );
            }}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!isValid || isFetch}
          >
            {isFetch ? t("sendingForm") : t("send")}
          </button>
        </form>
      </div>
    </main>
  );
}
