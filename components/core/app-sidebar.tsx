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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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
  };

  const menuItems = [
    {
      id: "/dashboard",
      label: "ข้อมูลตั๋วรับจำนำ",
      icon: BarChart3,
      type: "single",
    },
    {
      id: "/asset-type",
      label: "ประเภททรัพย์และราคา",
      icon: FileText,
      type: "single",
    },
    {
      id: "management",
      label: "การจัดการระบบ",
      icon: Settings,
      type: "group",
      children: [
        { id: "/user", label: "จัดการผู้ใช้", icon: Users },
        { id: "/role", label: "จัดการตำแหน่ง", icon: UserCog },
      ],
    },
    { id: "/log", label: "ประวัติการใช้งาน", icon: Logs, type: "single" },
  ];

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
            {menuItems.map((item) => {
              // --- โค้ดสำหรับเมนูแบบเดี่ยว (Single Item) ---
              if (item.type === "single") {
                const isActive = pathname === item.id;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <Link href={item.id}>
                      <SidebarMenuButton
                        className={`w-full justify-start space-x-4 px-4 py-5 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
                          isActive
                            ? "text-white hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        style={isActive ? { backgroundColor: "#3F99D8" } : {}}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
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
                    <div>
                      <button
                        onClick={() => toggleGroup(item.id)}
                        className={`w-full justify-start space-x-4 px-4 py-5 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
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
                                <SidebarMenuButton
                                  className={`w-full justify-start space-x-3 px-3 py-5 rounded-lg transition-all duration-200 flex items-center text-sm font-medium ${
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
                                </SidebarMenuButton>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                );
              }

              return null;
            })}
          </div>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="p-3">
          {user && (
            <div className="flex items-center p-2.5 space-x-3 bg-white rounded-lg border border-gray-200 shadow-sm">
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
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                ) : (
                  <LogOut className="w-4 h-4 text-gray-500 transition-colors duration-200" />
                )}
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
