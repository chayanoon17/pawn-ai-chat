"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-side-bar";
import Header from "@/components/header";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSidebar } from "@/components/chat-side-bar";
import { WidgetFilterData } from "@/components/widget-filter";
import { AssetTypesSummary } from "@/components/widgets/asset-type/asset-type-summary";
import { RankingByPeriodAssetType } from "@/components/widgets/asset-type/ranking-by-period-asset-type";
import { TopRankingAssetType } from "@/components/widgets/asset-type/top-ranking-asset-type";
import { WidgetProvider } from "@/context/widget-context";

export default function AssetTypePage() {
  const isMobile = useIsMobile();
  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message } = useProtectedRoute();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("asset-types");

  // 🎯 Filter state สำหรับส่งต่อไป widgets
  const [filterData, setFilterData] = useState<WidgetFilterData>({
    branchId: "",
    date: new Date().toISOString().split("T")[0],
    isLoading: true,
  });

  function onChatToggle() {
    setIsChatOpen((prev) => !prev);
  }

  function onMenuToggle() {
    console.log("Menu toggled");
  }

  const handleFilterChange = (data: WidgetFilterData) => {
    setFilterData(data);

    // Log การเปลี่ยนแปลง
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🎯 Dashboard filter changed:", data);
    }
  };

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
            {" "}
            {/* ✅ เพิ่ม relative */}
            <Header
              selectedPage={currentPage}
              onChatToggle={onChatToggle}
              onMenuToggle={onMenuToggle}
              isChatOpen={isChatOpen}
              onFilterChange={handleFilterChange}
            />
            <main className="flex-1 p-4 overflow-auto bg-gray-50">
              <div className="flex-1  overflow-y-auto">
                <div className="flex-1  overflow-y-auto">
                  <TopRankingAssetType
                    branchId={filterData.branchId}
                    date={filterData.date}
                  />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    <AssetTypesSummary
                      branchId={filterData.branchId}
                      date={filterData.date}
                      isLoading={filterData.isLoading}
                    />
                    <RankingByPeriodAssetType
                      branchId={filterData.branchId}
                      date={filterData.date}
                    />
                  </div>
                </div>
              </div>
            </main>
            {/*Chat Sidebar*/}
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
