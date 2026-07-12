import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SignForm from "./SignForm";

describe("SignForm", () => {
  it("renders with different props", () => {
    const CUSTOM_PROPS = {
      title: "TestTitle",
      subTitle: "TestSubTitle",
      children: <input placeholder="Email" />,
    };

    render(<SignForm {...CUSTOM_PROPS} />);

    expect(screen.getByText(CUSTOM_PROPS.title)).toBeInTheDocument();
    expect(screen.getByText(CUSTOM_PROPS.subTitle)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });
});
