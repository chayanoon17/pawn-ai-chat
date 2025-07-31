import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ChatErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ChatErrorBoundaryProps {
  children: React.ReactNode;
}

export class ChatErrorBoundary extends React.Component<
  ChatErrorBoundaryProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    console.error("🚨 Chat Error Boundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Chat Error Boundary details:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-148 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Chat Error</h3>
                <p className="text-xs text-red-700">เกิดข้อผิดพลาดในระบบแชท</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ระบบแชทขัดข้อง
              </h4>

              <p className="text-sm text-gray-600 mb-4">
                เกิดข้อผิดพลาดในการแสดงผลระบบแชท โปรดลองใหม่อีกครั้ง
              </p>

              {this.state.error && (
                <div className="bg-gray-100 p-3 rounded-lg mb-4 text-left">
                  <p className="text-xs text-gray-700 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <Button
                onClick={this.handleReset}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                รีเซ็ตแชท
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
