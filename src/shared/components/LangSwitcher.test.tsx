import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LanguageSwitcher from "./LangSwitcher";
import { mockNextIntl } from "@/test-utils/nextIntlMock";

const replaceMock = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/en/about",
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

mockNextIntl();

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("renders RU and EN buttons", () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole("button", { name: "RU" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });

  it("marks EN as active when locale is en", () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole("button", { name: "EN" })).toHaveClass("bg-accent");
  });

  it("calls router.replace with new locale when clicking RU", () => {
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: "RU" }));

    expect(replaceMock).toHaveBeenCalledWith("/en/about", { locale: "ru" });
  });
});
