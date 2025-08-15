"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";
import { useOptimizedMemo, usePerformanceMonitor } from "@/lib/performance";

type AssetTypeSummary = {
  assetType: string;
  count: number;
  percentage: number;
};

type ApiResponse = {
  branchId: number;
  totalTransactions: number;
  totalAssetTypes: number;
  assetTypeSummaries: AssetTypeSummary[];
  timestamp: string;
};

interface Props {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#ef4444",
  "#ec4899",
  "#f59e0b",
  "#f97316",
  "#3b82f6",
  "#14b8a6",
  "#a855f7",
  "#6366f1",
  "#eab308",
  "#f43f5e",
  "#0ea5e9",
  "#22c55e",
];

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  name?: string;
  value?: number;
  percent?: number;
  index?: number;
}

interface AssetTypeData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

export const AssetTypesSummary = ({
  branchId,
  date,
  isLoading: parentLoading,
}: Props) => {
  // 🎯 Performance monitoring
  usePerformanceMonitor("AssetTypesSummary");

  const [data, setData] = useState<AssetTypeData[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 Stabilized custom label renderer
  const renderCustomLabel = useCallback(
    ({
      cx = 0,
      cy = 0,
      midAngle = 0,
      outerRadius = 0,
      name = "",
      value = 0,
      percent = 0,
      index = 0,
    }: CustomLabelProps) => {
      // Avoid external dependencies to prevent re-renders
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
      ];

      const RADIAN = Math.PI / 180;
      const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
      const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);
      const ex = cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN);
      const ey = cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN);
      const textAnchor = ex > cx ? "start" : "end";
      const color = colors[index % colors.length];

      // Local format function to avoid external dependency
      const formatValue = (num: number): string => {
        return new Intl.NumberFormat("th-TH").format(num);
      };

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
            {`${formatValue(value)} ชิ้น (${(percent * 100).toFixed(2)}%)`}
          </text>
        </g>
      );
    },
    []
  ); // Empty dependency array - all values are internal or from props

  // 🎯 Memoized chart data transformation
  const chartData = useOptimizedMemo(
    () => {
      return data.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
      }));
    },
    [data],
    "AssetTypesSummary-chartData"
  );

  const fetchData = async () => {
    if (!date || parentLoading) {
      setData([]);
      setTimestamp(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // สร้าง URL สำหรับ API - ถ้า branchId เป็น null จะไม่ส่งไป
      const params = new URLSearchParams();
      if (branchId) {
        params.append("branchId", branchId);
      }
      params.append("date", date);
      params.append("top", "4");

      const res = await apiClient.get<ApiResponse>(
        `/api/v1/asset-types/summary?${params.toString()}`
      );

      const apiData = res.data;

      if (!apiData || !Array.isArray(apiData.assetTypeSummaries)) {
        setData([]);
        setError("ไม่พบข้อมูลประเภททรัพย์");
        return;
      }

      const formatted = apiData.assetTypeSummaries.map((item, i) => ({
        name: item.assetType,
        value: item.count,
        percentage: item.percentage,
        color: COLORS[i % COLORS.length],
      }));

      setData(formatted);
      setTimestamp(apiData.timestamp ?? null);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching asset type summary:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, date, parentLoading]);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "asset-type-summary",
    "ข้อมูลประเภททรัพย์และจำนวน",
    "ข้อมูลสรุปประเภททรัพย์และจำนวน พร้อมจำนวนและเปอร์เซ็นต์",
    data.length > 0
      ? {
          branchId: parseInt(branchId),
          totalAssetTypes: data.length,
          totalItems: data.reduce((sum, item) => sum + item.value, 0),
          assetTypes: data.map((item) => ({
            name: item.name,
            count: item.value,
            percentage: item.percentage,
          })),
          topAssetType: data.reduce(
            (max, item) => (item.value > max.value ? item : max),
            data[0]
          )?.name,
          lastUpdated: timestamp,
        }
      : null
  );

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
            <PieChartIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-80">
              ข้อมูลประเภททรัพย์และจำนวน
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

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
              <span className="text-slate-600">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        ) : error ? (
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
        ) : data.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูล</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        ) : (
          <>
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: { label: "จำนวน (ชิ้น)" },
                  ...Object.fromEntries(
                    chartData.map((d) => [
                      d.name,
                      { label: d.name, color: d.color },
                    ])
                  ),
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart key={`pie-chart-${branchId}-${date}`}>
                    <Pie
                      data={chartData}
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
                      {chartData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}-${entry.name}`}
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
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
