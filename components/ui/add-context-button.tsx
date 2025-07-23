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
  BarChart3,
  PieChart,
  Table,
  TrendingUp,
} from "lucide-react";
import { useWidgetContext, WidgetData } from "@/context/widget-context";
import { usePathname } from "next/navigation";

interface AddContextButtonProps {
  onContextAdded: (widget: WidgetData) => void;
  className?: string;
}

// 🎨 Widget Icons Mapping
const getWidgetIcon = (id: string) => {
  switch (id) {
    case "weekly-operation-summary":
      return <BarChart3 className="w-4 h-4" />;
    case "daily-operation-summary":
      return <TrendingUp className="w-4 h-4" />;
    case "contract-transaction-summary":
      return <PieChart className="w-4 h-4" />;
    case "contract-transaction-details":
      return <Table className="w-4 h-4" />;
    case "gold-price":
      return <FileText className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export const AddContextButton = ({
  onContextAdded,
  className,
}: AddContextButtonProps) => {
  const { getWidgetsByRoute } = useWidgetContext();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const widgets = getWidgetsByRoute(pathname);

  const handleWidgetSelect = (widget: WidgetData) => {
    onContextAdded(widget);
    setIsOpen(false);
  };

  if (widgets.length === 0) {
    return null; // ไม่แสดงปุ่มถ้าไม่มี widget
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <Plus className="w-4 h-4" />
          Add Context
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
          เลือก Widget เพื่อเพิ่มเป็น Context
        </div>
        {widgets.map((widget, index) => (
          <React.Fragment key={widget.id}>
            <DropdownMenuItem
              onClick={() => handleWidgetSelect(widget)}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
            >
              <div className="mt-0.5">{getWidgetIcon(widget.id)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {widget.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {widget.description}
                </div>
                <div className="text-xs text-blue-600 mt-1">
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
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
