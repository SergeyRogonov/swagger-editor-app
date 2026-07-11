import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TryItOut } from "./TryItOut";
import type { OpenAPIV3 } from "openapi-types";

const writeText = vi.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

const fetchMock = vi.fn();

global.fetch = fetchMock;

const parameters: OpenAPIV3.ParameterObject[] = [
  {
    name: "id",
    in: "path",
    required: true,
    schema: { type: "string" },
  },
  {
    name: "limit",
    in: "query",
    schema: { type: "integer" },
  },
  {
    name: "Authorization",
    in: "header",
    schema: { type: "string" },
  },
];

const requestBody: OpenAPIV3.RequestBodyObject = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
      },
    },
  },
};

function renderComponent() {
  render(
    <TryItOut
      method="post"
      path="/pets/{id}"
      baseUrl="https://api.example.com"
      parameters={parameters}
      requestBody={requestBody}
      selectedMime="application/json"
      acceptMime="application/json"
    />,
  );
}

describe("TryItOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders parameter inputs", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("limit")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Authorization")).toBeInTheDocument();

    expect(screen.getByPlaceholderText('{"key": "value"}')).toBeInTheDocument();
  });

  it("executes request", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
        },
        body: {
          success: true,
        },
      }),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("id"), {
      target: { value: "42" },
    });

    fireEvent.change(screen.getByPlaceholderText("limit"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByPlaceholderText("Authorization"), {
      target: { value: "Bearer token" },
    });

    fireEvent.change(screen.getByPlaceholderText('{"key": "value"}'), {
      target: {
        value: '{"name":"Fluffy"}',
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Execute" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/proxy",
      expect.objectContaining({
        method: "POST",
      }),
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);

    expect(body).toEqual({
      url: "https://api.example.com/pets/42?limit=10",
      method: "post",
      headers: {
        Authorization: "Bearer token",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {
        name: "Fluffy",
      },
    });
  });

  it("renders response", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
        },
        body: {
          success: true,
        },
      }),
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Execute" }));

    expect(await screen.findByText("200 OK")).toBeInTheDocument();
    expect(screen.getByText(/success/)).toBeInTheDocument();
  });

  it("renders request error", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Execute" }));

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });

  it("clears response", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        status: 200,
        statusText: "OK",
        headers: {},
        body: {},
      }),
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Execute" }));

    await screen.findByText("200 OK");

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.queryByText("200 OK")).not.toBeInTheDocument();
  });

  it("copies curl command", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        status: 200,
        statusText: "OK",
        headers: {},
        body: {},
      }),
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Execute" }));

    await screen.findByText("Copy");

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain("curl -X POST");
  });

  it("formats xml response", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/xml",
        },
        body: "<root><item>value</item></root>",
      }),
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Execute" }));

    expect(await screen.findByText("200 OK")).toBeInTheDocument();

    expect(
      screen.getByText(
        (content) =>
          content.includes("<root>") &&
          content.includes("<item>value</item>") &&
          content.includes("</root>"),
      ),
    ).toBeInTheDocument();
  });
});
