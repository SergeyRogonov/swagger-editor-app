import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SwaggerViewer } from "./SwaggerViewer";
import type { OpenAPIV3 } from "openapi-types";

vi.mock("./EndpointList", () => ({
  EndpointList: () => <div data-testid="endpoint-list" />,
}));

describe("SwaggerViewer", () => {
  it("renders placeholder when schema is null", () => {
    render(<SwaggerViewer schema={null} />);

    expect(
      screen.getByRole("heading", { name: "Swagger Viewer" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Load a valid schema to see endpoints."),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("endpoint-list")).not.toBeInTheDocument();
  });

  it("renders schema metadata", () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.1.0",
      info: {
        title: "Pet API",
        version: "1.0.0",
      },
      paths: {},
    };

    render(<SwaggerViewer schema={schema} />);

    expect(
      screen.getByRole("heading", { name: "Pet API" }),
    ).toBeInTheDocument();

    expect(screen.getByText("API v1.0.0")).toBeInTheDocument();
    expect(screen.getByText("OpenAPI 3.1.0")).toBeInTheDocument();
    expect(screen.getByTestId("endpoint-list")).toBeInTheDocument();
  });

  it("renders description markdown", () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: {
        title: "Pet API",
        version: "1.0.0",
        description: "This is **markdown** with a [link](https://example.com).",
      },
      paths: {},
    };

    render(<SwaggerViewer schema={schema} />);

    expect(
      screen.getByText(
        (content, element) =>
          element?.tagName === "P" && content.includes("This is"),
      ),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "link" });

    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders markdown lists", () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: {
        title: "Pet API",
        version: "1.0.0",
        description: `
- Dogs
- Cats
      `,
      },
      paths: {},
    };

    render(<SwaggerViewer schema={schema} />);

    expect(screen.getByText("Dogs")).toBeInTheDocument();
    expect(screen.getByText("Cats")).toBeInTheDocument();
  });

  it("renders optional metadata links", () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: {
        title: "Pet API",
        version: "1.0.0",
        termsOfService: "https://example.com/terms",
        contact: {
          name: "Support",
          email: "support@example.com",
          url: "https://example.com/contact",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
      externalDocs: {
        description: "Documentation",
        url: "https://example.com/docs",
      },
      paths: {},
    };

    render(<SwaggerViewer schema={schema} />);

    expect(
      screen.getByRole("link", {
        name: "https://example.com/terms",
      }),
    ).toHaveAttribute("href", "https://example.com/terms");

    expect(
      screen.getByRole("link", {
        name: "support@example.com",
      }),
    ).toHaveAttribute("href", "mailto:support@example.com");

    expect(
      screen.getByRole("link", {
        name: "https://example.com/contact",
      }),
    ).toHaveAttribute("href", "https://example.com/contact");

    expect(
      screen.getByRole("link", {
        name: "MIT",
      }),
    ).toHaveAttribute("href", "https://opensource.org/licenses/MIT");

    expect(
      screen.getByRole("link", {
        name: "https://example.com/docs",
      }),
    ).toHaveAttribute("href", "https://example.com/docs");
  });

  it("renders license name without a link when url is absent", () => {
    const schema: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: {
        title: "Pet API",
        version: "1.0.0",
        license: {
          name: "Apache 2.0",
        },
      },
      paths: {},
    };

    render(<SwaggerViewer schema={schema} />);

    expect(screen.getByText("Apache 2.0")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Apache 2.0" }),
    ).not.toBeInTheDocument();
  });
});
