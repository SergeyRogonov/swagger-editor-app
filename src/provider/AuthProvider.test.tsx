import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthProvider";

const TestComponent = () => {
  const { isAuth, isLoading } = useAuth();
  return (
    <div>
      <span data-testid="isAuth">{String(isAuth)}</span>
      <span data-testid="isLoading">{String(isLoading)}</span>
    </div>
  );
};

const TestComponentWithoutProvider = () => {
  useAuth();
  return null;
};

describe("AuthProvider", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("sets isAuth to false when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("isLoading").textContent).toBe("true");

    await waitFor(() => {
      expect(screen.getByTestId("isAuth").textContent).toBe("false");
      expect(screen.getByTestId("isLoading").textContent).toBe("false");
    });
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
