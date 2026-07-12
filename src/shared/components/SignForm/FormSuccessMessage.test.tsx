import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormSuccessMessage from "./FormSuccessMessage";

describe("FormSuccessMessage", () => {
  it("renders nothing when message is null", () => {
    const { container } = render(<FormSuccessMessage message={null} />);
    expect(container.textContent).toBe("");
  });

  it("renders success message when provided", () => {
    const MESSAGE = "success text";
    render(<FormSuccessMessage message={MESSAGE} />);

    const successDiv = screen.getByText(MESSAGE);
    expect(successDiv).toBeInTheDocument();
  });
});
