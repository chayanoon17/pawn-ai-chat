"use client";

import { AppSidebar } from "@/components/core/app-sidebar";
import Header from "@/components/core/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function LogLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header
            selectedPage="logs"
            onChatToggle={() => {}}
            isChatOpen={false}
          />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
