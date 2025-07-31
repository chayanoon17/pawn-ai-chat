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
import { LoadingSpinner } from "@/components/ui/loading";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
}: BasePageLayoutProps) {
  const isMobile = useIsMobile();

  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message, isLoading: authLoading } = useProtectedRoute();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mt-6 space-y-2">
            <p className="text-lg font-medium text-gray-700">{message}</p>
            <p className="text-sm text-gray-500">กรุณารอสักครู่...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <WidgetProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
          {/* ✅ ใช้ AppSidebar แบบ built-in */}
          <AppSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header
              selectedPage={page}
              onChatToggle={onChatToggle}
              isChatOpen={isChatOpen}
              onFilterChange={showFilter ? handleFilterChange : undefined}
            />

            <main
              className="flex-1 p-6 lg:p-8 overflow-auto min-h-0"
              role="main"
              aria-label={`${pageTitle || page} content`}
            >
              <div className="w-full">
                {/* ส่งค่า filterData ไปให้ children */}
                {typeof children === "function"
                  ? children(filterData)
                  : children}
              </div>
            </main>

            {/* Chat Sidebar - Responsive */}
            {isMobile ? (
              // Mobile: ใช้ Sheet เหมือน AppSidebar
              <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                <SheetContent
                  side="right"
                  className="p-0 w-full max-w-sm [&>button]:hidden"
                >
                  <ChatSidebar
                    onClose={() => setIsChatOpen(false)}
                    className="w-full h-full border-0"
                  />
                </SheetContent>
              </Sheet>
            ) : (
              // Desktop: ใช้ fixed positioning
              <ChatSidebar
                onClose={() => setIsChatOpen(false)}
                className={`
                  fixed top-0 right-0 bottom-0 z-40
                  shadow-lg transform transition-transform duration-300 ease-in-out
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
