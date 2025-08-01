"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar as CalendarIcon,
  Logs,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { getActivitySummary, ActivitySummaryResponse } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { usePermissions } from "@/hooks/use-permissions";

export function LogsSummary() {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<ActivitySummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Date states - default to today
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | undefined>(today);
  const [endDate, setEndDate] = useState<Date | undefined>(today);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // คำนวณ role status
  const isUserSuperAdmin = isSuperAdmin();
  const isUserAdmin = isAdmin();

  // Helper function to format date for API
  const formatDateForAPI = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const fetchSummary = async () => {
    if (!startDate || !endDate) return;

    try {
      setIsLoading(true);
      setError(null);

      // ตรวจสอบ role ของ user
      const isAdminRole = isUserSuperAdmin || isUserAdmin;
      const targetUserId = isAdminRole
        ? null
        : user?.id
        ? String(user.id)
        : null;

      const params = {
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
        userId: targetUserId,
      };

      console.log("🔍 Fetching activity summary with params:", params);

      const data = await getActivitySummary(params);

      console.log("📊 Activity summary response:", data);
      setSummary(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Failed to fetch activity summary:", error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate, user?.id, isUserSuperAdmin, isUserAdmin]);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setIsStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setIsEndDateOpen(false);
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
                <CalendarIcon className="w-4 h-4 text-blue-600" />
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
          </div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Start Date Picker */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">จาก:</span>
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] text-sm h-[36px] justify-between"
                  >
                    {startDate
                      ? formatDateForDisplay(startDate)
                      : "เลือกวันที่"}
                    <CalendarIcon className="ml-1 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date Picker */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">ถึง:</span>
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] text-sm h-[36px] justify-between"
                  >
                    {endDate ? formatDateForDisplay(endDate) : "เลือกวันที่"}
                    <CalendarIcon className="ml-1 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate &&
            endDate &&
            startDate.toDateString() === endDate.toDateString() &&
            startDate.toDateString() === new Date().toDateString() && (
              <p className="text-xs text-blue-600 mt-2 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>แสดงข้อมูลของวันนี้</span>
              </p>
            )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {error ? (
        <Card className="bg-red-50 border border-red-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 font-medium">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <Button
                onClick={fetchSummary}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                ลองใหม่
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
      )}

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
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-slate-500">ไม่สามารถโหลดข้อมูลได้</p>
            </div>
          ) : (
            <div className="space-y-4">
              {summary?.activityStats && summary.activityStats.length > 0 ? (
                summary.activityStats.map((stat) => (
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
                        style={{
                          width: `${getActivityPercentage(stat.count)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
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

export default LogsSummary;
