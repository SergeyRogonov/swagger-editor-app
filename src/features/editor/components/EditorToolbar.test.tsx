import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditorToolbar } from "./EditorToolbar";

vi.mock("@/services/fileLoader", () => ({
  loadTextFile: vi.fn(),
}));

import { loadTextFile } from "@/services/fileLoader";

const loadTextFileMock = vi.mocked(loadTextFile);

describe("EditorToolbar", () => {
  beforeEach(() => {
    loadTextFileMock.mockReset();
  });

  it("clears editor content when clear button is clicked", () => {
    const onChange = vi.fn();
    render(
      <EditorToolbar
        value="hello"
        format="yaml"
        onChange={onChange}
        onFormatToggle={() => {}}
        onSaveSchema={() => {}}
        canSave
      />,
    );
    fireEvent.click(screen.getByText("editor.toolbar.clear"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("loads file text and calls onChange when a file is selected", async () => {
    loadTextFileMock.mockResolvedValue("loaded content");
    const onChange = vi.fn();
    render(
      <EditorToolbar
        value=""
        format="yaml"
        onChange={onChange}
        onFormatToggle={() => {}}
        onSaveSchema={() => {}}
        canSave
      />,
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["schema"], "schema.yaml", { type: "text/yaml" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(loadTextFileMock).toHaveBeenCalledWith(file));
    expect(onChange).toHaveBeenCalledWith("loaded content");
  });
});
