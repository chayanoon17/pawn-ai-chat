import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingScreen = ({
  message = "กำลังโหลด...",
  size = "md",
  className = "",
}: LoadingScreenProps) => {
  const sizeConfig = {
    sm: { spinner: "h-4 w-4", text: "text-sm" },
    md: { spinner: "h-6 w-6", text: "text-base" },
    lg: { spinner: "h-8 w-8", text: "text-lg" },
  };

  const { spinner, text } = sizeConfig[size];

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <Loader2 className={`${spinner} animate-spin text-blue-600`} />
        <p className={`text-gray-600 font-medium ${text}`}>{message}</p>
      </div>
    </div>
  );
};
