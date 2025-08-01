"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Logs, Users, Activity, TrendingUp } from "lucide-react";
import { getActivitySummary, ActivitySummaryResponse } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { usePermissions } from "@/hooks/use-permissions";

export function LogsSummary() {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<ActivitySummaryResponse | null>(null);

  // Date states - default to today
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // คำนวณ role status
  const isUserSuperAdmin = isSuperAdmin();
  const isUserAdmin = isAdmin();

  const fetchSummary = async () => {
    try {
      setIsLoading(true);

      // ตรวจสอบ role ของ user
      const isAdminRole = isUserSuperAdmin || isUserAdmin;
      const targetUserId = isAdminRole
        ? null
        : user?.id
        ? String(user.id)
        : null;

      const data = await getActivitySummary({
        startDate,
        endDate,
        userId: targetUserId,
      });

      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch activity summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate, user?.id, isUserSuperAdmin, isUserAdmin]);

  const handleDateChange = () => {
    fetchSummary();
  };

  // แมป activity เป็นชื่อที่อ่านง่าย
  const getActivityDisplayName = (activity: string): string => {
    const activityMap: Record<string, string> = {
      LOGIN: "User/Login",
      LOGOUT: "User/Login",
      MENU_ACCESS: "View menu",
      EXPORT_REPORT: "Export",
      CHAT: "Chat history",
    };
    return activityMap[activity] || activity;
  };

  // คำนวณเปอร์เซ็นต์สำหรับ progress bar
  const getActivityPercentage = (count: number): number => {
    if (!summary?.activityStats.length) return 0;
    const maxCount = Math.max(
      ...summary.activityStats.map((stat) => stat.count)
    );
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">
                  ช่วงวันที่
                </CardTitle>
                <p className="text-xs text-slate-500">
                  เลือกช่วงวันที่สำหรับดูข้อมูลสรุป
                </p>
              </div>
            </div>
            <Button
              onClick={handleDateChange}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              อัปเดตข้อมูล
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-slate-700"
              >
                วันที่เริ่มต้น
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-slate-700"
              >
                วันที่สิ้นสุด
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          {startDate === endDate && startDate === today && (
            <p className="text-xs text-blue-600 mt-2 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>แสดงข้อมูลของวันนี้</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    Logs ทั้งหมด
                  </p>
                  <Logs className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {summary?.summary.totalLogs?.toLocaleString() || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    Logs ในเดือนนี้
                  </p>
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {summary?.summary.currentMonthLogs?.toLocaleString() || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    จำนวนผู้ใช้ที่ใช้งาน
                  </p>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {summary?.summary.activeUsersCount || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats Chart */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-slate-800">
            ประเภทของ Log
          </CardTitle>
          <p className="text-sm text-slate-500">ประเภทของ Log ที่หมด</p>
        </CardHeader>
        <CardContent className="px-6 py-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {summary?.activityStats.map((stat) => (
                <div key={stat.activity} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      {getActivityDisplayName(stat.activity)}
                    </span>
                    <span className="text-sm text-slate-500">
                      {stat.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getActivityPercentage(stat.count)}%` }}
                    />
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    ไม่พบข้อมูลในช่วงเวลาที่เลือก
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
