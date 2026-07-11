import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

import { useSwaggerEditor } from "./useSwaggerEditor";

import { detectFormat } from "@/services/formatDetection";
import { parseSchema } from "@/services/openApiParser";
import { validateSchema } from "@/services/schemaValidator";
import { dereferenceSchema } from "@/services/schemaDereferencer";

vi.mock("@/services/formatDetection", () => ({
  detectFormat: vi.fn(),
}));

vi.mock("@/services/openApiParser", () => ({
  parseSchema: vi.fn(),
}));

vi.mock("@/services/schemaValidator", () => ({
  validateSchema: vi.fn(),
}));

vi.mock("@/services/schemaDereferencer", () => ({
  dereferenceSchema: vi.fn(),
}));

const mockedDetectFormat = vi.mocked(detectFormat);
const mockedParseSchema = vi.mocked(parseSchema);
const mockedValidateSchema = vi.mocked(validateSchema);
const mockedDereferenceSchema = vi.mocked(dereferenceSchema);

const mockSchema = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  paths: {},
};

describe("useSwaggerEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedDetectFormat.mockReturnValue("yaml");

    mockedParseSchema.mockReturnValue({
      schema: mockSchema,
      error: null,
    });

    mockedValidateSchema.mockResolvedValue({
      valid: true,
      errors: [],
    });

    mockedDereferenceSchema.mockResolvedValue(mockSchema);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useSwaggerEditor(""));

    expect(result.current.rawText).toBe("");
    expect(result.current.schema).toBeNull();
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toEqual([]);
    expect(result.current.displayFormat).toBeNull();
  });

  it("processes initial content", async () => {
    const { result } = renderHook(() => useSwaggerEditor("openapi: 3.0.0"));

    await waitFor(() => {
      expect(result.current.isValid).toBe(true);
    });

    expect(mockedDetectFormat).toHaveBeenCalledWith("openapi: 3.0.0");

    expect(result.current.schema).toEqual(mockSchema);

    expect(result.current.derefSchema).toEqual(mockSchema);

    expect(result.current.displayFormat).toBe("yaml");
  });

  it("returns empty state when updating with blank content", async () => {
    const { result } = renderHook(() => useSwaggerEditor(""));

    act(() => {
      result.current.updateContent("   ", false);
    });

    expect(result.current.rawText).toBe("   ");

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.schema).toBeNull();
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it("handles parse errors", async () => {
    mockedParseSchema.mockReturnValue({
      schema: null,
      error: "Invalid YAML",
    });

    const { result } = renderHook(() => useSwaggerEditor(""));

    await act(async () => {
      result.current.updateContent("bad yaml", false);
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toEqual([
      {
        message: "Invalid YAML",
      },
    ]);

    expect(result.current.schema).toBeNull();
  });

  it("handles validation errors", async () => {
    mockedValidateSchema.mockResolvedValue({
      valid: false,
      errors: [
        {
          message: "Missing info.title",
        },
      ],
    });

    const { result } = renderHook(() => useSwaggerEditor(""));

    await act(async () => {
      result.current.updateContent("invalid schema", false);
    });

    expect(result.current.isValid).toBe(false);

    expect(result.current.errors).toEqual([
      {
        message: "Missing info.title",
      },
    ]);

    expect(result.current.derefSchema).toBeNull();

    expect(mockedDereferenceSchema).not.toHaveBeenCalled();
  });

  it("dereferences valid schemas", async () => {
    const { result } = renderHook(() => useSwaggerEditor(""));

    await act(async () => {
      await result.current.updateContent("valid schema", false);
    });

    expect(mockedDereferenceSchema).toHaveBeenCalledWith(mockSchema);

    expect(result.current.derefSchema).toEqual(mockSchema);
  });

  it("updates immediately when debounce is false", async () => {
    const { result } = renderHook(() => useSwaggerEditor(""));

    await act(async () => {
      result.current.updateContent("new content", false);
    });

    expect(result.current.rawText).toBe("new content");
    expect(mockedParseSchema).toHaveBeenCalledWith("new content", "yaml");
  });

  it("debounces updates by 500ms", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSwaggerEditor(""));

    act(() => {
      result.current.updateContent("debounced content");
    });

    expect(mockedParseSchema).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockedParseSchema).toHaveBeenCalled();
  });

  it("clears previous debounce timers", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSwaggerEditor(""));

    act(() => {
      result.current.updateContent("first");
      result.current.updateContent("second");
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockedParseSchema).toHaveBeenCalledTimes(1);
    expect(mockedParseSchema).toHaveBeenCalledWith("second", "yaml");
  });

  it("allows changing display format manually", () => {
    const { result } = renderHook(() => useSwaggerEditor(""));

    act(() => {
      result.current.setDisplayFormat("json");
    });

    expect(result.current.displayFormat).toBe("json");
  });

  it("cleans up debounce timer on unmount", () => {
    const clearSpy = vi.spyOn(global, "clearTimeout");

    const { result, unmount } = renderHook(() => useSwaggerEditor(""));

    act(() => {
      result.current.updateContent("pending");
    });

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
