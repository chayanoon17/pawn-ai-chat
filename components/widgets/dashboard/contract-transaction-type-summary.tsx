"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";

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
  percentage: number;
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
    // ถ้าไม่มี date ยัง loading อยู่ ไม่ต้องเรียก API
    if (!date || parentLoading) {
      setData([]);
      setTimestamp(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // สร้าง URL สำหรับ API - ถ้า branchId เป็น null จะไม่ส่งไป
      const params = new URLSearchParams();
      if (branchId) {
        params.append("branchId", branchId);
      }
      params.append("date", date);
      params.append("summaryType", "transactionType");

      // เรียก API ดึงข้อมูลสรุปสถานะตั๋วจำนำ
      const response = await apiClient.get<TransactionSummaryResponse>(
        `/api/v1/contracts/transactions/summary?${params.toString()}`
      );

      // แปลงข้อมูลให้เป็นรูปแบบสำหรับ PieChart
      const chartData = response.data.summaries.map((item, index) => ({
        name: item.type,
        value: item.value,
        color: COLORS[index % COLORS.length],
        percentage: item.percentage,
      }));

      setData(chartData);
      setTimestamp(response.data.timestamp);

      // Log ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.log("✨ Transaction summary loaded:", response.data);
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, date, parentLoading]);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "contract-transaction-type-summary",
    "ข้อมูลสรุปประเภทธุรกรรมตั๋วจำนำ",
    "ข้อมูลสรุปประเภทธุรกรรมตั๋วจำนำ เช่น จำนำ ส่งดอกเบี้ย และอื่นๆ",
    data.length > 0
      ? {
          branchId: parseInt(branchId),
          summaries: data.map((item) => ({
            type: item.name,
            count: item.value,
            color: item.color,
          })),
          totalTransactions: data.reduce((sum, item) => sum + item.value, 0),
          lastUpdated: timestamp,
          topTransactionType: data.reduce(
            (max, item) => (item.value > max.value ? item : max),
            data[0]
          )?.name,
        }
      : null
  );

  // 🎨 Format วันที่เป็นรูปแบบไทย
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 🎯 Memoize chart config to prevent re-renders
  const chartConfig = useMemo(() => {
    if (!data.length) return { value: { label: "จำนวน" } };
    return {
      value: { label: "จำนวน" },
      ...Object.fromEntries(
        data.map((item) => [item.name, { label: item.name, color: item.color }])
      ),
    };
  }, [data]);

  // 🎯 Memoize the custom label renderer to prevent infinite loops
  // 🎯 Stabilized custom label renderer with data closure
  const renderCustomLabel = useCallback(
    (props: {
      cx?: number;
      cy?: number;
      midAngle?: number;
      outerRadius?: number;
      name?: string;
      value?: number;
      index?: number;
    }) => {
      const {
        cx = 0,
        cy = 0,
        midAngle = 0,
        outerRadius = 0,
        name = "",
        value = 0,
        index = 0,
      } = props;

      const RADIAN = Math.PI / 180;
      const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
      const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);
      const ex = cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN);
      const ey = cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN);
      const textAnchor = ex > cx ? "start" : "end";

      // Local format function to avoid external dependency
      const formatValue = (num: number): string => {
        return new Intl.NumberFormat("th-TH").format(num);
      };

      // Calculate percentage locally
      const totalValue = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      // Get color from current data item
      const currentItem = data[index];
      const color = currentItem?.color || "#8884d8";

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
            {`${formatValue(value)} (${percentage.toFixed(2)}%)`}
          </text>
        </g>
      );
    },
    [data]
  ); // Keep data dependency but ensure it's stable

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-100 rounded-lg">
            <ChartPie className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-80">
              ข้อมูลสรุปประเภทธุรกรรมตั๋วจำนำ
            </CardTitle>
            <span className="text-sm text-slate-500">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : timestamp
                ? `ข้อมูล ณ วันที่ ${formatDate(date)}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : "ไม่พบข้อมูล"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
              <span className="text-slate-600">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
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
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
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
            <div className="flex-1">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart key={`contract-pie-chart-${branchId}-${date}`}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}
                      animationBegin={0}
                      animationDuration={800}
                      isAnimationActive={true}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}-${entry.name}`}
                          fill={entry.color}
                        />
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
          <div className="text-center text-slate-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลสถานะตั๋วจำนำ</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
