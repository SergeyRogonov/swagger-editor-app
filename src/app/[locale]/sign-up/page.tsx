"use client";

import { useSignFormSchema } from "@/form-schemas/useSignFormSchema";
import { useAuth } from "@/provider/AuthProvider";
import ReactHookFormError from "@/shared/components/ReactHookFormError";
import FormErrorMessage from "@/shared/components/SignForm/FormErrorMessage";
import SignForm from "@/shared/components/SignForm/SignForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

interface IReactHookFormData {
  email: string;
  password: string;
}

export default function SignUpPage() {
  const { isAuth, isLoading } = useAuth();
  const route = useRouter();

  const t = useTranslations("sign-up");
  const BACKEND_REGISTER_TRANSLATE = useTranslations("backend.register");
  const VALIDATION_TRANSLATE = useTranslations("sign-validation");

  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<null | string>(null);

  const LABEL_CLASS_NAME = "block text-sm font-medium text-text-secondary";

  const INPUT_CLASS_NAME =
    "w-full rounded-lg border border-overlay bg-elevated px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  const LINK_CLASS_NAME = "text-accent hover:underline";

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IReactHookFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(
      useSignFormSchema(VALIDATION_TRANSLATE),
    ) as Resolver<IReactHookFormData>,
    mode: "onChange",
  });

  async function onSubmit(data: IReactHookFormData) {
    const FORM_DATA: IReactHookFormData = {
      email: data.email,
      password: data.password,
    };

    const URI = "/api/authentication/register";

    try {
      setIsFetch(true);
      const RESPOSNE = await fetch(URI, {
        method: "POST",
        body: JSON.stringify(FORM_DATA),
      });

      const DATA = await RESPOSNE.json();
      const HTTP_STATUS = DATA.status;
      if (HTTP_STATUS !== 201) {
        let message = DATA.message;

        switch (message) {
          case "EMAIL_IS_REQUIRED":
          case "INVALID_EMAIL":
          case "PASSWORD_IS_REQUIRED":
          case "EMAIL_ALREADY_TAKEN":
          case "AUTH_SUCCESS":
            message = BACKEND_REGISTER_TRANSLATE(message);
            break;
        }

        throw Error(`${message}`);
      }

      setFetchError(null);
      window.location.reload();
    } catch (exception) {
      if (exception instanceof Error) {
        setFetchError(`${exception.message}`);
        return;
      }
      setFetchError(`${exception}`);
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
    <SignForm title={t("title")} subTitle={t("subTitle")}>
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
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const ID = "form__password";
            return (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor={ID} className={LABEL_CLASS_NAME}>
                    {t("passwordTitle")}
                  </label>
                </div>
                <div className="relative mt-1 pt-1">
                  <input
                    id={ID}
                    type="password"
                    placeholder="••••••••"
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
          {isFetch ? t("sendingForm") : t("signUp")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-text-muted">
        {t("haveAnAccount")}{" "}
        <Link href="/sign-in" className={`font-mediumg ${LINK_CLASS_NAME}`}>
          {t("signIn")}
        </Link>
      </p>
    </SignForm>
  );
}
