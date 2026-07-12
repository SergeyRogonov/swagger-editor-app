import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MobileNav from "./MobileNav";
import { mockNextIntl } from "@/test-utils/nextIntlMock";

mockNextIntl();

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"a"> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("MobileNav", () => {
  it("renders toggle button when closed", () => {
    const onOpenChange = vi.fn();

    render(
      <MobileNav isAuth={false} isOpen={false} onOpenChange={onOpenChange} />,
    );

    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
    expect(screen.queryByText("header.about")).not.toBeInTheDocument();
  });

  it("toggles open when clicking the button and toggles back when open", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <MobileNav isAuth={false} isOpen={false} onOpenChange={onOpenChange} />,
    );

    fireEvent.click(screen.getByLabelText("Toggle menu"));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <MobileNav isAuth={false} isOpen={true} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows public links when isAuth is false and closes when a link is clicked", () => {
    const onOpenChange = vi.fn();

    render(
      <MobileNav isAuth={false} isOpen={true} onOpenChange={onOpenChange} />,
    );

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

    fireEvent.click(screen.getByRole("link", { name: "header.signIn" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows authed links when isAuth is true and closes when a link is clicked", () => {
    const onOpenChange = vi.fn();

    render(
      <MobileNav isAuth={true} isOpen={true} onOpenChange={onOpenChange} />,
    );

    expect(screen.getByRole("link", { name: "header.about" })).toHaveAttribute(
      "href",
      "/en/about",
    );
    expect(
      screen.getByRole("link", { name: "header.history" }),
    ).toHaveAttribute("href", "/en/history");
    expect(
      screen.getByRole("link", { name: "header.signOut" }),
    ).toHaveAttribute("href", "/en/sign-out");

    expect(screen.queryByRole("link", { name: "header.signIn" })).toBeNull();
    expect(screen.queryByRole("link", { name: "header.signUp" })).toBeNull();

    fireEvent.click(screen.getByRole("link", { name: "header.signOut" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
