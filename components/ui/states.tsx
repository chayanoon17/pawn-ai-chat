// 🎯 Reusable Loading Component
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  LoadingSpinnerProps,
  EmptyStateProps,
  ErrorStateProps,
} from "@/types";

export function LoadingSpinner({
  size = "md",
  text = "กำลังโหลด...",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center space-x-2">
        <Loader2
          className={cn("animate-spin text-blue-500", sizeClasses[size])}
        />
        {text && <span className="text-gray-600 text-lg">{text}</span>}
      </div>
    </div>
  );
}

// 🎯 Reusable Empty State Component
export function EmptyState({
  icon = "📊",
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-gray-500 py-12",
        className
      )}
    >
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

// 🎯 Reusable Error State Component
export function ErrorState({ title, description, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-red-50 border border-red-200 text-red-600 p-4 rounded-md",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <span className="text-red-500">⚠️</span>
        <div>
          {title && <span className="font-medium">{title}</span>}
          {description && <p className="text-sm mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );
}
