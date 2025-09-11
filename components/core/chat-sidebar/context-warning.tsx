import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContextWarningProps {
  className?: string;
}

export const ContextWarning = ({ className }: ContextWarningProps) => {
  return (
    <div className={`px-4 py-2 ${className}`}>
      <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <AlertDescription className="text-sm text-yellow-800">
          <span className="font-medium">แนะนำเริ่มแชทใหม่</span> -
          การสนทนายาวอาจทำให้ AI ตอบช้าลง หลังคำถามถัดไปจะแสดงปุ่มเริ่มแชทใหม่
        </AlertDescription>
      </Alert>
    </div>
  );
};
