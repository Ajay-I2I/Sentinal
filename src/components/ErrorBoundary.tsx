"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and display errors gracefully
 * Prevents entire app crash, provides user-friendly error message
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging (in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Something went wrong
              </h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Please try again.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 max-h-40 overflow-auto">
                <p className="text-xs font-mono text-red-800 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition"
            >
              <RotateCcw size={18} />
              Try Again
            </button>

            {/* Contact Support */}
            <p className="text-center text-sm text-gray-500">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
