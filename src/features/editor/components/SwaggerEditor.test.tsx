import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SwaggerEditor } from "./SwaggerEditor";

type MonacoEditorProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
};

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => (props: MonacoEditorProps) => (
    <textarea
      data-testid="monaco-editor"
      value={props.value ?? ""}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  ),
}));

vi.mock("@/provider/ThemeProvider", () => ({
  useTheme: () => ({ theme: "dark", toggle: () => {} }),
}));

describe("SwaggerEditor", () => {
  it("renders editor toolbar and Monaco wrapper", () => {
    render(
      <SwaggerEditor
        value="test"
        onChange={() => {}}
        language="yaml"
        readOnly={false}
        format="yaml"
        onFormatToggle={() => {}}
        onSaveSchema={() => {}}
        canSave
      />,
    );

    expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "editor.toolbar.clear" }),
    ).toBeInTheDocument();
  });

  it("calls onChange when the editor value changes", () => {
    const onChange = vi.fn();
    render(
      <SwaggerEditor
        value="initial"
        onChange={onChange}
        language="yaml"
        readOnly={false}
        format="yaml"
        onFormatToggle={() => {}}
        onSaveSchema={() => {}}
        canSave
      />,
    );

    fireEvent.change(screen.getByTestId("monaco-editor"), {
      target: { value: "updated" },
    });
    expect(onChange).toHaveBeenCalledWith("updated");
  });
});
