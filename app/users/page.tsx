"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, Shield } from "lucide-react";
import { UserTable, AddUserButton } from "@/components/features/users";
import BasePageLayout from "@/components/layouts/base-page-layout";
import { MenuPermissionGuard } from "@/components/core/permission-guard";

export default function UserPage() {
  // 🎯 State Management
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🎯 Load user statistics
  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setUserStats({
        totalUsers: 45,
        activeUsers: 42,
        totalRoles: 5,
      });
      setIsLoading(false);
    }, 1000);
  }, [refreshTrigger]);

  // 🎯 Handle user created/updated
  const handleUserUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <MenuPermissionGuard
      requiredMenuPermission="Users Management"
      fallback={
        <BasePageLayout
          page="user-management"
          pageTitle="จัดการผู้ใช้"
          showFilter={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                ไม่มีสิทธิ์เข้าถึง
              </h2>
              <p className="text-gray-600">
                คุณไม่มีสิทธิ์ในการเข้าถึงหน้าจัดการผู้ใช้
              </p>
            </div>
          </div>
        </BasePageLayout>
      }
    >
      <BasePageLayout
        page="user-management"
        pageTitle="จัดการผู้ใช้"
        showFilter={false}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 📊 Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  จัดการผู้ใช้
                </h1>
                <p className="text-gray-600 mt-2">
                  เพิ่ม แก้ไข และจัดการข้อมูลผู้ใช้งานในระบบ
                </p>
              </div>
              <AddUserButton onUserCreated={handleUserUpdated} />
            </div>

            {/* 📊 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    ผู้ใช้ทั้งหมด
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {userStats.totalUsers}
                  </div>
                  <p className="text-xs text-blue-700">ผู้ใช้ในระบบทั้งหมด</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">
                    ผู้ใช้ที่ใช้งาน
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {userStats.activeUsers}
                  </div>
                  <p className="text-xs text-green-700">
                    ผู้ใช้ที่สามารถเข้าระบบได้
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">
                    ตำแหน่งทั้งหมด
                  </CardTitle>
                  <Shield className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {userStats.totalRoles}
                  </div>
                  <p className="text-xs text-purple-700">ตำแหน่งที่มีในระบบ</p>
                </CardContent>
              </Card>
            </div>

            {/* 🔍 Search and Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle>รายการผู้ใช้</CardTitle>
                <CardDescription>ค้นหาและจัดการผู้ใช้ในระบบ</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 📋 User Table */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <UserTable />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </BasePageLayout>
    </MenuPermissionGuard>
  );
}
