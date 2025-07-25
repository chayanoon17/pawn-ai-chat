// 🎯 Reusable Chart Legend Component
import { cn } from "@/lib/utils";

interface LegendItem {
  name: string;
  color: string;
  value?: number | string;
}

interface ChartLegendProps {
  items: LegendItem[];
  className?: string;
  showValues?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function ChartLegend({
  items,
  className,
  showValues = false,
  orientation = "horizontal",
}: ChartLegendProps) {
  return (
    <div
      className={cn(
        "flex gap-4 justify-center mt-4",
        orientation === "vertical" ? "flex-col" : "flex-wrap",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.name} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-700 font-medium">
            {item.name}
            {showValues && item.value && (
              <span className="text-gray-500 ml-1">({item.value})</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
