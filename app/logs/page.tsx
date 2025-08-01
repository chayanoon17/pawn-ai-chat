"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LoginTable,
  ExportTable,
  ViewTable,
  ChatTable,
  LogsSummary,
} from "@/components/features/logs";
import { MenuPermissionGuard } from "@/components/core/permission-guard";
import { Logs, LogIn, Download, Eye, MessagesSquare } from "lucide-react";

export default function LogManagementPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <MenuPermissionGuard
      requiredMenuPermission="Activity Logs"
      fallback={
        <div className="min-h-screen bg-slate-50">
          <div className="w-full px-6 py-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  ไม่มีสิทธิ์เข้าถึง
                </h2>
                <p className="text-gray-600">
                  คุณไม่มีสิทธิ์ในการเข้าถึงหน้าประวัติการใช้งาน
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-slate-50">
        <div className="space-y-6">
          {/* Logs Summary */}
          <LogsSummary />

          {/* Logs Content */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="px-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Logs className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-slate-80">
                    ประวัติการใช้งาน
                  </CardTitle>
                  <span className="text-sm text-slate-500">
                    ติดตามและตรวจสอบกิจกรรมของผู้ใช้ในระบบ
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger
                    value="login"
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>ประวัติการเข้าใช้งาน</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="export"
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>ประวัติการส่งออกไฟล์</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="view"
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>ประวัติการเข้าดู</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="flex items-center space-x-2"
                  >
                    <MessagesSquare className="w-4 h-4" />
                    <span>ประวัติการสนทนา</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginTable />
                </TabsContent>

                <TabsContent value="export">
                  <ExportTable />
                </TabsContent>

                <TabsContent value="view">
                  <ViewTable />
                </TabsContent>

                <TabsContent value="chat">
                  <ChatTable />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MenuPermissionGuard>
  );
}
