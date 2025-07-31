import { Button } from "@/components/ui/button";
import { FileText, ChevronUp, ChevronDown, X } from "lucide-react";

export interface ActiveContext {
  widget: {
    id: string;
    name: string;
    description?: string;
    data?: Record<string, unknown>;
  };
  addedAt: Date;
}

interface ActiveContextSectionProps {
  activeContexts: ActiveContext[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onContextRemove: (widgetId: string) => void;
  getContextSummary: () => string | null;
}

export const ActiveContextSection = ({
  activeContexts,
  isExpanded,
  onToggleExpanded,
  onContextRemove,
  getContextSummary,
}: ActiveContextSectionProps) => {
  if (activeContexts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 shadow-sm">
      {/* Header with toggle button */}
      <div
        className="p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
        onClick={onToggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-800">
                Active Context
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                  {activeContexts.length} widget
                  {activeContexts.length > 1 ? "s" : ""}
                </span>
                {getContextSummary() && (
                  <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {getContextSummary()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Icon */}
          <div className="p-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-blue-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {activeContexts.map((ctx) => (
            <div
              key={ctx.widget.id}
              className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <FileText className="w-3 h-3 text-blue-600 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate block">
                    {ctx.widget.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    เพิ่มเมื่อ{" "}
                    {ctx.addedAt.toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onContextRemove(ctx.widget.id)}
                className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
