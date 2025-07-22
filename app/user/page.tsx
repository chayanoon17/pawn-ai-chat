"use client"
import { AppSidebar } from "@/components/appsidebar";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"; 
import Header from "@/components/header";
import { UserTable } from "@/components/usertable";

import { useAuth } from "@/context/auth-context";


export default function User() {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // ระบบจะ redirect ไป login อัตโนมัติผ่าน Auth Context
    } catch (error) {
      console.error("Logout failed:", error);
      // แม้ logout API fail ระบบก็จะ clear state อยู่แล้ว
    } finally {
      setIsLoggingOut(false);
    }
  };
  
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
      <div className="flex h-screen w-full">
        {/* Sidebar ฝั่งซ้าย fixed width */}
        <div className="w-64 border-r bg-white">
          <AppSidebar  />
        </div>
        {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
        <div className="flex-1 flex flex-col ">
          <Header
            selectedPage={currentPage}
            onChatToggle={onChatToggle}
            onMenuToggle={onMenuToggle}
            isChatOpen={isChatOpen}
          />
          <main className="flex-1 p-4 overflow-auto">
            <div className="w-full ">
            <UserTable />
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
