"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api";

type BranchDailySummary = {
  branchId: number;
  beginningBalance: {
    count: number;
    amount: number;
  };
  endingBalance: {
    count: number;
    amount: number;
  };
  countChange: number;
  amountChange: number;
  timestamp: string;
};

interface DailyOperationProps {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

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
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
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
  }, [branchId, date, parentLoading]);

  const formatAmount = (value: number) =>
    value.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              รายงานผลการดำเนินงาน
            </CardTitle>
            <p className="text-sm text-[#36B8EE]">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : summary
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(summary.timestamp)}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : "ไม่พบข้อมูล"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">กำลังโหลดรายงาน...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p>ไม่มีข้อมูลรายงานผลการดำเนินงาน</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        )}

        {/* No Branch Selected */}
        {branchId === "all" && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ฝั่ง ยกมา */}
              <div>
                <h3 className="text-lg font-medium mb-4">ทรัพย์จำนำ (ยกมา)</h3>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {summary.beginningBalance.count.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">ราย</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {formatAmount(summary.beginningBalance.amount)}
                        </div>
                        <div className="text-sm text-gray-600">บาท</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ฝั่ง ปัจจุบัน */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  ทรัพย์จำนำ (ปัจจุบัน)
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {summary.endingBalance.count.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">ราย</div>
                      </div>
                      {summary.countChange !== 0 && (
                        <div
                          className={`flex items-center ${
                            summary.countChange > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {summary.countChange > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          <span className="font-medium">
                            {summary.countChange > 0 ? "+" : ""}
                            {summary.countChange.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {formatAmount(summary.endingBalance.amount)}
                        </div>
                        <div className="text-sm text-gray-600">บาท</div>
                      </div>
                      {summary.amountChange !== 0 && (
                        <div
                          className={`flex items-center ${
                            summary.amountChange > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {summary.amountChange > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          <span className="font-medium">
                            {summary.amountChange > 0 ? "+" : ""}
                            {summary.amountChange.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">สรุปอัตราการทรัพย์จำนำ</h4>
              <div className="text-sm text-gray-600">
                <p>
                  จำนวนราย{" "}
                  <span
                    className={
                      summary.countChange > 0
                        ? "text-green-600"
                        : summary.countChange < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {summary.countChange > 0
                      ? "เพิ่มขึ้น"
                      : summary.countChange < 0
                      ? "ลดลง"
                      : "ไม่มีการเปลี่ยนแปลง"}
                  </span>{" "}
                  {summary.countChange !== 0 && (
                    <>
                      {summary.countChange > 0 ? "+" : ""}
                      {summary.countChange.toFixed(2)}%
                    </>
                  )}
                </p>
                <p>
                  จำนวนเงิน{" "}
                  <span
                    className={
                      summary.amountChange > 0
                        ? "text-green-600"
                        : summary.amountChange < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {summary.amountChange > 0
                      ? "เพิ่มขึ้น"
                      : summary.amountChange < 0
                      ? "ลดลง"
                      : "ไม่มีการเปลี่ยนแปลง"}
                  </span>{" "}
                  {summary.amountChange !== 0 && (
                    <>
                      {summary.amountChange > 0 ? "+" : ""}
                      {summary.amountChange.toFixed(2)}%
                    </>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
