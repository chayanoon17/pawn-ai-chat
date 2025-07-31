import { Bot } from "lucide-react";

// 🤖 AI Thinking Animation Component - Enhanced
export const ThinkingAnimation = () => (
  <div className="flex items-center space-x-2">
    <div className="p-1 bg-blue-100 rounded-full">
      <Bot className="w-3 h-3 text-blue-600" />
    </div>
    <span className="text-xs font-medium text-blue-600">AI กำลังคิด</span>
    <div className="flex space-x-1">
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);
