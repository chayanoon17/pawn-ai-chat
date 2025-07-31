"use client";

import { useState, useEffect } from "react";
import BasePageLayout from "@/components/layouts/base-page-layout";
import {
  LoginTable,
  ExportTable,
  LogTabs,
  type Tab,
  type LoginRow,
  type ExportRow,
} from "@/components/features/logs";
import apiRequest from "@/lib/api";
import { toast } from "sonner";
import ChatLogPage from "@/components/chatlogpage";
import ViewTanle from "@/components/features/logs/view-table";

export default function LogPage() {

  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginRow[]>([]);
  const [exportData, setExportData] = useState<ExportRow[]>([]);

  // Load data when tab changes
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab: Tab) => {
    setIsLoading(true);
    try {
      switch (tab) {
        case "login":
          await loadLoginData();
          break;
        case "export":
          await loadExportData();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading log data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLoginData = async () => {
    try {
      const response = await apiRequest.get('/api/v1/logs/login');
      if (response.success) {
        setLoginData(response.data as LoginRow[]);
      }
    } catch (error) {
      console.error('Error loading login logs:', error);
      // Fallback to empty array if API fails
      setLoginData([]);
    }
  };

  const loadExportData = async () => {
    try {
      const response = await apiRequest.get('/api/v1/logs/export');
      if (response.success) {
        setExportData(response.data as ExportRow[]);
      }
    } catch (error) {
      console.error('Error loading export logs:', error);
      // Fallback to empty array if API fails
      setExportData([]);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      );
    }

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
          <div className="text-center p-4 text-gray-500">
            <ViewTanle />
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
