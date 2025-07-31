import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isThinking: boolean;
  hasContext: boolean;
}

export const ChatInput = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isThinking,
  hasContext,
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white shadow-lg">
      <div className="space-y-3">
        {/* Status Indicator */}
        {isThinking && (
          <div className="flex items-center justify-center space-x-2 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-blue-600 font-medium">
              AI กำลังคิด...
            </span>
          </div>
        )}

        {/* Input Field */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={
                isThinking ? "AI กำลังคิด..." : "พิมพ์คำถามของคุณ..."
              }
              className="pr-12 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm placeholder:text-gray-400 shadow-sm"
              disabled={isThinking}
            />
            {inputValue && !isThinking && (
              <button
                onClick={() => onInputChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => onSendMessage()}
            size="sm"
            disabled={isThinking || !inputValue.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>กด Enter เพื่อส่ง</span>
          <div className="flex items-center space-x-2">
            <span>{inputValue.length}/1000</span>
            {hasContext && (
              <span className="text-blue-600 font-medium">• มี Context</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
