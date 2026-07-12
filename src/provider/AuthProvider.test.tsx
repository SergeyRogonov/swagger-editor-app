import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthProvider";

const TestComponent = () => {
  const { isAuth, isLoading, logout } = useAuth();
  return (
    <div>
      <span data-testid="isAuth">{String(isAuth)}</span>
      <span data-testid="isLoading">{String(isLoading)}</span>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const TestComponentWithoutProvider = () => {
  useAuth();
  return null;
};

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

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

  it("sets isLoading/isAuth correctly on logout", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: 200 }),
    } as unknown as Response);

    const d = deferred<{ [key: string]: unknown }>();

    mockFetch.mockResolvedValueOnce({
      json: async () => {
        await d.promise;
        return {};
      },
    } as unknown as Response);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("isLoading").textContent).toBe("false");
      expect(screen.getByTestId("isAuth").textContent).toBe("true");
    });

    screen.getByTestId("logout-btn").click();

    await waitFor(() => {
      expect(screen.getByTestId("isLoading").textContent).toBe("true");
    });

    d.resolve({});

    await waitFor(() => {
      expect(screen.getByTestId("isAuth").textContent).toBe("false");
      expect(screen.getByTestId("isLoading").textContent).toBe("false");
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
