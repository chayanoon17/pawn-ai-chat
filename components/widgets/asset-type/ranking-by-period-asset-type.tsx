"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";

interface Props {
  branchId: string;
  date: string;
}

interface DailyData {
  date: string;
  count: number;
}

interface Ranking {
  assetType: string;
  dailyData: DailyData[];
}

interface ApiResponse {
  branchId: number;
  startDate: string;
  endDate: string;
  periodDays: number;
  top: number;
  totalAssetTypes: number;
  rankings: Ranking[];
  timestamp: string;
}

const COLORS = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

interface ChartDataItem {
  name: string;
  [key: string]: string | number;
}

export const RankingByPeriodAssetType = ({ branchId, date }: Props) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartConfig, setChartConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<ApiResponse>(
        `/api/v1/asset-types/ranking-by-period?branchId=${branchId}&date=${date}&top=5`
      );

      console.log("✅ Full API Response:", res.data);

      const apiData = res.data;
      if (!apiData || !Array.isArray(apiData.rankings)) {
        console.error("📛 Invalid API structure:", apiData);
        setError("ไม่พบข้อมูลจาก API");
        setIsLoading(false);
        return;
      }

      const rankings = apiData.rankings;

      const config: Record<string, { label: string; color: string }> = {};
      rankings.forEach((r, i) => {
        config[r.assetType] = {
          label: r.assetType,
          color: COLORS[i % COLORS.length],
        };
      });
      setChartConfig(config);

      const dateMap: Record<string, Record<string, string | number>> = {};
      rankings.forEach((r) => {
        r.dailyData.forEach(({ date, count }) => {
          if (!dateMap[date])
            dateMap[date] = {
              name: new Date(date).toLocaleDateString("th-TH"),
            };
          dateMap[date][r.assetType] = count;
        });
      });

      const mergedData = Object.values(dateMap).sort(
        (
          a: Record<string, string | number>,
          b: Record<string, string | number>
        ) =>
          new Date(a.name as string).getTime() -
          new Date(b.name as string).getTime()
      ) as ChartDataItem[];

      setChartData(mergedData);
      setTimestamp(apiData.timestamp);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      console.error(
        "❌ Error loading ranking data:",
        error.response?.data || error.message || err
      );
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!branchId || !date || branchId === "all") return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, date]);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "ranking-by-period-asset-type",
    "อันดับประเภททรัพย์สินรายช่วงเวลา",
    "ข้อมูลแสดงแนวโน้มอันดับประเภททรัพย์สินตามช่วงเวลาต่างๆ",
    chartData.length > 0
      ? {
          branchId: parseInt(branchId),
          periodData: chartData,
          assetTypes: Object.keys(chartConfig),
          dateRange: {
            start: chartData[0]?.date,
            end: chartData[chartData.length - 1]?.date,
          },
          totalDataPoints: chartData.length,
          topPerformingAsset: Object.keys(chartConfig)[0], // สมมติว่าเรียงตาม ranking
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ข้อมูลแนวโน้มประเภททรัพย์และราคาตามช่วงเวลา
            </CardTitle>
            <p className="text-sm text-[#3F99D8]">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : timestamp
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(timestamp)}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : "ไม่พบข้อมูล"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
            <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : error ? (
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
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12">
            <div className="text-center text-gray-400 py-16">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">ไม่มีข้อมูล</p>
              <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {(
                    Object.keys(chartConfig) as (keyof typeof chartConfig)[]
                  ).map((key) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={chartConfig[key].color}
                      fill={chartConfig[key].color}
                      fillOpacity={0.3}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap gap-4 mt-2 items-center justify-center">
              {(Object.keys(chartConfig) as (keyof typeof chartConfig)[]).map(
                (key) => (
                  <div key={key} className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: chartConfig[key].color }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig[key].label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
