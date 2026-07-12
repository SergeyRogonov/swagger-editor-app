import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "./Header";
import { mockNextIntl } from "@/test-utils/nextIntlMock";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("./MobileNav", () => ({
  __esModule: true,
  default: ({
    onOpenChange,
  }: {
    isAuth: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }) => <button onClick={() => onOpenChange(true)}>OpenMobileNav</button>,
}));

vi.mock("./LangSwitcher", () => ({
  __esModule: true,
  default: () => <div>LanguageSwitcher</div>,
}));

vi.mock("./ThemeToggle", () => ({
  ThemeToggle: () => <div>ThemeToggle</div>,
}));

vi.mock("./AuthSpinner", () => ({
  __esModule: true,
  default: () => <div>AuthSpinner</div>,
}));

const useAuthMock = vi.fn();

vi.mock("@/provider/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

beforeEach(() => {
  mockNextIntl();
  useAuthMock.mockReturnValue({
    isAuth: false,
    isLoading: false,
  });
});

describe("Header", () => {
  it("shows AuthSpinner when isLoading is true", () => {
    useAuthMock.mockReturnValue({ isAuth: false, isLoading: true });

    render(<Header />);

    expect(screen.getByText("AuthSpinner")).toBeInTheDocument();
  });

  it("renders public links when isAuth is false", () => {
    useAuthMock.mockReturnValue({ isAuth: false, isLoading: false });

    render(<Header />);

    expect(
      screen.getByRole("link", { name: "header.appName" }),
    ).toHaveAttribute("href", "/en/");
    expect(screen.getByRole("link", { name: "header.about" })).toHaveAttribute(
      "href",
      "/en/about",
    );
    expect(screen.getByRole("link", { name: "header.signIn" })).toHaveAttribute(
      "href",
      "/en/sign-in",
    );
    expect(screen.getByRole("link", { name: "header.signUp" })).toHaveAttribute(
      "href",
      "/en/sign-up",
    );

    expect(screen.queryByRole("link", { name: "header.history" })).toBeNull();
    expect(screen.queryByRole("link", { name: "header.signOut" })).toBeNull();
  });

  it("renders authed links when isAuth is true", () => {
    useAuthMock.mockReturnValue({ isAuth: true, isLoading: false });

    render(<Header />);

    expect(
      screen.getByRole("link", { name: "header.history" }),
    ).toHaveAttribute("href", "/en/history");
    expect(
      screen.getByRole("link", { name: "header.signOut" }),
    ).toHaveAttribute("href", "/en/sign-out");

    expect(screen.queryByRole("link", { name: "header.signIn" })).toBeNull();
    expect(screen.queryByRole("link", { name: "header.signUp" })).toBeNull();
  });

  it("renders LanguageSwitcher and ThemeToggle", () => {
    useAuthMock.mockReturnValue({ isAuth: false, isLoading: false });

    render(<Header />);

    expect(screen.getAllByText("LanguageSwitcher")).toHaveLength(2);
    expect(screen.getAllByText("ThemeToggle")).toHaveLength(2);
  });

  it("shows and hides the mobile menu overlay", () => {
    render(<Header />);

    expect(document.querySelector(".fixed.inset-0")).toBeNull();

    fireEvent.click(screen.getByText("OpenMobileNav"));

    const overlay = document.querySelector(".fixed.inset-0");

    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("bg-black/50");

    fireEvent.click(overlay!);

    expect(document.querySelector(".fixed.inset-0")).toBeNull();
  });
});
