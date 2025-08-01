"use client";

import { AppSidebar } from "@/components/core/app-sidebar";
import Header from "@/components/core/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { WidgetFilterData } from "@/components/features/filters";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  selectedPage: string;
  onChatToggle?: () => void;
  isChatOpen?: boolean;
  onFilterChange?: (data: WidgetFilterData) => void;
}

export function ProtectedLayout({
  children,
  selectedPage,
  onChatToggle = () => {},
  isChatOpen = false,
  onFilterChange,
}: ProtectedLayoutProps) {
  const { isLoading } = useAuth();

  // แสดง Loading state ขณะที่กำลังตรวจสอบ authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">กำลังโหลด...</p>
          <p className="text-gray-500 text-sm mt-1">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header
            selectedPage={selectedPage}
            onChatToggle={onChatToggle}
            isChatOpen={isChatOpen}
            onFilterChange={onFilterChange}
          />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
