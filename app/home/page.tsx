"use client"
import { AppSidebar } from "@/components/appsidebar";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"; 
import Header from "@/components/header";

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("ข้อมูลตั๋วรับจำนำ");

  function onChatToggle() {
    setIsChatOpen(prev => !prev);
  }

  function onMenuToggle() {
    console.log("Menu toggled");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar ฝั่งซ้าย fixed width */}
        <div className="w-64 border-r bg-white">
          <AppSidebar  />
        </div>

        {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
        <div className="flex-1 flex flex-col">
          <Header
            selectedPage={currentPage}
            onChatToggle={onChatToggle}
            onMenuToggle={onMenuToggle}
            isChatOpen={isChatOpen}
          />
          <main className="flex-1 p-4 overflow-auto">
            {/* ใส่เนื้อหาหน้าตรงนี้ */}
            <h1 className="text-2xl font-bold">หน้าปัจจุบัน:</h1>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
