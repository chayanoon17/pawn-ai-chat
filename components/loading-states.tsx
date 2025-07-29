/**
 * Standardized Loading Components
 * รวม loading states ที่ใช้ทั่วทั้งแอพ
 */

"use client";

import { Loader2, BarChart3, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ===== BASE LOADING COMPONENTS =====

/**
 * 🔄 Spinner Component
 */
interface SpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Spinner({ size = "default", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={cn("animate-spin text-blue-600", sizeClasses[size], className)}
    />
  );
}

/**
 * 📄 Page Loading
 */
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = "กำลังโหลด...",
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] items-center justify-center",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <Spinner size="lg" />
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
}

/**
 * 🃏 Card Loading
 */
interface CardLoadingProps {
  title?: string;
  className?: string;
  rows?: number;
}

export function CardLoading({
  title = "กำลังโหลดข้อมูล...",
  className,
  rows = 3,
}: CardLoadingProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span className="text-sm text-gray-600">{title}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 📊 Widget Loading
 */
interface WidgetLoadingProps {
  title?: string;
  type?: "chart" | "table" | "stats" | "list";
  className?: string;
}

export function WidgetLoading({
  title = "กำลังโหลด...",
  type = "chart",
  className,
}: WidgetLoadingProps) {
  const renderContent = () => {
    switch (type) {
      case "chart":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-[200px] bg-gray-50 rounded">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
        );

      case "table":
        return (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
              </div>
            ))}
          </div>
        );

      case "stats":
        return (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <Skeleton className="h-32 w-full" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

/**
 * 📱 Inline Loading
 */
interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "default";
  className?: string;
}

export function InlineLoading({
  message = "กำลังโหลด...",
  size = "default",
  className,
}: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Spinner size={size} />
      <span
        className={cn("text-gray-600", size === "sm" ? "text-sm" : "text-base")}
      >
        {message}
      </span>
    </div>
  );
}

/**
 * 📊 Table Loading
 */
interface TableLoadingProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableLoading({
  rows = 5,
  columns = 4,
  className,
}: TableLoadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-full" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ===== SPECIALIZED LOADING STATES =====

/**
 * 🌐 Connection Loading
 */
interface ConnectionLoadingProps {
  isConnected?: boolean;
  message?: string;
  className?: string;
}

export function ConnectionLoading({
  isConnected = true,
  message,
  className,
}: ConnectionLoadingProps) {
  const defaultMessage = isConnected ? "กำลังเชื่อมต่อ..." : "ขาดการเชื่อมต่อ";

  return (
    <div
      className={cn(
        "flex items-center justify-center p-6 rounded-lg border",
        isConnected ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {isConnected ? (
          <Wifi className="h-6 w-6 text-blue-600" />
        ) : (
          <WifiOff className="h-6 w-6 text-red-600" />
        )}
        <span
          className={cn(
            "font-medium",
            isConnected ? "text-blue-900" : "text-red-900"
          )}
        >
          {message || defaultMessage}
        </span>
        {isConnected && <Spinner size="sm" />}
      </div>
    </div>
  );
}

/**
 * 📈 Chart Loading
 */
export function ChartLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200",
        className
      )}
    >
      <div className="text-center space-y-3">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto" />
        <div className="space-y-1">
          <p className="text-gray-600 font-medium">กำลังโหลดกราฟ</p>
          <Spinner size="sm" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}

// ===== LOADING STATE UTILITIES =====

/**
 * 🎯 Loading State Manager
 */
export const LoadingStates = {
  Page: PageLoading,
  Card: CardLoading,
  Widget: WidgetLoading,
  Inline: InlineLoading,
  Table: TableLoading,
  Chart: ChartLoading,
  Connection: ConnectionLoading,
  Spinner,
} as const;

/**
 * 🎨 Loading Variants
 */
export const LoadingVariants = {
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  muted: "text-gray-400",
} as const;
