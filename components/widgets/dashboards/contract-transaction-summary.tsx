"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import apiClient from "@/lib/api";

const COLORS = [
  "#10b981", // green-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#ef4444", // red-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#f97316", // orange-500
  "#0ea5e9", // sky-500
];

const formatNumber = (num: number): string => num.toLocaleString("th-TH");

type TransactionSummaryData = {
  name: string;
  value: number;
  color: string;
};

type TransactionSummaryResponse = {
  branchId: number;
  summaries: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
  timestamp: string;
};

interface ContractTransactionSummaryProps {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

export const ContractTransactionSummary = ({
  branchId,
  date,
  isLoading: parentLoading,
}: ContractTransactionSummaryProps) => {
  const [data, setData] = useState<TransactionSummaryData[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 เรียก API ดึงข้อมูลสรุปสถานะตั๋วจำนำ
  const fetchTransactionSummary = async () => {
    // ถ้าไม่มี branchId หรือ date ยัง loading อยู่ ไม่ต้องเรียก API
    if (!branchId || !date || parentLoading || branchId === "all") {
      setData([]);
      setTimestamp(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // เรียก API ดึงข้อมูลสรุปสถานะตั๋วจำนำ
      const response = await apiClient.get<TransactionSummaryResponse>(
        `/api/v1/contracts/transactions/summary?branchId=${branchId}&date=${date}`
      );

      // แปลงข้อมูลให้เป็นรูปแบบสำหรับ PieChart
      const chartData = response.data.summaries.map((item, index) => ({
        name: item.type,
        value: item.value,
        color: COLORS[index % COLORS.length],
      }));

      setData(chartData);
      setTimestamp(response.data.timestamp);

      // Log ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.log("✨ Transaction summary loaded:", response.data);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "ไม่สามารถโหลดข้อมูลสรุปตั๋วจำนำได้";
      setError(errorMessage);

      setData([]);
      setTimestamp(null);

      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("❌ Failed to fetch transaction summary:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionSummary();
  }, [branchId, date, parentLoading]);

  // 🎨 Format วันที่เป็นรูปแบบไทย
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

  const chartConfig = {
    value: { label: "จำนวน" },
    ...Object.fromEntries(
      data.map((item) => [item.name, { label: item.name, color: item.color }])
    ),
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const ex = cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN);
    const ey = cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN);
    const textAnchor = ex > cx ? "start" : "end";
    const color = data[index].color;

    return (
      <g>
        <path d={`M${sx},${sy} L${ex},${ey}`} stroke={color} fill="none" />
        <text
          x={ex}
          y={ey - 10}
          textAnchor={textAnchor}
          fill="#1f2937"
          fontSize={13}
          fontWeight="bold"
        >
          {name}
        </text>
        <text
          x={ex}
          y={ey + 5}
          textAnchor={textAnchor}
          fill={color}
          fontSize={13}
          fontWeight={500}
        >
          {`${formatNumber(value)} (${percent.toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ข้อมูลแสดงสถานะตั๋วจำนำ
            </CardTitle>
            <p className="text-sm text-[#36B8EE]">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : error
                ? `เกิดข้อผิดพลาด: ${error}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : timestamp
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(timestamp)}`
                : "ไม่พบข้อมูล"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">
                  ไม่สามารถโหลดข้อมูลได้
                </p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
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
                  กรุณาเลือกสาขาเพื่อดูข้อมูลสถานะตั๋วจำนำ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Display */}
        {data.length > 0 && !isLoading && (
          <>
            <div className="h-[360px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">
                    ({formatNumber(item.value)})
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No Data State */}
        {data.length === 0 && !isLoading && !error && branchId !== "all" && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลสถานะตั๋วจำนำ</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
