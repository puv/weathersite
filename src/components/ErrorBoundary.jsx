import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-base-200 p-4">
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                Something went wrong
                            </h2>
                            <p className="text-sm">
                                An unexpected error occurred. Please try refreshing the page.
                            </p>
                            {this.state.error && (
                                <details className="collapse collapse-arrow bg-base-200 mt-2">
                                    <summary className="collapse-title text-xs font-medium">
                                        Error Details
                                    </summary>
                                    <div className="collapse-content text-xs">
                                        <p className="font-mono break-words">
                                            {this.state.error.toString()}
                                        </p>
                                        {this.state.errorInfo && (
                                            <pre className="mt-2 text-xs overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        )}
                                    </div>
                                </details>
                            )}
                            <div className="card-actions justify-end mt-4">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={this.resetError}
                                >
                                    Try Again
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Page
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
