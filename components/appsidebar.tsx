// import { cn } from "@/lib/utils";
import {
  BarChart3,
  Home,
  FileText,
  DollarSign,
  Users,
  Settings,
  Logs,
} from "lucide-react";
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

import Link from "next/link";
import { usePathname } from "next/navigation"; 


interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}


export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: "/home", label: "ข้อมูลตั๋วรับจำนำ", icon: Home },
    { id: "/ประเภททรัพย์และราคา", label: "ประเภททรัพย์และราคา", icon: FileText },
    { id: "/user", label: "จัดการข้อมูลผู้ใช้", icon: Users },
    { id: "/Log", label: "จัดการ Log", icon: Logs },
  ];

  return (
    <Sidebar className="border-r bg-white w-64">
      {/* Header */}
      <SidebarHeader className="border-b p-4 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <img src="/logo.png" alt="Pawn AI" className="w-full h-full object-cover" />
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
                    <Link href={id} passHref legacyBehavior>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`w-full justify-start space-x-3 px-3 py-2 rounded-lg transition-colors flex items-center text-sm font-medium ${
                          isActive
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
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ผู้ใช้งาน</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
