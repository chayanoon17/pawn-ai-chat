"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-side-bar";
import Header from "@/components/header";
import { UserTable } from "@/components/usertable";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSidebar } from "@/components/chat-side-bar";

export default function UserPage() {
  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message } = useProtectedRoute();
  const isMobile = useIsMobile();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("user-management");

  function onChatToggle() {
    setIsChatOpen((prev) => !prev);
  }

  function onMenuToggle() {
    console.log("Menu toggled");
  }

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
      <div className="flex h-screen w-full">
        {/* Sidebar ฝั่งซ้าย fixed width */}
        <div className="w-64 border-r bg-white">
          <AppSidebar />
        </div>
        {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
        <div className="relative flex-1 flex flex-col">
          <Header
            selectedPage={currentPage}
            onChatToggle={onChatToggle}
            onMenuToggle={onMenuToggle}
            isChatOpen={isChatOpen}
          />
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <UserTable />
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
    </SidebarProvider>
  );
}
