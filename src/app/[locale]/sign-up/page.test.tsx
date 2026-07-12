import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const useAuthMock = vi.fn();
const routerPushMock = vi.fn();
const useFormMock = vi.fn();

vi.mock("@/provider/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPushMock }),
}));

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => {
    const signUpMap: Record<string, string> = {
      title: "Sign up",
      subTitle: "sub",
      emailTitle: "Email",
      passwordTitle: "Password",
      haveAnAccount: "Have an account?",
      signIn: "Sign in",
      sendingForm: "Sending...",
      signUp: "Sign up",
    };

    if (ns === "sign-up") return (key: string) => signUpMap[key] ?? key;
    if (ns === "backend.register") return (key: string) => `backend:${key}`;
    if (ns === "sign-validation") return (key: string) => `validation:${key}`;
    return (key: string) => `${ns}:${key}`;
  },
}));

vi.mock("@/form-schemas/useFormSchema", () => ({
  getFormSchema: () => ({}),
}));

vi.mock("@hookform/resolvers/yup", () => ({
  yupResolver: () => () => ({}),
}));

vi.mock("react-hook-form", async () => {
  const ReactHookForm =
    await vi.importActual<typeof import("react-hook-form")>("react-hook-form");

  type ControllerProps = {
    render: (props: {
      field: {
        value: string;
        onChange: (v: string) => void;
        name: string;
        onBlur: () => void;
      };
      fieldState: { error: { message: string } | undefined };
    }) => React.ReactNode;
  };

  return {
    ...ReactHookForm,
    Controller: ({ render }: ControllerProps) => {
      const field = {
        value: "",
        onChange: () => {},
        name: "",
        onBlur: () => {},
      };
      const fieldState = {
        error: undefined as { message: string } | undefined,
      };
      return <>{render({ field, fieldState })}</>;
    },
    useForm: () => useFormMock(),
  };
});

vi.mock("@/shared/components/ReactHookFormError", () => ({
  default: () => null,
}));

vi.mock("@/shared/components/SignForm/FormErrorMessage", () => ({
  default: ({ message }: { message: string | null }) => (
    <div data-testid="fetch-error">{message ?? ""}</div>
  ),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

type UseFormReturnLike = {
  control: unknown;
  handleSubmit: (
    fn: (data: { email: string; password: string }) => Promise<void> | void,
  ) => (event: React.SubmitEvent) => void;
  formState: { isValid: boolean };
};

function setupCommonMocks({
  auth,
  isValid,
}: {
  auth: { isAuth: boolean; isLoading: boolean };
  isValid: boolean;
}) {
  useAuthMock.mockReturnValue(auth);
  routerPushMock.mockReset();

  useFormMock.mockReturnValue({
    control: {},
    handleSubmit: (fn: (data: { email: string; password: string }) => void) => {
      return (event: React.SubmitEvent) => {
        event.preventDefault();
        void fn({ email: "test@example.com", password: "Password123!" });
      };
    },
    formState: { isValid },
  } satisfies UseFormReturnLike);
}

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock.mockReset();
});

describe("SignUpPage", () => {
  it("renders nothing while auth context is loading", async () => {
    setupCommonMocks({
      auth: { isAuth: false, isLoading: true },
      isValid: true,
    });

    const SignUpPage = (await import("./page")).default;

    const { container } = render(<SignUpPage />);
    expect(container.firstChild).toBeNull();
    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it("redirects to / when already authenticated", async () => {
    setupCommonMocks({
      auth: { isAuth: true, isLoading: false },
      isValid: true,
    });

    const SignUpPage = (await import("./page")).default;
    render(<SignUpPage />);

    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows backend error message when register fails (non-201)", async () => {
    setupCommonMocks({
      auth: { isAuth: false, isLoading: false },
      isValid: true,
    });

    fetchMock.mockImplementation(async () => {
      return {
        status: 200,
        json: async () => ({ status: 400, message: "EMAIL_ALREADY_TAKEN" }),
      } as unknown;
    });

    const SignUpPage = (await import("./page")).default;
    render(<SignUpPage />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByTestId("fetch-error").textContent).toBe(
        "backend:EMAIL_ALREADY_TAKEN",
      );
    });
  });
});
