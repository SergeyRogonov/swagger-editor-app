import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOrientation } from "./useOrientation";

describe("useOrientation", () => {
  beforeEach(() => {
    // Reset viewport before each test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when the screen is landscape", () => {
    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(true);
  });

  it("returns false when the screen is portrait", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 600,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 800,
    });

    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(false);
  });

  it("updates orientation when window is resized", () => {
    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 500,
      });

      Object.defineProperty(window, "innerHeight", {
        value: 900,
      });

      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(false);
  });

  it("removes resize listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useOrientation());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
