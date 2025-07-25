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

// Mock Data
const loginData: LoginRow[] = [
  {
    name: "จันทร์เพ็ญ ใจดี",
    email: "janpen@example.com",
    datetime: "2024-01-15 09:30:00",
    action: "เข้าสู่ระบบ",
    ip: "192.168.1.100",
    agent: "Chrome 120.0 (Windows)",
    session: "ses_abc123xyz",
    location: "กรุงเทพฯ, ไทย",
  },
  {
    name: "สมชาย รักงาน",
    email: "somchai@example.com",
    datetime: "2024-01-15 08:45:00",
    action: "ออกจากระบบ",
    ip: "192.168.1.101",
    agent: "Firefox 121.0 (MacOS)",
    session: "ses_def456uvw",
    location: "เชียงใหม่, ไทย",
  },
  {
    name: "วิชัย เทคโนโลยี",
    email: "wichai@example.com",
    datetime: "2024-01-15 07:15:00",
    action: "เข้าสู่ระบบ",
    ip: "192.168.1.102",
    agent: "Safari 17.0 (iOS)",
    session: "ses_ghi789rst",
    location: "ภูเก็ต, ไทย",
  },
];

const exportData: ExportRow[] = [
  {
    name: "จันทร์เพ็ญ ใจดี",
    email: "janpen@example.com",
    type: "รายงานตั๋วรับจำนำ",
    format: "Excel",
    records: 150,
    size: "2.5 MB",
    status: "สำเร็จ",
    datetime: "2024-01-15 14:30:00",
  },
  {
    name: "สมชาย รักงาน",
    email: "somchai@example.com",
    type: "รายงานประเภททรัพย์",
    format: "PDF",
    records: 75,
    size: "1.8 MB",
    status: "กำลังดำเนินการ",
    datetime: "2024-01-15 13:15:00",
  },
  {
    name: "วิชัย เทคโนโลยี",
    email: "wichai@example.com",
    type: "รายงานยอดขาย",
    format: "CSV",
    records: 200,
    size: "0.8 MB",
    status: "ล้มเหลว",
    datetime: "2024-01-15 12:00:00",
  },
];

export default function LogPage() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  const renderContent = () => {
    switch (activeTab) {
      case "login":
        return (
          <div className="p-4">
            <LoginTable data={loginData} />
          </div>
        );
      case "export":
        return (
          <div className="p-4">
            <ExportTable data={exportData} />
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
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium">ยังไม่มีข้อมูลประวัติการสนทนา</p>
            <p className="text-sm mt-2">ข้อมูลจะแสดงเมื่อมีการใช้งาน AI Chat</p>
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
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              📋 ประวัติการใช้งาน
            </h1>
            <p className="text-gray-600">
              ติดตามและตรวจสอบกิจกรรมของผู้ใช้ในระบบ
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">
                Total Logs
              </div>
              <div className="text-2xl font-bold text-blue-900">1,247</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">
                Active Users
              </div>
              <div className="text-2xl font-bold text-green-900">45</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">
                This Month
              </div>
              <div className="text-2xl font-bold text-purple-900">328</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <LogTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </BasePageLayout>
  );
}
