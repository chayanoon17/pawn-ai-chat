"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  Logs,
  Users,
  Activity,
  FileChartColumn,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  getActivitySummary,
  ActivitySummaryResponse,
} from "@/services/log-service";
import { useAuth } from "@/context/auth-context";
import { usePermissions } from "@/hooks/use-permissions";

export function LogsSummary({
  startDate,
  endDate,
  onDateChange,
}: {
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => void;
}) {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<ActivitySummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Date states - use props as initial values or load from localStorage or default to today
  const today = new Date();

  // 🔄 Load saved values from localStorage with session check
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(() => {
    // ถ้ามี props startDate ให้ใช้ตาม props
    if (startDate) return startDate;

    if (typeof window !== "undefined") {
      // ตรวจสอบว่าเป็น session ใหม่หรือไม่
      const isNewSession = !sessionStorage.getItem("logsSummary_session");

      if (isNewSession) {
        // ถ้าเป็น session ใหม่ ให้ clear localStorage และ mark session
        localStorage.removeItem("logsSummary_startDate");
        localStorage.removeItem("logsSummary_endDate");
        sessionStorage.setItem("logsSummary_session", "active");
        return today;
      } else {
        // ถ้าไม่ใช่ session ใหม่ ให้ใช้ค่าจาก localStorage
        const savedDate = localStorage.getItem("logsSummary_startDate");
        if (savedDate) {
          return new Date(savedDate);
        }
      }
    }
    return today;
  });

  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(() => {
    // ถ้ามี props endDate ให้ใช้ตาม props
    if (endDate) return endDate;

    if (typeof window !== "undefined") {
      const isNewSession = !sessionStorage.getItem("logsSummary_session");

      if (isNewSession) {
        return today;
      } else {
        // ถ้าไม่ใช่ session ใหม่ ให้ใช้ค่าจาก localStorage
        const savedDate = localStorage.getItem("logsSummary_endDate");
        if (savedDate) {
          return new Date(savedDate);
        }
      }
    }
    return today;
  });
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // คำนวณ role status
  const isUserSuperAdmin = isSuperAdmin();
  const isUserAdmin = isAdmin();

  // Helper function to format date for API
  const formatDateForAPI = (date: Date): string => {
    // ใช้ UTC เพื่อป้องกันปัญหา timezone ที่ทำให้วันที่ลดลง 1 วัน
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const fetchSummary = async () => {
    if (!localStartDate || !localEndDate) return;

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
        startDate: formatDateForAPI(localStartDate),
        endDate: formatDateForAPI(localEndDate),
        userId: targetUserId,
      };
      const data = await getActivitySummary(params);
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
  }, [localStartDate, localEndDate, user?.id, isUserSuperAdmin, isUserAdmin]);

  // Update local state when props change
  useEffect(() => {
    if (startDate) setLocalStartDate(startDate);
    if (endDate) setLocalEndDate(endDate);
  }, [startDate, endDate]);

  const handleStartDateSelect = (date: Date | undefined) => {
    setLocalStartDate(date);
    setIsStartDateOpen(false);

    // 💾 Save to localStorage
    if (typeof window !== "undefined" && date) {
      localStorage.setItem("logsSummary_startDate", date.toISOString());
    }

    if (onDateChange) {
      onDateChange(date, localEndDate);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setLocalEndDate(date);
    setIsEndDateOpen(false);

    // 💾 Save to localStorage
    if (typeof window !== "undefined" && date) {
      localStorage.setItem("logsSummary_endDate", date.toISOString());
    }

    if (onDateChange) {
      onDateChange(localStartDate, date);
    }
  };

  // แมป activity เป็นชื่อที่อ่านง่าย
  const getActivityDisplayName = (activity: string): string => {
    const activityMap: Record<string, string> = {
      LOGIN: "เข้าสู่ระบบ",
      LOGOUT: "ออกจากระบบ",
      MENU_ACCESS: "เข้าถึงเมนู",
      EXPORT_REPORT: "ส่งออกข้อมูล",
      CHAT: "คุยกับ AI Chat",
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
        <CardHeader className="px-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  ช่วงวันที่
                </CardTitle>
                <p className="text-sm text-slate-500">
                  เลือกช่วงวันที่สำหรับดูข้อมูลสรุป
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Start Date Picker */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">จาก:</span>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[140px] text-sm h-[36px] justify-between"
                    >
                      {localStartDate
                        ? formatDateForDisplay(localStartDate)
                        : "เลือกวันที่"}
                      <CalendarIcon className="ml-1 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localStartDate}
                      onSelect={handleStartDateSelect}
                      disabled={(date) => date > new Date()}
                      defaultMonth={localStartDate || new Date()} // ใช้วันที่ที่เลือกไว้ หรือวันนี้ถ้ายังไม่ได้เลือก
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
                      {localEndDate
                        ? formatDateForDisplay(localEndDate)
                        : "เลือกวันที่"}
                      <CalendarIcon className="ml-1 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localEndDate}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => date > new Date()}
                      defaultMonth={localEndDate || new Date()} // ใช้วันที่ที่เลือกไว้ หรือวันนี้ถ้ายังไม่ได้เลือก
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4">
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
              <Card className="p-4 space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-8 w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">
                        ประวัติทั้งหมด
                      </p>
                      <Logs className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {summary?.summary.totalLogs?.toLocaleString() || 0}
                    </p>
                  </>
                )}
              </Card>

              <Card className="p-4 space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">
                        Logs ในเดือนนี้
                      </p>
                      <Activity className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {summary?.summary.currentMonthLogs?.toLocaleString() || 0}
                    </p>
                  </>
                )}
              </Card>

              <Card className="p-4 space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">
                        จำนวนผู้ใช้ที่ใช้งาน
                      </p>
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {summary?.summary.activeUsersCount || 0}
                    </p>
                  </>
                )}
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Stats Chart */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="px-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <FileChartColumn className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-800">
                ประเภทของประวัติ
              </CardTitle>
              <p className="text-sm text-slate-500">
                ภาพรวมประเภทของประวัติทั้งหมด
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
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
                        {stat.count.toLocaleString()} ครั้ง
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
