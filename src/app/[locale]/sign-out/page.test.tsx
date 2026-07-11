import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignOutPage from "./page";

const pushMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("@/provider/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

beforeEach(() => {
  pushMock.mockClear();
  useAuthMock.mockClear();

  vi.stubGlobal("fetch", vi.fn());
  Object.defineProperty(window, "location", {
    value: { reload: vi.fn() },
    writable: true,
  });
});

describe("SignOutPage", () => {
  it("when not authenticated, redirects to /", async () => {
    useAuthMock.mockReturnValue({ isAuth: false });

    render(<SignOutPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("when authenticated, POSTs logout and reloads the page", async () => {
    useAuthMock.mockReturnValue({ isAuth: true });

    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    const reloadMock = vi
      .spyOn(window.location, "reload")
      .mockImplementation(() => {});

    render(<SignOutPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/authentication/logout", {
        method: "POST",
      });
      expect(reloadMock).toHaveBeenCalled();
    });
  });
});
