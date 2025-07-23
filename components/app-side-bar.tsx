"use client";

import { BarChart3, FileText, Users, Logs, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    { id: "/dashboard", label: "ข้อมูลตั๋วรับจำนำ", icon: BarChart3 },
    { id: "/asset-type", label: "ประเภททรัพย์และราคา", icon: FileText },
    { id: "/user", label: "จัดการข้อมูลผู้ใช้", icon: Users },
    { id: "/log", label: "จัดการ Log", icon: Logs },
  ];

  return (
    <Sidebar className="border-r bg-white w-64">
      {/* Header */}
      <SidebarHeader className="border-b p-4 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            src="/logo.png"
            alt="Pawn AI"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Pawn AI</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-md font-medium mb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ id, label, icon: Icon }) => {
                const isActive = pathname === id;
                return (
                  <SidebarMenuItem key={id}>
                    <Link href={id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`w-full justify-start space-x-3 px-3 py-2 rounded-lg transition-colors flex items-center text-sm font-medium ${isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="p-3 border-t border-gray-100">
              {/* User Info - Clean Layout */}
              {user && (
                <div className="mb-3 flex items-center space-x-3">
                  {/* Avatar with gradient background */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-semibold text-white">
                        {user.fullName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          "U"}
                      </span>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.fullName || "ผู้ใช้งาน"}
                    </p>
                    <p className="text-xs text-gray-600 truncate font-medium">
                      {user.email}
                    </p>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      {user.role.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Button - Modern Design */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full group relative overflow-hidden bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-700 hover:text-black font-medium py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <div className="relative flex items-center justify-center space-x-2">
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                      <span className="text-sm">กำลังออกจากระบบ...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 group-hover:text-blue-600 transition-colors duration-200" />
                      <span className="text-sm">ออกจากระบบ</span>
                    </>
                  )}
                </div>
              </button>

            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
