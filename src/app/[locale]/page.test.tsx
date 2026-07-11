import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./page";

import { useSwaggerEditor } from "@/hooks/useSwaggerEditor";
import { useOrientation } from "@/hooks/useOrientation";
import { useAuth } from "@/provider/AuthProvider";

import { convertSchema } from "@/services/schemaConverter";
import { loadSchema, saveSchema } from "@/services/schemaStorage";

vi.mock("@/features/editor/components/SwaggerEditor", () => ({
  SwaggerEditor: vi.fn(
    ({
      onFormatToggle,
      onSaveSchema,
      canSave,
    }: {
      onFormatToggle: () => void;
      onSaveSchema: () => void;
      canSave: boolean;
    }) => (
      <div data-testid="swagger-editor">
        <button onClick={onFormatToggle}>toggle-format</button>
        <button onClick={onSaveSchema}>save-schema</button>
        <span data-testid="can-save">{canSave ? "true" : "false"}</span>
      </div>
    ),
  ),
}));

vi.mock("@/features/editor/components/ValidationPanel", () => ({
  ValidationPanel: vi.fn(({ errors }) => (
    <div data-testid="validation-panel">{JSON.stringify(errors)}</div>
  )),
}));

vi.mock("@/features/viewer/components/SwaggerViewer", () => ({
  SwaggerViewer: vi.fn(({ schema }) => (
    <div data-testid="swagger-viewer">{JSON.stringify(schema)}</div>
  )),
}));

vi.mock("@/hooks/useSwaggerEditor");
vi.mock("@/hooks/useOrientation");
vi.mock("@/provider/AuthProvider");

vi.mock("@/services/schemaConverter", () => ({
  convertSchema: vi.fn(),
}));

vi.mock("@/services/schemaStorage", () => ({
  loadSchema: vi.fn(),
  saveSchema: vi.fn(),
}));

const mockedUseSwaggerEditor = vi.mocked(useSwaggerEditor);
const mockedUseOrientation = vi.mocked(useOrientation);
const mockedUseAuth = vi.mocked(useAuth);

const createSwaggerEditorMock = (
  overrides: Partial<ReturnType<typeof useSwaggerEditor>> = {},
): ReturnType<typeof useSwaggerEditor> => ({
  rawText: "swagger content",
  schema: {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
    paths: {},
  },
  derefSchema: {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
    paths: {},
  },
  format: "yaml",
  displayFormat: "yaml",
  setDisplayFormat: vi.fn(),
  errors: [],
  isValid: true,
  updateContent: vi.fn(),
  ...overrides,
});

const mockSchema = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  paths: {},
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseOrientation.mockReturnValue(true);

    mockedUseAuth.mockReturnValue({
      isAuth: false,
      isLoading: false,
    });

    mockedUseSwaggerEditor.mockReturnValue(createSwaggerEditorMock());
  });

  it("shows loading state while orientation is unavailable", () => {
    mockedUseOrientation.mockReturnValue(null);

    render(<HomePage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders loading state until editor initialization completes", async () => {
    mockedUseAuth.mockReturnValue({
      isAuth: false,
      isLoading: true,
    });

    render(<HomePage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders editor, validation panel and viewer", async () => {
    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByTestId("swagger-editor")).toBeInTheDocument(),
    );

    expect(screen.getByTestId("validation-panel")).toBeInTheDocument();

    expect(screen.getByTestId("swagger-viewer")).toBeInTheDocument();
  });

  it("loads saved schema for authenticated users", async () => {
    mockedUseAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
    });

    vi.mocked(loadSchema).mockResolvedValue("saved swagger schema");

    const updateContent = vi.fn();

    mockedUseSwaggerEditor.mockReturnValue(
      createSwaggerEditorMock({
        rawText: "",
        schema: mockSchema,
        derefSchema: mockSchema,
        updateContent,
      }),
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(loadSchema).toHaveBeenCalled();
    });

    expect(updateContent).toHaveBeenCalledWith("saved swagger schema", false);
  });

  it("does not load saved schema for unauthenticated users", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId("swagger-editor")).toBeInTheDocument();
    });

    expect(loadSchema).not.toHaveBeenCalled();
  });

  it("toggles format from yaml to json", async () => {
    const setDisplayFormat = vi.fn();
    const updateContent = vi.fn();

    mockedUseSwaggerEditor.mockReturnValue(
      createSwaggerEditorMock({
        schema: {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
          },
          paths: {},
        },
        format: "yaml",
        displayFormat: "yaml",
        setDisplayFormat,
        updateContent,
      }),
    );

    vi.mocked(convertSchema).mockReturnValue({
      text: '{"test":true}',
      error: null,
    });

    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByTestId("swagger-editor")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("toggle-format"));

    await waitFor(() => {
      expect(setDisplayFormat).toHaveBeenCalledWith("json");

      expect(convertSchema).toHaveBeenCalledWith(
        {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
          },
          paths: {},
        },
        "json",
      );

      expect(updateContent).toHaveBeenCalledWith('{"test":true}');
    });
  });

  it("does nothing when schema or format is missing during toggle", async () => {
    const setDisplayFormat = vi.fn();

    mockedUseSwaggerEditor.mockReturnValue(
      createSwaggerEditorMock({
        schema: null,
        format: null,
      }),
    );

    render(<HomePage />);

    await waitFor(() => screen.getByTestId("swagger-editor"));

    fireEvent.click(screen.getByText("toggle-format"));

    expect(setDisplayFormat).not.toHaveBeenCalled();

    expect(convertSchema).not.toHaveBeenCalled();
  });

  it("saves schema when save button is clicked", async () => {
    render(<HomePage />);

    await waitFor(() => screen.getByTestId("swagger-editor"));

    fireEvent.click(screen.getByText("save-schema"));

    await waitFor(() => {
      expect(saveSchema).toHaveBeenCalledWith("swagger content");
    });
  });

  it("passes save permission correctly", async () => {
    mockedUseAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
    });

    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByTestId("can-save")).toHaveTextContent("true"),
    );
  });

  it("renders horizontal split in landscape mode", async () => {
    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      ),
    );
  });

  it("renders vertical split in portrait mode", async () => {
    mockedUseOrientation.mockReturnValue(false);

    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "horizontal",
      ),
    );
  });

  it("resizes editor pane when dragging the resizer in landscape mode", async () => {
    mockedUseOrientation.mockReturnValue(true);

    render(<HomePage />);

    const separator = await screen.findByRole("separator");

    const split = separator.parentElement;

    expect(split).toBeTruthy();

    vi.spyOn(split!, "getBoundingClientRect").mockReturnValue({
      width: 1000,
      height: 800,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 800,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    });

    Object.defineProperty(separator, "setPointerCapture", {
      value: vi.fn(),
    });

    fireEvent.pointerDown(separator, {
      pointerId: 1,
    });

    fireEvent.pointerMove(window, {
      clientX: 500,
    });

    await waitFor(() => {
      expect(separator.parentElement?.firstElementChild).toHaveStyle({
        width: "50%",
      });
    });

    fireEvent.pointerUp(window, {
      pointerId: 1,
    });
  });
});
