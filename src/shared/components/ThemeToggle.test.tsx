import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("shows ☀️ when theme is dark", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toHaveTextContent("☀️");
  });

  it("shows 🌙 when theme is light", () => {
    localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toHaveTextContent("🌙");
  });

  it("clicking the button toggles the theme (updates icon)", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const btn = screen.getByRole("button", { name: "Toggle theme" });

    expect(btn).toHaveTextContent("☀️");

    fireEvent.click(btn);

    expect(btn).toHaveTextContent("🌙");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
