import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent, waitFor } from "@testing-library/react";

import ForgotPasswordPage from "./page";

import { mockNextIntl } from "@/test-utils/nextIntlMock";

mockNextIntl();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/provider/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseRouter = vi.mocked(useRouter);

const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    routerMock.push.mockReset();
    routerMock.replace.mockReset();
    routerMock.refresh.mockReset();
    routerMock.back.mockReset();
    routerMock.forward.mockReset();
    routerMock.prefetch.mockReset();

    mockedUseRouter.mockReturnValue(
      routerMock as unknown as ReturnType<typeof useRouter>,
    );

    mockedUseAuth.mockReturnValue({
      isAuth: false,
      isLoading: false,
    });
  });

  it("renders the forgot password page", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByText("forgot-password.title")).toBeInTheDocument();

    expect(screen.getByText("forgot-password.subTitle")).toBeInTheDocument();

    expect(
      screen.getByLabelText("forgot-password.emailTitle"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "forgot-password.send",
      }),
    ).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<ForgotPasswordPage />);

    const input = screen.getByLabelText("forgot-password.emailTitle");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "example@host.local");
  });

  it("renders disabled submit button initially", () => {
    render(<ForgotPasswordPage />);

    expect(
      screen.getByRole("button", {
        name: "forgot-password.send",
      }),
    ).toBeDisabled();
  });

  it("renders nothing while auth state is loading", () => {
    mockedUseAuth.mockReturnValue({
      isAuth: false,
      isLoading: true,
    });

    const { container } = render(<ForgotPasswordPage />);

    expect(container.firstChild).toBeNull();
  });

  it("redirects authenticated user", () => {
    mockedUseAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
    });

    render(<ForgotPasswordPage />);

    expect(routerMock.push).toHaveBeenCalledWith("/");
  });

  it("does not redirect guest user", () => {
    render(<ForgotPasswordPage />);

    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it("submits form successfully and shows success message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({}),
    });

    render(<ForgotPasswordPage />);

    const input = screen.getByLabelText("forgot-password.emailTitle");

    fireEvent.change(input, {
      target: {
        value: "test@example.com",
      },
    });

    const button = screen.getByRole("button", {
      name: "forgot-password.send",
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("backend.forgot-password.SUCCESS"),
      ).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith("/api/authentication/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
      }),
    });
  });
});
