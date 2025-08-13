"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";
import type {
  BranchDailySummary,
  DailyOperationProps,
} from "@/types/dashboard";

export const DailyOperationSummary = ({
  branchId,
  date,
  isLoading: parentLoading,
}: DailyOperationProps) => {
  const [summary, setSummary] = useState<BranchDailySummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 เรียก API ดึงข้อมูลรายงานผลการดำเนินงาน
  const fetchSummary = async () => {
    // ถ้าไม่มี branchId หรือ date ยัง loading อยู่ ไม่ต้องเรียก API
    if (!branchId || !date || parentLoading || branchId === "all") {
      setSummary(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // เรียก API ดึงข้อมูลรายงานผลการดำเนินงาน
      const response = await apiClient.get<BranchDailySummary>(
        `/api/v1/branches/daily-operation/summary?branchId=${branchId}&date=${date}`
      );

      console.log("✅ Fetched Daily Operation Summary:", response.data);

      setSummary(response.data);

      // Log ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.log("✨ Daily operation summary loaded:", response.data);
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "ไม่สามารถโหลดข้อมูลรายงานได้";
      setError(errorMessage);

      setSummary(null);

      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("❌ Failed to fetch daily operation summary:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, date, parentLoading]);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "daily-operation-summary",
    "รายงานผลการดำเนินงาน",
    "ข้อมูลเปรียบเทียบผลการดำเนินงานรายวัน (ทรัพย์จำนำยกมาและทรัพย์จำนำปัจจุบัน)",
    summary
      ? {
          branchId: summary.branchId,
          beginningBalance: summary.beginningBalance,
          endingBalance: summary.endingBalance,
          countChange: summary.countChange,
          amountChange: summary.amountChange,
          lastUpdated: summary.timestamp,
          netChangeDirection: summary.amountChange >= 0 ? "เพิ่มขึ้น" : "ลดลง",
        }
      : null
  );

  const formatAmount = (value: number) =>
    value.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-800">
              รายงานผลการดำเนินงาน
            </CardTitle>

            {/* ข้อความวันที่ */}
            <span className="text-sm text-slate-500">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : summary
                ? `ข้อมูล ณ วันที่ ${formatDate(date)}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : "ไม่พบข้อมูล"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
              <span className="text-slate-600">กำลังโหลดรายงาน...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลรายงานผลการดำเนินงาน</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        )}

        {/* No Branch Selected */}
        {branchId === "all" && !isLoading && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="text-blue-500">ℹ️</div>
              <div>
                <p className="text-blue-800 font-medium">เลือกสาขา</p>
                <p className="text-blue-600 text-sm">
                  กรุณาเลือกสาขาเพื่อดูรายงานผลการดำเนินงาน
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {summary && !isLoading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* ฝั่ง ยกมา */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  ทรัพย์จำนำ (ยกมา)
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-md p-3 border border-slate-200">
                    <div className="text-xl font-bold text-slate-800">
                      {summary.beginningBalance.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">รายการ</div>
                  </div>
                  <div className="bg-white rounded-md p-3 border border-slate-200">
                    <div className="text-xl font-bold text-slate-800">
                      {formatAmount(summary.beginningBalance.amount)}
                    </div>
                    <div className="text-xs text-slate-500">บาท</div>
                  </div>
                </div>
              </div>

              {/* ฝั่ง ปัจจุบัน */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  ทรัพย์จำนำ (ปัจจุบัน)
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-md p-3 border border-slate-200">
                    <div className="text-xl font-bold text-slate-800">
                      {summary.endingBalance.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">รายการ</div>
                  </div>

                  <div className="bg-white rounded-md p-3 border border-slate-200">
                    <div className="text-xl font-bold text-slate-800">
                      {formatAmount(summary.endingBalance.amount)}
                    </div>
                    <div className="text-xs text-slate-500">บาท</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary - Minimal Design */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                สรุปการเปลี่ยนแปลง
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Amount Change */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        มูลค่าเปลี่ยนแปลง
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {Math.abs(
                          summary.endingBalance.amount -
                            summary.beginningBalance.amount
                        ).toLocaleString("th-TH", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        บาท
                      </p>
                    </div>
                    <div
                      className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        summary.amountChange > 0
                          ? "bg-green-100 text-green-700"
                          : summary.amountChange < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {summary.amountChange > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : summary.amountChange < 0 ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : (
                        <div className="w-3 h-3 bg-slate-400 rounded-full mr-1"></div>
                      )}
                      <span>
                        {summary.amountChange > 0
                          ? `+${summary.amountChange.toFixed(1)}%`
                          : summary.amountChange < 0
                          ? `${summary.amountChange.toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Count Change */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        จำนวนรายเปลี่ยนแปลง
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {Math.abs(
                          summary.endingBalance.count -
                            summary.beginningBalance.count
                        ).toLocaleString("th-TH")}{" "}
                        รายการ
                      </p>
                    </div>
                    <div
                      className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        summary.countChange > 0
                          ? "bg-green-100 text-green-700"
                          : summary.countChange < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {summary.countChange > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : summary.countChange < 0 ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : (
                        <div className="w-3 h-3 bg-slate-400 rounded-full mr-1"></div>
                      )}
                      <span>
                        {summary.countChange > 0
                          ? `+${summary.countChange.toFixed(1)}%`
                          : summary.countChange < 0
                          ? `${summary.countChange.toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
