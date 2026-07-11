import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./AboutPage";

vi.mock("../data/team", () => ({
  team: [
    {
      id: "alex",
      github: "https://github.com/alex",
    },
    {
      id: "bob",
      github: "https://github.com/bob",
    },
  ],
}));

describe("AboutPage", () => {
  it("renders page headings", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: "about.pageTitle", level: 1 }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "about.team.title",
        level: 2,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "about.technologiesLabel",
        level: 2,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "about.resourcesLabel",
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it("renders a card for each team member", () => {
    render(<AboutPage />);

    expect(
      screen.getByText("about.team.members.alex.name"),
    ).toBeInTheDocument();
    expect(screen.getByText("about.team.members.bob.name")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "alex" })).toHaveAttribute(
      "href",
      "https://github.com/alex",
    );

    expect(screen.getByRole("link", { name: "bob" })).toHaveAttribute(
      "href",
      "https://github.com/bob",
    );
  });

  it("renders all technology badges", () => {
    render(<AboutPage />);

    [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Monaco Editor",
      "Swagger Parser",
      "OpenAPI 3",
    ].forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it("renders resource links", () => {
    render(<AboutPage />);

    expect(screen.getByRole("link", { name: "RS School" })).toHaveAttribute(
      "href",
      "https://rs.school/",
    );

    expect(
      screen.getByRole("link", { name: "OpenAPI Specification" }),
    ).toHaveAttribute("href", "https://swagger.io/specification/");

    expect(
      screen.getByRole("link", {
        name: "OpenAPI GitHub Repository",
      }),
    ).toHaveAttribute("href", "https://github.com/OAI/OpenAPI-Specification");
  });
});
