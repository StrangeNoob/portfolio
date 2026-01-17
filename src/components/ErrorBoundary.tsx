'use client';

import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="terminal-window max-w-lg w-full glow-ring">
            <div className="terminal-header">
              <div className="terminal-btn terminal-btn-close" />
              <div className="terminal-btn terminal-btn-minimize" />
              <div className="terminal-btn terminal-btn-maximize" />
              <span className="terminal-title">error.log</span>
            </div>
            <div className="terminal-body text-sm" role="alert" aria-live="assertive">
              <div className="text-terminal-red mb-4">
                <span className="font-bold">ERROR:</span> Something went wrong
              </div>
              <div className="text-foreground-muted mb-4 font-mono text-xs">
                {this.state.error?.message || 'An unexpected error occurred'}
              </div>
              <div className="space-y-2">
                <button
                  onClick={this.handleReset}
                  className="w-full px-4 py-2 rounded border border-terminal-green bg-terminal-green/10 text-terminal-green hover:bg-terminal-green hover:text-background transition-colors font-mono text-sm"
                  type="button"
                >
                  $ retry --force
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 rounded border border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan hover:bg-terminal-cyan hover:text-background transition-colors font-mono text-sm"
                  type="button"
                >
                  $ reboot --hard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
