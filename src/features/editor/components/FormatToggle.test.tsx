import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormatToggle } from "./FormatToggle";

describe("FormatToggle", () => {
  it("renders toJson when currentFormat is yaml", () => {
    render(<FormatToggle currentFormat="yaml" onToggle={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent(
      "editor.formatToggle.toJson",
    );
  });

  it("renders toYaml when currentFormat is json", () => {
    render(<FormatToggle currentFormat="json" onToggle={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent(
      "editor.formatToggle.toYaml",
    );
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<FormatToggle currentFormat="yaml" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    render(<FormatToggle currentFormat="yaml" onToggle={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
