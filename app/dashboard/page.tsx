"use client";

import { useState, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ContractTransactionSummary } from "@/components/widgets/dashboard/contract-transaction-summary";
import { DailyOperationSummary } from "@/components/widgets/dashboard/daily-operation-summary";
import { GoldPriceCard } from "@/components/widgets/dashboard/gold-price";
import { WeeklyOperationSummary } from "@/components/widgets/dashboard/weekly-operation-summary";
import ContractTransactionDetails from "@/components/widgets/dashboard/contract-transaction-details";
import { AppSidebar } from "@/components/app-side-bar";
import Header from "@/components/header";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { WidgetFilterData } from "@/components/widget-filter";
import { ChatSidebar } from "@/components/chat-side-bar";
import { useIsMobile } from "@/hooks/use-mobile";
import { WidgetProvider } from "@/context/widget-context";

export default function DashboardPage() {
  const isMobile = useIsMobile();

  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message } = useProtectedRoute();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage] = useState("pawn-tickets");

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

  // 🎯 Handle เมื่อ filter เปลี่ยน - use useCallback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((data: WidgetFilterData) => {
    setFilterData(data);

    // Log การเปลี่ยนแปลง
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🎯 Dashboard filter changed:", data);
    }
  }, []);

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
    <WidgetProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {/* Sidebar ฝั่งซ้าย fixed width */}
          <div className="w-64 border-r bg-white">
            <AppSidebar />
          </div>

          {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
          {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
          <div className="relative flex-1 flex flex-col">
            <Header
              selectedPage={currentPage}
              onChatToggle={onChatToggle}
              onMenuToggle={onMenuToggle}
              isChatOpen={isChatOpen}
              onFilterChange={handleFilterChange}
            />
            <main className="flex-1 p-4 overflow-auto bg-gray-50">
              <GoldPriceCard />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <DailyOperationSummary
                  branchId={filterData.branchId}
                  date={filterData.date}
                  isLoading={filterData.isLoading}
                />
                <ContractTransactionSummary
                  branchId={filterData.branchId}
                  date={filterData.date}
                  isLoading={filterData.isLoading}
                />
              </div>

              <WeeklyOperationSummary
                branchId={filterData.branchId}
                date={filterData.date}
                isLoading={filterData.isLoading}
              />

              <ContractTransactionDetails
                branchId={filterData.branchId}
                date={filterData.date}
                isLoading={filterData.isLoading}
              />
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
      </SidebarProvider>
    </WidgetProvider>
  );
}
