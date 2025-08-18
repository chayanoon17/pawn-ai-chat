import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { WidgetFilter, WidgetFilterData } from "@/components/features/filters";
import { NotificationDropdown } from "@/components/features/notifications";
import { usePathname } from "next/navigation";
import { PAGE_LABELS } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

// 📝 Component Props Interface
interface HeaderProps {
  selectedPage: string;
  onChatToggle: () => void;
  isChatOpen: boolean;
  onFilterChange?: (data: WidgetFilterData) => void;
}

/**
 * Header Component
 *
 * แสดง header bar พร้อมฟีเจอร์:
 * - แสดงชื่อหน้าปัจจุบัน
 * - ปุ่มเปิด/ปิด chat sidebar
 * - ปุ่ม sidebar trigger สำหรับ mobile
 * - Widget filter (สำหรับหน้าที่มี widgets)
 *
 * @param selectedPage - ชื่อหน้าปัจจุบัน
 * @param onChatToggle - Function สำหรับเปิด/ปิด chat sidebar
 * @param isChatOpen - สถานะการเปิด/ปิดของ chat sidebar
 * @param onFilterChange - Function สำหรับจัดการการเปลี่ยนแปลง widget filter
 */
export default function Header({
  selectedPage,
  onChatToggle,
  onFilterChange,
}: HeaderProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { hasMenuPermission } = useMenuPermissions();
  const { user } = useAuth();

  // 🎯 Check if current page should show filters and chat
  const shouldShowWidgetFilter =
    pathname === "/dashboard" || pathname === "/asset-types";
  const shouldShowAIChat =
    pathname === "/dashboard" || pathname === "/asset-types";

  // 🔔 Check if user has permission to see notifications (Super Admin or Admin only)
  const canViewNotifications =
    user && (user.role.name === "Super Admin" || user.role.name === "Admin");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <SidebarTrigger className="p-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
          )}

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {PAGE_LABELS[selectedPage] || "ข้อมูลตั๋วรับจำนำ"}
            </h1>
            <p className="text-sm text-gray-500">
              {"อัปเดตล่าสุดเมื่อ "}
              {new Date().toLocaleString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notification - แสดงเฉพาะ Super Admin และ Admin */}
          {canViewNotifications && <NotificationDropdown />}

          {/* Widget Filter - แสดงเฉพาะหน้า dashboard และ asset-type */}
          {shouldShowWidgetFilter && (
            <WidgetFilter onFilterChange={onFilterChange} />
          )}

          {/* Pawn AI - แสดงเฉพาะหน้า dashboard และ asset-type */}
          {hasMenuPermission("AI Chat") && shouldShowAIChat && (
            <Button
              onClick={onChatToggle}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">{"Pawn AI"}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
