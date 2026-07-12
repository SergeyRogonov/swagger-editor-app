import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TeamMemberCard from "./TeamMemberCard";

describe("TeamMemberCard", () => {
  it("renders member information", () => {
    render(
      <TeamMemberCard
        name="John Doe"
        role="Frontend Developer"
        github="https://github.com/johndoe"
        githubUsername="johndoe"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "John Doe" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("renders a GitHub link with correct attributes", () => {
    render(
      <TeamMemberCard
        name="John Doe"
        role="Frontend Developer"
        github="https://github.com/johndoe"
        githubUsername="johndoe"
      />,
    );

    const link = screen.getByRole("link", { name: "johndoe" });

    expect(link).toHaveAttribute("href", "https://github.com/johndoe");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
