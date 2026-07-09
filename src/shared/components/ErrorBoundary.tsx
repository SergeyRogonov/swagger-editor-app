"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  children: ReactNode;
  pathname: string;
}

interface State {
  error: Error | null;
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.pathname !== this.props.pathname) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <h2 className="mb-2 text-xl font-semibold text-red-400">
              Something went wrong
            </h2>
            <p className="text-slate-400">{this.state.error.message}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                className="rounded bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
                onClick={() => this.setState({ error: null })}
              >
                Try again
              </button>
              <Link
                href="/"
                className="rounded bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
              >
                Go to main
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ErrorBoundaryInner pathname={pathname}>{children}</ErrorBoundaryInner>
  );
}
