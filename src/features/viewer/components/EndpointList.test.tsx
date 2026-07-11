import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EndpointList } from "./EndpointList";
import type { OpenAPIV3 } from "openapi-types";

vi.mock("./EndpointItem", () => ({
  EndpointItem: ({ method, path }: { method: string; path: string }) => (
    <div data-testid="endpoint-item">
      {method.toUpperCase()} {path}
    </div>
  ),
}));

const createSchema = (
  overrides: Partial<OpenAPIV3.Document> = {},
): OpenAPIV3.Document => ({
  openapi: "3.0.3",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  paths: {},
  ...overrides,
});

describe("EndpointList", () => {
  it("renders a message when there are no endpoints", () => {
    render(<EndpointList schema={createSchema()} />);

    expect(screen.getByText("No endpoints defined.")).toBeInTheDocument();
  });

  it("groups endpoints by tag", () => {
    const schema = createSchema({
      tags: [
        {
          name: "pets",
          description: "Pet operations",
        },
      ],
      paths: {
        "/pets": {
          get: {
            tags: ["pets"],
            responses: {},
          },
        },
        "/pets/{id}": {
          post: {
            tags: ["pets"],
            responses: {},
          },
        },
      },
    });

    render(<EndpointList schema={schema} />);

    expect(screen.getByRole("button", { name: /pets/i })).toBeInTheDocument();

    expect(screen.getByText("Pet operations")).toBeInTheDocument();

    expect(screen.getByText("GET /pets")).toBeInTheDocument();
    expect(screen.getByText("POST /pets/{id}")).toBeInTheDocument();
  });

  it('groups endpoints without tags under "default"', () => {
    const schema = createSchema({
      paths: {
        "/health": {
          get: {
            responses: {},
          },
        },
      },
    });

    render(<EndpointList schema={schema} />);

    expect(
      screen.getByRole("button", { name: /default/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("GET /health")).toBeInTheDocument();
  });

  it("creates separate groups for different tags", () => {
    const schema = createSchema({
      paths: {
        "/pets": {
          get: {
            tags: ["pets"],
            responses: {},
          },
        },
        "/users": {
          get: {
            tags: ["users"],
            responses: {},
          },
        },
      },
    });

    render(<EndpointList schema={schema} />);

    expect(screen.getByRole("button", { name: /pets/i })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /users/i })).toBeInTheDocument();

    expect(screen.getAllByTestId("endpoint-item")).toHaveLength(2);
  });

  it("collapses and expands a tag group", () => {
    const schema = createSchema({
      paths: {
        "/pets": {
          get: {
            tags: ["pets"],
            responses: {},
          },
        },
      },
    });

    render(<EndpointList schema={schema} />);

    expect(screen.getByText("GET /pets")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /pets/i }));

    expect(screen.queryByText("GET /pets")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /pets/i }));

    expect(screen.getByText("GET /pets")).toBeInTheDocument();
  });

  it("passes the base server url to endpoint items", () => {
    const schema = createSchema({
      servers: [
        {
          url: "https://api.example.com",
        },
      ],
      paths: {
        "/pets": {
          get: {
            tags: ["pets"],
            responses: {},
          },
        },
      },
    });

    render(<EndpointList schema={schema} />);

    expect(screen.getByTestId("endpoint-item")).toBeInTheDocument();
  });
});
