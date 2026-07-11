import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValidationPanel } from "./ValidationPanel";

describe("ValidationPanel", () => {
  it("renders nothing when there are no errors", () => {
    const { container } = render(<ValidationPanel errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the first validation error message", () => {
    render(<ValidationPanel errors={[{ message: "Invalid schema" }]} />);
    expect(screen.getByText("editor.validation.title")).toBeInTheDocument();
    expect(screen.getByText("Invalid schema")).toBeInTheDocument();
  });
});
