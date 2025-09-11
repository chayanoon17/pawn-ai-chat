import { AlertTriangle, Clock, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ContextWarningProps {
  level: "info" | "warning" | "critical";
  messageCount: number;
  className?: string;
  onStartNewChat?: () => void;
}

export const ContextWarning = ({
  level,
  messageCount,
  className,
  onStartNewChat,
}: ContextWarningProps) => {
  const getWarningConfig = (): {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
    title: string;
    message: string;
  } => {
    switch (level) {
      case "info":
        return {
          icon: MessageCircle,
          bgColor: "bg-gradient-to-r from-blue-50 to-sky-50",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600",
          textColor: "text-blue-800",
          title: "การสนทนาเริ่มยาวขึ้น",
          message:
            "AI อาจใช้เวลาตอบนานขึ้นเล็กน้อย แต่ยังสามารถสนทนาต่อได้ปกติ",
        };
      case "warning":
        return {
          icon: Clock,
          bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
          borderColor: "border-yellow-200",
          iconColor: "text-yellow-600",
          textColor: "text-yellow-800",
          title: "แนะนำเริ่มหัวข้อใหม่",
          message:
            "การสนทนายาวอาจทำให้ AI ประมวลผลช้าลง เพื่อประสิทธิภาพที่ดีขึ้น",
        };
      case "critical":
        return {
          icon: AlertTriangle,
          bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
          textColor: "text-red-800",
          title: "ขอแนะนำเริ่มแชทใหม่",
          message: "การสนทนายาวมากจะทำให้ AI ตอบช้าและอาจไม่เข้าใจบริบทได้ดี",
        };
      default:
        return {
          icon: MessageCircle,
          bgColor: "bg-gradient-to-r from-blue-50 to-sky-50",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600",
          textColor: "text-blue-800",
          title: "การสนทนาเริ่มยาวขึ้น",
          message:
            "AI อาจใช้เวลาตอบนานขึ้นเล็กน้อย แต่ยังสามารถสนทนาต่อได้ปกติ",
        };
    }
  };

  const config = getWarningConfig();
  const IconComponent = config.icon;

  return (
    <div className={`px-4 py-2 ${className}`}>
      <Alert className={`${config.bgColor} ${config.borderColor}`}>
        <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
        <AlertDescription className={`text-sm ${config.textColor}`}>
          <span className="font-medium">{config.title}</span>
          <span className="text-xs opacity-75 ml-1">
            ({messageCount} ข้อความ)
          </span>
          <br />
          <span className="text-xs">{config.message}</span>

          {/* 🟡 ปุ่มเริ่มแชทใหม่สำหรับ Warning Level */}
          {level === "warning" && onStartNewChat && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onStartNewChat}
                className={`text-xs ${config.textColor} border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400`}
              >
                เริ่มแชทใหม่
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
