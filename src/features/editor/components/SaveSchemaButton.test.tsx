import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SaveSchemaButton } from "./SaveSchemaButton";

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
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute(
      "title",
      "Sign in to save schemas",
    );
  });

  it("calls onSave when clicked", () => {
    const onSave = vi.fn();
    render(<SaveSchemaButton canSave onSave={onSave} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSave).toHaveBeenCalledOnce();
  });
});
