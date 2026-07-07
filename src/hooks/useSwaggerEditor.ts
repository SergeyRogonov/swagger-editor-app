import { useCallback, useEffect, useRef, useState } from "react";

import type { SwaggerEditorState, SchemaFormat } from "@/types/swagger";
import { detectFormat } from "@/services/formatDetection";
import { parseSchema } from "@/services/openApiParser";
import { validateSchema } from "@/services/schemaValidator";
import { dereferenceSchema } from "@/services/schemaDereferencer";

const DEBOUNCE_MS = 500;

const EMPTY_STATE: SwaggerEditorState = {
  rawText: "",
  format: null,
  schema: null,
  derefSchema: null,
  isValid: false,
  errors: [],
};

async function buildState(
  text: string,
): Promise<SwaggerEditorState & { displayFormat: SchemaFormat | null }> {
  const trimmed = text.trim();
  if (!trimmed) return { ...EMPTY_STATE, displayFormat: null };

  const format = detectFormat(text);
  const parseResult = parseSchema(text, format);

  if (parseResult.error || !parseResult.schema) {
    return {
      rawText: text,
      format,
      schema: null,
      derefSchema: null,
      isValid: false,
      errors: [{ message: parseResult.error ?? "Parse failed" }],
      displayFormat: format,
    };
  }

  const validationResult = await validateSchema(parseResult.schema);

  if (!validationResult.valid) {
    return {
      rawText: text,
      format,
      schema: parseResult.schema,
      derefSchema: null,
      isValid: false,
      errors: validationResult.errors,
      displayFormat: format,
    };
  }

  const derefSchema = await dereferenceSchema(parseResult.schema);

  return {
    rawText: text,
    format,
    schema: parseResult.schema,
    derefSchema,
    isValid: true,
    errors: [],
    displayFormat: format,
  };
}

export function useSwaggerEditor(initialText: string) {
  const [state, setState] = useState<SwaggerEditorState>({
    ...EMPTY_STATE,
    rawText: initialText,
  });
  const [displayFormat, setDisplayFormat] = useState<SchemaFormat | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  const applyState = useCallback(
    (built: Awaited<ReturnType<typeof buildState>>) => {
      const { displayFormat: df, ...rest } = built;
      setState(rest);
      setDisplayFormat(df);
    },
    [],
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    buildState(initialText).then(applyState);
  }, [initialText, applyState]);

  const processContent = useCallback(
    async (text: string) => {
      applyState(await buildState(text));
    },
    [applyState],
  );

  const updateContent = useCallback(
    (text: string) => {
      setState((prev) => ({ ...prev, rawText: text }));
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => processContent(text), DEBOUNCE_MS);
    },
    [processContent],
  );

  return { ...state, displayFormat, setDisplayFormat, updateContent };
}
