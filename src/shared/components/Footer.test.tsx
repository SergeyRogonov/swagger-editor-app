import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";
import { mockNextIntl } from "@/test-utils/nextIntlMock";

mockNextIntl();

describe("Footer", () => {
  it("renders translated appName text", () => {
    render(<Footer />);
    expect(screen.getByText("header.appName")).toBeInTheDocument();
  });

  it("renders an About link with translated text", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: "header.about" }),
    ).toBeInTheDocument();
  });

  it("uses the locale in the About link href", () => {
    render(<Footer />);
    const about = screen.getByRole("link", {
      name: "header.about",
    }) as HTMLAnchorElement;
    expect(about.getAttribute("href")).toBe("/en/about");
  });
});
