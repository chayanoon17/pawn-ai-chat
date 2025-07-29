/**
 * 🎨 Standardized Loading Components
 * Import จาก ui/loading.tsx แทน
 * @deprecated ใช้ @/components/ui/loading แทน
 */

import {
  Loading,
  LoadingSpinner,
  PageLoading,
  CardLoading,
  WidgetLoading,
  InlineLoading,
  ButtonLoading,
  TableLoading,
  ChartLoading,
  ConnectionLoading,
} from "@/components/ui/loading";

export {
  Loading,
  LoadingSpinner,
  PageLoading,
  CardLoading,
  WidgetLoading,
  InlineLoading,
  ButtonLoading,
  TableLoading,
  ChartLoading,
  ConnectionLoading,
};

// Legacy compatibility
export const LoadingStates = {
  Page: PageLoading,
  Card: CardLoading,
  Widget: WidgetLoading,
  Inline: InlineLoading,
  Table: TableLoading,
  Chart: ChartLoading,
  Connection: ConnectionLoading,
  Spinner: LoadingSpinner,
} as const;

export const LoadingVariants = {
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  muted: "text-gray-400",
} as const;
