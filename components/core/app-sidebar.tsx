"use client";

import {
  BarChart3,
  FileText,
  Users,
  Logs,
  LogOut,
  Settings,
  UserCog,
  ChevronDown,
  ChevronRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { MenuPermission } from "@/lib/permissions";
import { showConfirmation } from "@/lib/sweetalert";
import { InlineLoading } from "@/components/ui/loading";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasMenuPermission } = useMenuPermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "management",
  ]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleLogout = async () => {
    const result = await showConfirmation(
      "ยืนยันการออกจากระบบ?",
      "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      "ออกจากระบบ",
      "ยกเลิก"
    );

    if (result.isConfirmed) {
      setIsLoggingOut(true);
      try {
        await logout();
        // ระบบจะ redirect ไป login อัตโนมัติผ่าน useProtectedRoute
      } catch (error) {
        console.error("Logout failed:", error);
        // แม้ logout API fail ระบบก็จะ clear state และ redirect อยู่แล้ว
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const menuItems = [
    {
      id: "/dashboard",
      label: "ข้อมูลตั๋วรับจำนำ",
      icon: BarChart3,
      type: "single",
      permission: "Dashboard",
    },
    {
      id: "/asset-types",
      label: "ประเภททรัพย์และราคา",
      icon: FileText,
      type: "single",
      permission: "Asset Types",
    },
    {
      id: "management",
      label: "การจัดการระบบ",
      icon: Settings,
      type: "group",
      children: [
        {
          id: "/users",
          label: "จัดการผู้ใช้",
          icon: Users,
          permission: "Users Management",
        },
        {
          id: "/roles",
          label: "จัดการตำแหน่ง",
          icon: UserCog,
          permission: "Roles Management",
        },
      ],
    },
    {
      id: "/logs",
      label: "ประวัติการใช้งาน",
      icon: Logs,
      type: "single",
      permission: "Activity Logs",
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.type === "group") {
      // For groups, filter children and only show group if it has visible children
      const visibleChildren =
        item.children?.filter((child) =>
          hasMenuPermission(child.permission as MenuPermission)
        ) || [];

      if (visibleChildren.length === 0) return false;

      // Update the item with filtered children
      item.children = visibleChildren;
      return true;
    } else {
      // For single items, check permission
      return item.permission
        ? hasMenuPermission(item.permission as MenuPermission)
        : true;
    }
  });

  return (
    <Sidebar className="border-r bg-white w-64">
      {/* Header */}
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            <img
              src="/logo.png"
              alt="Pawn AI"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-l font-bold text-gray-900">
              สำนักงานธนานุเคราะห์
            </h2>
            <p className="text-xs text-gray-600 truncate font-medium">
              โรงรับจำนำรัฐบาล
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarMenu>
          <div className="px-4 py-2 space-y-2">
            {filteredMenuItems.length === 0 ? (
              // Empty State - ไม่มีเมนูที่สามารถเข้าถึงได้
              <div className="px-4 py-8 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      ไม่มีสิทธิ์เข้าถึง
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      คุณยังไม่ได้รับสิทธิ์ในการเข้าถึงเมนูใดๆ ในระบบ
                    </p>
                    <p className="text-xs text-gray-400">
                      กรุณาติดต่อผู้ดูแลระบบ
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              filteredMenuItems.map((item) => {
                // --- โค้ดสำหรับเมนูแบบเดี่ยว (Single Item) ---
                if (item.type === "single") {
                  const isActive = pathname === item.id;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <Link href={item.id}>
                        <button
                          className={`w-full justify-start space-x-4 px-4 py-3.5 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
                            isActive
                              ? "text-white hover:text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                          style={isActive ? { backgroundColor: "#308AC7" } : {}}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      </Link>
                    </SidebarMenuItem>
                  );
                }

                // --- โค้ดสำหรับเมนูแบบกลุ่ม (Group) ---
                if (item.type === "group") {
                  const isExpanded = expandedGroups.includes(item.id);
                  const Icon = item.icon;
                  const hasActiveChild = item.children?.some(
                    (child) => pathname === child.id
                  );

                  return (
                    <SidebarMenuItem key={item.id}>
                      <button
                        onClick={() => toggleGroup(item.id)}
                        className={`w-full justify-start space-x-4 px-4 py-3.5 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
                          hasActiveChild && !isExpanded
                            ? "font-semibold !text-[#3F99D8] !bg-gray-100"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {isExpanded && item.children && (
                        <div className="ml-5 mt-2 space-y-1 border-l border-gray-200 pl-4">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.id;
                            const ChildIcon = child.icon;
                            return (
                              <Link key={child.id} href={child.id}>
                                <button
                                  className={`w-full justify-start space-x-3 px-3 py-3.5 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
                                    isChildActive
                                      ? "text-white hover:text-white"
                                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                  }`}
                                  style={
                                    isChildActive
                                      ? { backgroundColor: "#3F99D8" }
                                      : {}
                                  }
                                >
                                  <ChildIcon className="h-4 w-4" />
                                  <span>{child.label}</span>
                                </button>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return null;
              })
            )}
          </div>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {user && (
          <div className="flex items-center p-2.5 space-x-3">
            {/* Avatar with gradient background */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-semibold text-white">
                  {user.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                </span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.fullName || "ผู้ใช้งาน"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role.name || "ตำแหน่งผู้ใช้"}
              </p>
            </div>

            {/* Logout Icon Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-shrink-0"
              aria-label="Logout"
            >
              {isLoggingOut ? (
                <InlineLoading
                  message="กำลังออกจากระบบ..."
                  size="sm"
                  showText
                />
              ) : (
                <LogOut className="w-4 h-4 text-gray-500 transition-colors duration-200" />
              )}
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
