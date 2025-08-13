"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FileText,
  FileBarChart,
  Coins,
  BarChart3,
  PieChart,
  PieChartIcon,
  TableIcon,
  TrendingUp,
  Trophy,
  CheckSquare,
} from "lucide-react";
import { useWidgetContext, WidgetData } from "@/context/widget-context";
import { usePathname } from "next/navigation";

interface AddContextButtonProps {
  onContextAdded: (widget: WidgetData) => void;
  activeContexts?: { widget: { id: string; name: string } }[]; // Added to track active contexts
  className?: string;
}

// 🎨 Widget Icons Mapping
const getWidgetIcon = (id: string) => {
  switch (id) {
    // Dashboard widgets
    case "weekly-operation-summary":
      return <FileBarChart className="w-4 h-4" />;
    case "daily-operation-summary":
      return <BarChart3 className="w-4 h-4" />;
    case "contract-transaction-type-summary":
      return <PieChart className="w-4 h-4" />;
    case "contract-status-summary":
      return <PieChart className="w-4 h-4" />;
    case "contract-transaction-details":
      return <TableIcon className="w-4 h-4" />;
    case "gold-price":
      return <Coins className="w-4 h-4" />;
    // Asset-type widgets
    case "asset-type-summary":
      return <PieChartIcon className="w-4 h-4" />;
    case "top-ranking-asset-type":
      return <Trophy className="w-4 h-4" />;
    case "ranking-by-period-asset-type":
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export const AddContextButton = ({
  onContextAdded,
  activeContexts = [],
  className,
}: AddContextButtonProps) => {
  const { getWidgetsByRoute } = useWidgetContext();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const widgets = getWidgetsByRoute(pathname);

  // Helper function to check if widget is already in active contexts
  const isWidgetActive = (widgetId: string) => {
    return activeContexts.some((ctx) => ctx.widget.id === widgetId);
  };

  const handleWidgetSelect = (widget: WidgetData) => {
    // Prevent adding if widget is already active
    if (isWidgetActive(widget.id)) {
      return;
    }

    onContextAdded(widget);
    setIsOpen(false);
  };

  const handleSelectAll = () => {
    // เลือกเฉพาะ widget ที่ยังไม่ได้เลือก
    const availableWidgets = widgets.filter(
      (widget) => !isWidgetActive(widget.id)
    );

    if (availableWidgets.length === 0) {
      return; // ไม่มี widget ที่เลือกได้
    }

    // เพิ่ม widget ทั้งหมดที่ยังไม่ได้เลือก
    availableWidgets.forEach((widget) => {
      onContextAdded(widget);
    });

    setIsOpen(false);
  };

  // นับจำนวน widget ที่ยังเลือกได้
  const availableWidgetsCount = widgets.filter(
    (widget) => !isWidgetActive(widget.id)
  ).length;

  if (widgets.length === 0) {
    return null; // ไม่แสดงปุ่มถ้าไม่มี widget
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <Plus className="w-4 h-4" />
          เพิ่มบริบท
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {/* Header Section */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              เลือกบริบท
            </span>
            {availableWidgetsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <CheckSquare className="w-3 h-3 mr-1" />
                เลือกทั้งหมด ({availableWidgetsCount})
              </Button>
            )}
          </div>
          {availableWidgetsCount === 0 && (
            <p className="text-xs text-gray-500 mt-1">เลือกทั้งหมดแล้ว</p>
          )}
        </div>
        {widgets.map((widget, index) => {
          const isActive = isWidgetActive(widget.id);

          return (
            <React.Fragment key={widget.id}>
              <DropdownMenuItem
                onClick={() => handleWidgetSelect(widget)}
                disabled={isActive}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  isActive
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="mt-0.5">{getWidgetIcon(widget.id)}</div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm truncate ${
                      isActive ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {widget.name} {isActive && "(เพิ่มแล้ว)"}
                  </div>
                  <div
                    className={`text-xs mt-1 line-clamp-2 ${
                      isActive ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {widget.description}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isActive ? "text-gray-300" : "text-blue-600"
                    }`}
                  >
                    อัพเดท:{" "}
                    {new Intl.DateTimeFormat("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(widget.timestamp))}
                  </div>
                </div>
              </DropdownMenuItem>
              {index < widgets.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
