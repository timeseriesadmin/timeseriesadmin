import React, { ReactNode } from 'react';

type State = {
  hasError: boolean;
  error?: Error;
  componentStack: string;
};

export class ErrorBoundary extends React.Component<{}, State> {
  state = { hasError: false, error: null, componentStack: '' };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, componentStack: '' };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    this.setState({ componentStack: errorInfo.componentStack });
  }

  render(): ReactNode {
    const { error, hasError, componentStack } = this.state;

    if (hasError) {
      let errorJson = '';
      try {
        errorJson = JSON.stringify(error);
      } catch (stringifyError) {
        errorJson = stringifyError;
      }

      return (
        <div>
          <h1>Error: {error.toString()}</h1>
          <hr />
          <strong>Component stack:</strong>
          <pre>{componentStack}</pre>
          <hr />
          <strong>Stack trace:</strong>
          <pre>{error.stack}</pre>
          <hr />
          <strong>Error JSON:</strong>
          <pre>
            {errorJson
              ? errorJson
              : 'We were unable to stringify error, here is the message ' +
                errorJson}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
