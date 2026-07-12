"use client";

import type { OpenAPIV3 } from "openapi-types";
import ReactMarkdown from "react-markdown";
import { EndpointList } from "./EndpointList";

type SwaggerViewerProps = {
  schema: OpenAPIV3.Document | null;
};

export function SwaggerViewer({ schema }: SwaggerViewerProps) {
  if (!schema) {
    return (
      <section className="min-h-full border border-overlay flex flex-col">
        <div className="border-b border-overlay px-4 py-3">
          <h2 className="text-lg font-semibold">Swagger Viewer</h2>
        </div>

        <div className="p-4 text-text-muted">
          Load a valid schema to see endpoints.
        </div>
      </section>
    );
  }

  const { info, externalDocs, openapi } = schema;

  return (
    <section className="border-overlay flex flex-col">
      <div className="border-b border-overlay p-6 space-y-5 flex-none">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">{info.title}</h2>

            {info.version && (
              <span className="rounded bg-elevated px-2 py-1 text-xs text-text-primary">
                API v{info.version}
              </span>
            )}

            {openapi && (
              <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-500">
                OpenAPI {openapi}
              </span>
            )}
          </div>
        </div>

        {info.description && (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: (props) => <p className="mb-4 last:mb-0" {...props} />,
                ul: (props) => (
                  <ul className="mb-4 ml-6 list-disc" {...props} />
                ),
                ol: (props) => (
                  <ol className="mb-4 ml-6 list-decimal" {...props} />
                ),
                li: (props) => <li className="mb-1" {...props} />,
                a: (props) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  />
                ),
              }}
            >
              {info.description}
            </ReactMarkdown>
          </div>
        )}

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          {info.termsOfService && (
            <div>
              <div className="text-text-secondary">Terms of Service</div>
              <a
                href={info.termsOfService}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {info.termsOfService}
              </a>
            </div>
          )}

          {info.contact && (
            <div>
              <div className="text-text-secondary">Contact</div>

              <div className="space-y-1">
                {info.contact.name && <div>{info.contact.name}</div>}

                {info.contact.email && (
                  <a
                    href={`mailto:${info.contact.email}`}
                    className="text-blue-400 hover:underline"
                  >
                    {info.contact.email}
                  </a>
                )}

                {info.contact.url && (
                  <div>
                    <a
                      href={info.contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline break-all"
                    >
                      {info.contact.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {info.license && (
            <div>
              <div className="text-text-secondary">License</div>

              {info.license.url ? (
                <a
                  href={info.license.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {info.license.name}
                </a>
              ) : (
                <span>{info.license.name}</span>
              )}
            </div>
          )}

          {externalDocs && (
            <div>
              <div className="text-text-secondary">
                {externalDocs.description ?? "External Documentation"}
              </div>

              <a
                href={externalDocs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {externalDocs.url}
              </a>
            </div>
          )}
        </div>
      </div>

      <div>
        <EndpointList schema={schema} />
      </div>
    </section>
  );
}
