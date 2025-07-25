// 🎯 Base Layout Component สำหรับลดโค้ดซ้ำซ้อน
"use client";

import { useState, useCallback, ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/core";
import Header from "@/components/core/header";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSidebar } from "@/components/core";
import { WidgetFilterData } from "@/components/features/filters";
import { WidgetProvider } from "@/context/widget-context";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/ui/states";

interface BasePageLayoutProps {
  children: ReactNode | ((filterData: WidgetFilterData) => ReactNode);
  page: string;
  pageTitle?: string;
  showFilter?: boolean;
  onFilterChange?: (data: WidgetFilterData) => void;
  className?: string;
  // 🎯 New accessibility & mobile props
  ariaLabel?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function BasePageLayout({
  children,
  page,
  pageTitle,
  showFilter = true,
  onFilterChange,
  className = "",
  ariaLabel,
  showBackButton = false,
  onBack,
}: BasePageLayoutProps) {
  const isMobile = useIsMobile();

  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message, isLoading: authLoading } = useProtectedRoute();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  // 🎯 Default filter state
  const [filterData, setFilterData] = useState<WidgetFilterData>({
    branchId: "",
    date: new Date().toISOString().split("T")[0],
    isLoading: true,
  });

  // 🔄 Auto-collapse sidebar on mobile
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

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

  // 🔐 Guard - แสดง loading state with better UX
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
        <div className="ml-4">
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-400 mt-1">กรุณารอสักครู่...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <WidgetProvider>
        <div
          className={`flex h-screen w-full ${className}`}
          role="application"
          aria-label={ariaLabel || `${pageTitle || page} application`}
        >
          {/* Sidebar - Responsive */}
          <div
            className={`
              ${isMobile ? "fixed z-40 inset-y-0 left-0" : "relative"} 
              ${
                sidebarCollapsed && isMobile
                  ? "-translate-x-full"
                  : "translate-x-0"
              }
              w-64 border-r bg-white transition-transform duration-300 ease-in-out
            `}
            aria-hidden={sidebarCollapsed && isMobile}
          >
            <AppSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobile && !sidebarCollapsed && (
            <div
              className="fixed inset-0 z-30 bg-black/20"
              onClick={() => setSidebarCollapsed(true)}
              aria-hidden="true"
            />
          )}

          {/* Main Content */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            <Header
              selectedPage={page}
              onChatToggle={onChatToggle}
              onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              isChatOpen={isChatOpen}
              onFilterChange={showFilter ? handleFilterChange : undefined}
            />

            <main
              className="flex-1 p-4 overflow-auto bg-gray-50"
              role="main"
              aria-label={`${pageTitle || page} content`}
            >
              {/* ส่งค่า filterData ไปให้ children */}
              {typeof children === "function" ? children(filterData) : children}
            </main>

            {/* Chat Sidebar - Responsive */}
            {isChatOpen && (
              <ChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                className={`
                  ${
                    isMobile
                      ? "fixed inset-0 z-50"
                      : "fixed top-0 right-0 bottom-0 w-80"
                  }
                  bg-white shadow-lg transform transition-transform duration-300
                  ${isChatOpen ? "translate-x-0" : "translate-x-full"}
                `}
              />
            )}
          </div>
        </div>
      </WidgetProvider>
    </SidebarProvider>
  );
}
