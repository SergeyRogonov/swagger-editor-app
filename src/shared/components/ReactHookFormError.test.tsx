import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReactHookFormError from "./ReactHookFormError";
import type { FieldError } from "react-hook-form";

describe("ReactHookFormError", () => {
  it("renders null when error is not provided", () => {
    const { container } = render(<ReactHookFormError />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the error message when error is provided", () => {
    const error: FieldError = {
      type: "required",
      message: "Required",
    };

    render(<ReactHookFormError error={error} />);

    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
