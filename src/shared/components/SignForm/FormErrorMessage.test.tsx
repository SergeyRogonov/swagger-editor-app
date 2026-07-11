import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormErrorMessage from "./FormErrorMessage";

describe("FormErrorMessage", () => {
  it("renders nothing when message is null", () => {
    const { container } = render(<FormErrorMessage message={null} />);
    expect(container.textContent).toBe("");
  });

  it("renders error message when provided", () => {
    const MESSAGE = "Error text";
    render(<FormErrorMessage message={MESSAGE} />);

    const errorDiv = screen.getByText(MESSAGE);
    expect(errorDiv).toBeInTheDocument();
  });
});
