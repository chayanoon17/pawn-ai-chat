import { RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartNewChatButtonProps {
  onStartNewChat: () => void;
  reason: "error" | "context-limit";
  className?: string;
}

export const StartNewChatButton = ({
  onStartNewChat,
  reason,
  className,
}: StartNewChatButtonProps) => {
  const getMessage = () => {
    switch (reason) {
      case "error":
        return {
          title: "เริ่มแชทใหม่",
          description: "เริ่มการสนทนาใหม่เพื่อประสบการณ์ที่ดีขึ้น",
          icon: RefreshCw,
        };
      case "context-limit":
        return {
          title: "เริ่มแชทใหม่",
          description: "การสนทนายาวแล้ว เริ่มใหม่เพื่อประสิทธิภาพที่ดีขึ้น",
          icon: MessageCircle,
        };
      default:
        return {
          title: "เริ่มแชทใหม่",
          description: "เริ่มการสนทนาใหม่",
          icon: RefreshCw,
        };
    }
  };

  const { title, description, icon: Icon } = getMessage();

  return (
    <div
      className={`flex flex-col items-center space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 ${className}`}
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      </div>

      <Button
        onClick={onStartNewChat}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
      >
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </Button>

      {reason === "context-limit" && (
        <p className="text-xs text-gray-500 text-center mt-2">
          💡 เริ่มแชทใหม่จะช่วยให้ AI ตอบได้เร็วและแม่นยำขึ้น
        </p>
      )}
    </div>
  );
};
