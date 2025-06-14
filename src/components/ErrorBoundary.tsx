import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            color: "#003545",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1>Oops! Something went wrong.</h1>
          <p>Please try refreshing the page or contact Almosafer support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
