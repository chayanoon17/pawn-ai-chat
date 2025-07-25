// 🎯 Base Layout Component สำหรับลดโค้ดซ้ำซ้อน
"use client";

import { useState, useCallback, ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/core";
import Header from "@/components/core/header";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSidebar } from "@/components/core";
import { WidgetFilterData } from "@/components/features/filters";
import { WidgetProvider } from "@/context/widget-context";

interface BasePageLayoutProps {
  children: ReactNode | ((filterData: WidgetFilterData) => ReactNode);
  page: string;
  pageTitle?: string;
  showFilter?: boolean;
  onFilterChange?: (data: WidgetFilterData) => void;
}

export default function BasePageLayout({
  children,
  page,
  pageTitle,
  showFilter = true,
  onFilterChange,
}: BasePageLayoutProps) {
  const isMobile = useIsMobile();

  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message } = useProtectedRoute();

  const [isChatOpen, setIsChatOpen] = useState(false);

  // 🎯 Default filter state
  const [filterData, setFilterData] = useState<WidgetFilterData>({
    branchId: "",
    date: new Date().toISOString().split("T")[0],
    isLoading: true,
  });

  const onChatToggle = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const onMenuToggle = useCallback(() => {
    console.log("Menu toggled");
  }, []);

  // 🎯 Handle filter changes
  const handleFilterChange = useCallback(
    (data: WidgetFilterData) => {
      setFilterData(data);
      onFilterChange?.(data);

      // Log การเปลี่ยนแปลง
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.log(`🎯 ${page} filter changed:`, data);
      }
    },
    [page, onFilterChange]
  );

  // 🔐 Guard - ถ้าไม่ควร render ให้แสดง loading/redirect message
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <WidgetProvider>
        <div className="flex h-screen w-full">
          {/* Sidebar ฝั่งซ้าย fixed width */}
          <div className="w-64 border-r bg-white">
            <AppSidebar />
          </div>

          {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
          <div className="relative flex-1 flex flex-col">
            <Header
              selectedPage={page}
              onChatToggle={onChatToggle}
              onMenuToggle={onMenuToggle}
              isChatOpen={isChatOpen}
              onFilterChange={showFilter ? handleFilterChange : undefined}
            />
            <main className="flex-1 p-4 overflow-auto bg-gray-50">
              <div className="flex-1 overflow-y-auto">
                <div className="flex-1 overflow-y-auto">
                  {/* ส่งค่า filterData ไปให้ children */}
                  {typeof children === "function"
                    ? children(filterData)
                    : children}
                </div>
              </div>
            </main>

            {/* Chat Sidebar */}
            {!isMobile && isChatOpen && (
              <ChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                className={`fixed top-0 right-0 bottom-0 w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                  isChatOpen ? "translate-x-0" : "translate-x-full"
                }`}
              />
            )}
          </div>
        </div>
      </WidgetProvider>
    </SidebarProvider>
  );
}
