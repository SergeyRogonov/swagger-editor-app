import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInPage from "./page";

const tMock = vi.fn((key: string) => key);
const tBackendMock = vi.fn((key: string) => `backend:${key}`);
const tValidationMock = vi.fn((key: string) => `validation:${key}`);

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    if (namespace === "backend.login") return tBackendMock;
    if (namespace === "sign-validation") return tValidationMock;
    return tMock;
  },
}));

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const mockUseAuth = vi.fn();
vi.mock("@/provider/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/form-schemas/useFormSchema", () => ({
  getFormSchema: () => ({}) as unknown,
}));

vi.mock("@hookform/resolvers/yup", () => ({
  yupResolver: () => ({}) as unknown,
}));

let controllerState: {
  email: string;
  password: string;
  errorEmail?: string;
  errorPassword?: string;
} = { email: "", password: "" };

type ReactHookFormData = {
  email: string;
  password: string;
};

type ControllerName = "email" | "password";

type ControllerField = {
  value: string;
  onChange: (evt: { target: { value: string } }) => void;
  onBlur: () => void;
  name: ControllerName;
  ref: (el: HTMLInputElement | null) => void;
};

type ControllerArgs = {
  field: ControllerField;
  fieldState: { error?: { message?: string } };
};

type UseFormReturn = {
  control: unknown;
  handleSubmit: (
    onSubmit: (data: ReactHookFormData) => Promise<void>,
  ) => (e: React.SubmitEvent) => Promise<void>;
  formState: { isValid: boolean };
};

const initialFormState: ReactHookFormData = { email: "", password: "" };

vi.mock("react-hook-form", () => {
  const useForm = (): UseFormReturn => {
    controllerState = initialFormState;

    const control: unknown = {};
    const isValid = true;

    const handleSubmit =
      (onSubmit: (data: ReactHookFormData) => Promise<void>) =>
      async (e: React.SubmitEvent): Promise<void> => {
        e.preventDefault();
        await onSubmit({
          email: controllerState.email,
          password: controllerState.password,
        });
      };

    return {
      control,
      handleSubmit,
      formState: { isValid },
    };
  };

  const Controller = (props: {
    name: ControllerName;
    control: unknown;
    render: (args: ControllerArgs) => React.ReactNode;
  }): React.ReactNode => {
    const value = controllerState[props.name];

    const args: ControllerArgs = {
      field: {
        value,
        onChange: (evt) => {
          controllerState = {
            ...controllerState,
            [props.name]: evt.target.value,
          };
        },
        onBlur: () => {},
        name: props.name,
        ref: () => {},
      },
      fieldState: { error: undefined },
    };

    return props.render(args);
  };

  return {
    __esModule: true,
    Controller,
    useForm,
  };
});

vi.mock("@/shared/components/ReactHookFormError", () => ({
  __esModule: true,
  default: ({ error }: { error?: { message?: string } }) => {
    if (!error) return null;
    return <div role="alert">{error.message}</div>;
  },
}));

vi.mock("@/shared/components/SignForm/FormErrorMessage", () => ({
  __esModule: true,
  default: ({ message }: { message: string | null }) => {
    if (!message) return null;
    return <div role="alert">{message}</div>;
  },
}));

describe("SignInPage", () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    pushMock.mockReset();
    reloadMock.mockReset();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    mockUseAuth.mockReturnValue({ isAuth: false, isLoading: false });

    controllerState = { email: "", password: "" };

    globalThis.fetch = vi.fn();
  });

  it("renders sign-in UI", () => {
    render(<SignInPage />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subTitle")).toBeInTheDocument();
    expect(screen.getByLabelText("emailTitle")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordTitle")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "signIn" })).toBeInTheDocument();
  });

  it("redirects to / when already authenticated", async () => {
    mockUseAuth.mockReturnValue({ isAuth: true, isLoading: false });

    render(<SignInPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows translated backend error when login fails (non-200 with known message)", async () => {
    const fetchMock = globalThis.fetch as unknown as {
      (
        url: string,
        init: { method: string; body?: string },
      ): Promise<{
        status: number;
        json: () => Promise<{ message: string }>;
      }>;
    };

    vi.mocked(fetchMock).mockResolvedValueOnce({
      status: 401,
      json: async () => ({ message: "INVALID_EMAIL" }),
    });

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("emailTitle") as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      "passwordTitle",
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "bad" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    fireEvent.click(screen.getByRole("button", { name: "signIn" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "backend:INVALID_EMAIL",
      );
    });

    expect(reloadMock).not.toHaveBeenCalled();
  });
});
