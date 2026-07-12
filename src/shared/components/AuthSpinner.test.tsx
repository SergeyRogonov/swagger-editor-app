import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AuthSpinner from "./AuthSpinner";
import { mockNextIntl } from "@/test-utils/nextIntlMock";

describe("AuthSpinner", () => {
  it("renders the translated authCheck text", () => {
    mockNextIntl();

    render(<AuthSpinner />);

    expect(screen.getByText("auth-spinner.authCheck")).toBeInTheDocument();
  });
});
