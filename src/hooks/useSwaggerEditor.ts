import { useCallback, useRef, useState } from "react";

import type { SwaggerEditorState } from "@/types/swagger";
import type { SchemaFormat } from "@/types/swagger";

import { detectFormat } from "@/services/formatDetection";
import { parseSchema } from "@/services/openApiParser";
import { validateSchema } from "@/services/schemaValidator";

const DEBOUNCE_MS = 500;

export function useSwaggerEditor(initialText: string) {
  const [state, setState] = useState<SwaggerEditorState>(() => {
    const format = detectFormat(initialText);
    const parseResult = parseSchema(initialText, format);

    return {
      rawText: initialText,
      format: format,
      schema: parseResult.schema,
      isValid: !parseResult.error,
      errors: parseResult.error ? [{ message: parseResult.error }] : [],
    };
  });

  const [displayFormat, setDisplayFormat] = useState<SchemaFormat | null>(
    state.format,
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processContent = useCallback(async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      setState({
        rawText: "",
        format: null,
        schema: null,
        isValid: false,
        errors: [],
      });
      setDisplayFormat(null);
      return;
    }

    const format = detectFormat(text);
    const parseResult = parseSchema(text, format);

    if (parseResult.error) {
      setState({
        rawText: text,
        format,
        schema: null,
        isValid: false,
        errors: [{ message: parseResult.error }],
      });
      setDisplayFormat(format);
      return;
    }

    if (!parseResult.schema) return;

    const validationResult = await validateSchema(parseResult.schema);

    setState({
      rawText: text,
      format,
      schema: parseResult.schema,
      isValid: validationResult.valid,
      errors: validationResult.errors,
    });
    setDisplayFormat(format);
  }, []);

  const updateContent = useCallback(
    (text: string) => {
      setState((prev) => ({ ...prev, rawText: text }));

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => processContent(text), DEBOUNCE_MS);
    },
    [processContent],
  );

  return { ...state, displayFormat, setDisplayFormat, updateContent };
}
