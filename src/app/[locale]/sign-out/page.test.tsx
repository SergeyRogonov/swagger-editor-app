import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignOutPage from "./page";

const pushMock = vi.fn();
const replaceMock = vi.fn();
const useAuthMock = vi.fn();
const logoutMock = vi.fn();

vi.mock("@/provider/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
}));

beforeEach(() => {
  pushMock.mockClear();
  replaceMock.mockClear();
  useAuthMock.mockClear();
  logoutMock.mockClear();
});

describe("SignOutPage", () => {
  it("when not authenticated, does not redirect", async () => {
    useAuthMock.mockReturnValue({ isAuth: false, logout: logoutMock });

    render(<SignOutPage />);

    await waitFor(() => {
      expect(pushMock).not.toHaveBeenCalled();
      expect(replaceMock).not.toHaveBeenCalled();
      expect(logoutMock).not.toHaveBeenCalled();
    });
  });

  it("when authenticated, calls logout and redirects to /", async () => {
    useAuthMock.mockReturnValue({ isAuth: true, logout: logoutMock });
    logoutMock.mockResolvedValueOnce(undefined);

    render(<SignOutPage />);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });
});
