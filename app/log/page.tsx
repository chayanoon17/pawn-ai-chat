"use client";

import { useState } from "react";
import BasePageLayout from "@/components/layouts/base-page-layout";
import {
  LoginTable,
  ExportTable,
  LogTabs,
  type Tab,
  type LoginRow,
  type ExportRow,
} from "@/components/features/logs";
import ChatLogPage from "@/components/chatlogpage";

// const exportData: ExportRow[] = [
//   {
//     name: "จันทร์เพ็ญ ใจดี",
//     email: "janpen@example.com",
//     type: "รายงานตั๋วรับจำนำ",
//     format: "Excel",
//     records: 150,
//     size: "2.5 MB",
//     status: "สำเร็จ",
//     datetime: "2024-01-15 14:30:00",
//   },
//   {
//     name: "สมชาย รักงาน",
//     email: "somchai@example.com",
//     type: "รายงานประเภททรัพย์",
//     format: "PDF",
//     records: 75,
//     size: "1.8 MB",
//     status: "กำลังดำเนินการ",
//     datetime: "2024-01-15 13:15:00",
//   },
//   {
//     name: "วิชัย เทคโนโลยี",
//     email: "wichai@example.com",
//     type: "รายงานยอดขาย",
//     format: "CSV",
//     records: 200,
//     size: "0.8 MB",
//     status: "ล้มเหลว",
//     datetime: "2024-01-15 12:00:00",
//   },
// ];

export default function LogPage() {

  const [activeTab, setActiveTab] = useState<Tab>("login");

  const renderContent = () => {
    switch (activeTab) {
      case "login":
        return (
          <div className="p-4">
            <LoginTable
             />
          </div>
        );
      case "export":
        return (
          <div className="p-4">
            <ExportTable />
          </div>
        );
      case "view":
        return (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">👁️</div>
            <p className="text-lg font-medium">
              ยังไม่มีข้อมูลประวัติการเข้าดู
            </p>
            <p className="text-sm mt-2">
              ข้อมูลจะแสดงเมื่อมีการเข้าดูเมนูต่าง ๆ
            </p>
          </div>
        );
      case "chat":
        return (
          <div className="text-center p-4">
            <ChatLogPage
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BasePageLayout
      page="log-management"
      pageTitle="ประวัติการใช้งาน"
      showFilter={false}
      className="bg-gray-50"
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              📋 ประวัติการใช้งาน
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              ติดตามและตรวจสอบกิจกรรมของผู้ใช้ในระบบ
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="text-blue-700 text-sm font-semibold mb-2">
                Total Logs
              </div>
              <div className="text-3xl font-bold text-blue-900">1,247</div>
              <div className="text-xs text-blue-600 mt-1">รายการทั้งหมด</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="text-green-700 text-sm font-semibold mb-2">
                Active Users
              </div>
              <div className="text-3xl font-bold text-green-900">45</div>
              <div className="text-xs text-green-600 mt-1">
                ผู้ใช้งานปัจจุบัน
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="text-purple-700 text-sm font-semibold mb-2">
                This Month
              </div>
              <div className="text-3xl font-bold text-purple-900">328</div>
              <div className="text-xs text-purple-600 mt-1">
                กิจกรรมเดือนนี้
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <LogTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </BasePageLayout>
  );
}
