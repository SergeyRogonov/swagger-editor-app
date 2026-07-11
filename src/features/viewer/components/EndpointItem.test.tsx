import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { EndpointItem } from "./EndpointItem";
import type { OpenAPIV3 } from "openapi-types";

vi.mock("./TryItOut", () => ({
  TryItOut: ({
    method,
    path,
    baseUrl,
    selectedMime,
    acceptMime,
  }: {
    method: string;
    path: string;
    baseUrl: string;
    selectedMime: string;
    acceptMime: string;
  }) => (
    <div data-testid="try-it-out">
      {method}|{path}|{baseUrl}|{selectedMime}|{acceptMime}
    </div>
  ),
}));

const operation: OpenAPIV3.OperationObject = {
  summary: "List pets",
  description: "Returns all pets.",
  tags: ["pets"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "Pet id",
      schema: {
        type: "string",
      },
    },
    {
      name: "limit",
      in: "query",
      required: false,
      description: "Limit results",
      schema: {
        type: "integer",
      },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
          },
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
    "404": {
      description: "Not found",
    },
  },
};

describe("EndpointItem", () => {
  it("expands and collapses", () => {
    render(
      <EndpointItem
        method="get"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={operation}
      />,
    );

    const toggleButton = screen.getByRole("button", {
      name: /get.*\/pets.*List pets/i,
    });

    fireEvent.click(toggleButton);

    expect(screen.getByText("Returns all pets.")).toBeInTheDocument();
    expect(screen.getByTestId("try-it-out")).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.queryByTestId("try-it-out")).not.toBeInTheDocument();
  });

  it("renders parameters table", () => {
    render(
      <EndpointItem
        method="get"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={operation}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Parameters")).toBeInTheDocument();

    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("limit")).toBeInTheDocument();

    expect(screen.getByText("Pet id")).toBeInTheDocument();
    expect(screen.getByText("Limit results")).toBeInTheDocument();

    expect(screen.getByText("string")).toBeInTheDocument();
    expect(screen.getByText("integer")).toBeInTheDocument();

    expect(screen.getByText("yes")).toBeInTheDocument();
    expect(screen.getByText("no")).toBeInTheDocument();
  });

  it("renders request body section", () => {
    render(
      <EndpointItem
        method="post"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={operation}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    const requestBody = screen.getByTestId("request-body");

    expect(requestBody).toBeInTheDocument();
    expect(requestBody).toHaveTextContent("Request Body");
    expect(requestBody).toHaveTextContent("required");
    expect(requestBody).toHaveTextContent("application/json");
  });

  it("renders responses", () => {
    render(
      <EndpointItem
        method="get"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={operation}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Responses")).toBeInTheDocument();

    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Not found")).toBeInTheDocument();
  });

  it("passes props to TryItOut", () => {
    render(
      <EndpointItem
        method="post"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={operation}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("try-it-out")).toHaveTextContent(
      "post|/pets|https://api.example.com|application/json|application/json",
    );
  });

  it("does not render parameters section when there are no parameters", () => {
    const operationWithoutParams: OpenAPIV3.OperationObject = {
      responses: {
        "200": {
          description: "OK",
        },
      },
    };

    render(
      <EndpointItem
        method="get"
        path="/health"
        baseUrl=""
        operation={operationWithoutParams}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("Parameters")).not.toBeInTheDocument();
  });

  it("switches request body from schema to example", () => {
    render(
      <EndpointItem
        method="post"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={operation}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /post.*\/pets.*List pets/i,
      }),
    );

    const requestBody = screen.getByTestId("request-body");

    fireEvent.click(
      within(requestBody).getByRole("button", {
        name: "Example",
      }),
    );

    expect(screen.getByText(/"name": "string"/)).toBeInTheDocument();
  });

  it("changes selected request MIME type", () => {
    const multiMimeOperation: OpenAPIV3.OperationObject = {
      ...operation,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
          "application/xml": {
            schema: {
              type: "object",
            },
          },
        },
      },
    };

    render(
      <EndpointItem
        method="post"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={multiMimeOperation}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: {
        value: "application/xml",
      },
    });

    expect(select).toHaveValue("application/xml");
  });

  it("formats XML examples", () => {
    const xmlOperation: OpenAPIV3.OperationObject = {
      ...operation,
      requestBody: {
        content: {
          "application/xml": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "dog",
                },
              },
            },
          },
        },
      },
    };

    render(
      <EndpointItem
        method="post"
        path="/pets"
        baseUrl="https://api.example.com"
        operation={xmlOperation}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    const requestBody = screen.getByTestId("request-body");

    fireEvent.click(
      within(requestBody).getByRole("button", {
        name: "Example",
      }),
    );

    expect(screen.getByText(/<name>dog<\/name>/)).toBeInTheDocument();
  });

  it("formats form-urlencoded examples", () => {
    const formOperation: OpenAPIV3.OperationObject = {
      ...operation,
      requestBody: {
        content: {
          "application/x-www-form-urlencoded": {
            example: {
              name: "dog",
            },
          },
        },
      },
    };

    render(
      <EndpointItem
        method="post"
        path="/pets"
        baseUrl=""
        operation={formOperation}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /post.*\/pets.*List pets/i,
      }),
    );

    const requestBody = screen.getByTestId("request-body");

    fireEvent.click(
      within(requestBody).getByRole("button", {
        name: "Example",
      }),
    );

    expect(within(requestBody).getByText("name=dog")).toBeInTheDocument();
  });
});
