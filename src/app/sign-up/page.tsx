"use client";

import { getFormSchema } from "@/form-schemas/useFormSchema";
import ReactHookFormError from "@/shared/components/ReactHookFormError";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Controller, Resolver, useForm } from "react-hook-form";

interface IReactHookFormData {
  email: string;
  password: string;
}

export default function SignUpPage() {
  const LABEL_CLASS_NAME =
    "block text-sm font-medium text-slate-700 dark:text-slate-300";

  const INPUT_CLASS_NAME =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400";

  const LINK_CLASS_NAME = "text-blue-600 hover:underline dark:text-blue-400";

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IReactHookFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(getFormSchema()) as Resolver<IReactHookFormData>,
    mode: "onChange",
  });

  async function onSubmit(data: IReactHookFormData) {
    console.log("reactHookFormSubmit", data);

    const FORM_DATA: IReactHookFormData = {
      email: data.email,
      password: data.password,
    };

    const URI = "/api/authentication/register";
    const RESPOSNE = await fetch(URI, {
      method: "POST",
      body: JSON.stringify(FORM_DATA),
    });

    const HTTP_STATUS = RESPOSNE.status;
    if (HTTP_STATUS !== 201) {
      const TEXT = await RESPOSNE.text();
      throw Error(`HTTP ${HTTP_STATUS}\n${TEXT}`);
    }

    const DATA = await RESPOSNE.json();
    console.log(DATA);

    alert("Зарегистрировались");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Регистрация
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Введите свои данные
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const ID = "form__email";
              return (
                <div>
                  <label htmlFor={ID} className={LABEL_CLASS_NAME}>
                    E-mail
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
                      Пароль
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
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500"
            disabled={!isValid}
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Есть аккаунт?{" "}
          <Link href="/sign-in" className={`font-mediumg ${LINK_CLASS_NAME}`}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
