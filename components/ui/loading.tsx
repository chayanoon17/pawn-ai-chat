/**
 * 🎨 Standardized Loading Components
 * มาตรฐานเดียวกันสำหรับ Loading States ทั้งแอพ
 */

"use client";

import { Loader2, BarChart3, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ===== DESIGN SYSTEM CONSTANTS =====

const LOADING_THEME = {
  colors: {
    primary: "text-blue-600",
    background: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
  },
  animation: "animate-spin",
  duration: "duration-1000", // 1 second rotation
  sizes: {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  },
  typography: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  },
} as const;

// ===== BASE LOADING COMPONENTS =====

/**
 * 🔄 Standardized Spinner Component
 */
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "primary" | "muted";
}

export function LoadingSpinner({
  size = "md",
  className,
  variant = "primary",
}: LoadingSpinnerProps) {
  const colorClass =
    variant === "primary" ? LOADING_THEME.colors.primary : "text-gray-400";

  return (
    <Loader2
      className={cn(
        LOADING_THEME.animation,
        LOADING_THEME.sizes[size],
        colorClass,
        LOADING_THEME.duration,
        className
      )}
    />
  );
}

/**
 * 📄 Page Loading (สำหรับหน้าใหม่)
 */
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = "กำลังโหลดหน้า...",
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] items-center justify-center",
        LOADING_THEME.colors.background,
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg border border-blue-200 bg-white shadow-sm">
        <LoadingSpinner size="xl" />
        <p
          className={cn(
            LOADING_THEME.typography.lg,
            LOADING_THEME.colors.text,
            "font-medium"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * 🃏 Card Loading (สำหรับโหลดข้อมูลใน Card)
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
    <Card className={cn("border-blue-200", className)}>
      <CardHeader className={cn(LOADING_THEME.colors.background)}>
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="sm" />
          <span
            className={cn(
              LOADING_THEME.typography.sm,
              LOADING_THEME.colors.text,
              "font-medium"
            )}
          >
            {title}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full bg-blue-100 animate-pulse" />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 📊 Widget Loading (สำหรับ Widget Components)
 */
interface WidgetLoadingProps {
  title?: string;
  type?: "chart" | "table" | "stats" | "list";
  className?: string;
  message?: string;
}

export function WidgetLoading({
  title = "กำลังโหลด Widget...",
  type = "chart",
  className,
  message,
}: WidgetLoadingProps) {
  const renderContent = () => {
    switch (type) {
      case "chart":
        return (
          <div className="space-y-4">
            <div
              className={cn(
                "flex items-center justify-center h-[200px] rounded-lg border-2 border-dashed",
                LOADING_THEME.colors.background,
                LOADING_THEME.colors.border
              )}
            >
              <div className="text-center space-y-3">
                <BarChart3 className="h-16 w-16 text-blue-400 mx-auto" />
                <div className="space-y-2">
                  <p className={cn(LOADING_THEME.colors.text, "font-medium")}>
                    กำลังโหลดกราฟ
                  </p>
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/4 bg-blue-100" />
                <Skeleton className="h-4 w-1/3 bg-blue-100" />
                <Skeleton className="h-4 w-1/4 bg-blue-100" />
                <Skeleton className="h-4 w-1/6 bg-blue-100" />
              </div>
            ))}
          </div>
        );

      case "stats":
        return (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-full bg-blue-100" />
                <Skeleton className="h-4 w-3/4 bg-blue-100" />
              </div>
            ))}
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full bg-blue-100" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4 bg-blue-100" />
                  <Skeleton className="h-3 w-1/2 bg-blue-100" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <Skeleton className="h-32 w-full bg-blue-100" />;
    }
  };

  return (
    <Card className={cn("border-blue-200", className)}>
      <CardHeader className={cn(LOADING_THEME.colors.background)}>
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="sm" />
          <div className="flex-1">
            <span
              className={cn(
                LOADING_THEME.typography.sm,
                LOADING_THEME.colors.text,
                "font-medium"
              )}
            >
              {title}
            </span>
            {message && (
              <p
                className={cn(
                  LOADING_THEME.typography.sm,
                  "text-blue-600 mt-1"
                )}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

/**
 * 📱 Inline Loading (สำหรับใช้ใน Button หรือ Text)
 */
interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "md";
  className?: string;
  showText?: boolean;
}

export function InlineLoading({
  message = "กำลังโหลด...",
  size = "md",
  className,
  showText = true,
}: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LoadingSpinner size={size === "sm" ? "sm" : "md"} />
      {showText && (
        <span
          className={cn(
            LOADING_THEME.colors.text,
            size === "sm"
              ? LOADING_THEME.typography.sm
              : LOADING_THEME.typography.md
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
}

/**
 * 🔄 Button Loading (สำหรับ Loading ใน Button)
 */
interface ButtonLoadingProps {
  message?: string;
  size?: "sm" | "md";
  className?: string;
}

export function ButtonLoading({
  message = "กำลังดำเนินการ...",
  size = "md",
  className,
}: ButtonLoadingProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LoadingSpinner size={size === "sm" ? "sm" : "md"} variant="muted" />
      <span
        className={cn(
          "text-gray-600",
          size === "sm"
            ? LOADING_THEME.typography.sm
            : LOADING_THEME.typography.md
        )}
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
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div
        className="grid gap-4 p-2 bg-blue-50 rounded"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-full bg-blue-200" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4 p-2"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 w-full bg-blue-100"
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
        {isConnected && <LoadingSpinner size="sm" />}
      </div>
    </div>
  );
}

/**
 * 📈 Chart Loading (สำหรับ Charts)
 */
export function ChartLoading({
  className,
  message = "กำลังโหลดกราฟ...",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-[300px] rounded-lg border-2 border-dashed",
        LOADING_THEME.colors.background,
        LOADING_THEME.colors.border,
        className
      )}
    >
      <div className="text-center space-y-4">
        <BarChart3 className="h-16 w-16 text-blue-400 mx-auto" />
        <div className="space-y-2">
          <p className={cn(LOADING_THEME.colors.text, "font-medium")}>
            {message}
          </p>
          <LoadingSpinner size="md" />
        </div>
      </div>
    </div>
  );
}

// ===== LOADING STATE MANAGER =====

/**
 * 🎯 Standardized Loading Components Export
 */
export const Loading = {
  Spinner: LoadingSpinner,
  Page: PageLoading,
  Card: CardLoading,
  Widget: WidgetLoading,
  Inline: InlineLoading,
  Button: ButtonLoading,
  Table: TableLoading,
  Chart: ChartLoading,
  Connection: ConnectionLoading,
} as const;
