import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SaveSchemaButton } from "./SaveSchemaButton";
import { mockNextIntl } from "@/test-utils/nextIntlMock";

mockNextIntl();

describe("SaveSchemaButton", () => {
  it("renders button text from translations", () => {
    render(<SaveSchemaButton canSave onSave={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent("editor.save.button");
  });

  it("is disabled when disabled prop is true", () => {
    render(<SaveSchemaButton canSave onSave={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when canSave is false", () => {
    render(<SaveSchemaButton canSave={false} onSave={() => {}} />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "editor.save.hoverTitle");
  });

  it("does not set title when canSave is true", () => {
    render(<SaveSchemaButton canSave onSave={() => {}} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute("title");
  });

  it("calls onSave when clicked", () => {
    const onSave = vi.fn();
    render(<SaveSchemaButton canSave onSave={onSave} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSave).toHaveBeenCalledOnce();
  });
});
