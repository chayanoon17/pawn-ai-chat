import { MessageCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { WidgetFilter, WidgetFilterData } from "@/components/widget-filter";
import { usePathname } from "next/navigation";

interface HeaderProps {
  selectedPage: string;
  onChatToggle: () => void;
  onMenuToggle: () => void;
  isChatOpen: boolean;
  onFilterChange?: (data: WidgetFilterData) => void;
}

const pageLabels: Record<string, string> = {
  dashboard: "Dashboard Overview",
  "pawn-tickets": "Pawn Ticket Info",
  "asset-types": "Asset Types and Prices",
  "user-management": "User Management",
  settings: "Settings",
};

export default function Header({
  selectedPage,
  onChatToggle,
  onMenuToggle,
  isChatOpen,
  onFilterChange,
}: HeaderProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // 🎯 Check if current page should show filters and chat
  const shouldShowWidgetFilter =
    pathname === "/dashboard" || pathname === "/asset-type";
  const shouldShowAIChat =
    pathname === "/dashboard" || pathname === "/asset-type";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {pageLabels[selectedPage] || "ข้อมูลตั๋วรับจำนำ"}
            </h1>
            <p className="text-sm text-gray-500">
              วันที่{" "}
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Widget Filter - แสดงเฉพาะหน้า dashboard และ asset-type */}
          {shouldShowWidgetFilter && (
            <WidgetFilter onFilterChange={onFilterChange} />
          )}

          {/* AI Chat - แสดงเฉพาะหน้า dashboard และ asset-type */}
          {shouldShowAIChat && (
            <Button
              onClick={onChatToggle}
              variant={isChatOpen ? "default" : "outline"}
              size="sm"
              className="flex items-center space-x-2"
            >
              {isChatOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isChatOpen ? "ปิด Chat" : "AI Chat"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
