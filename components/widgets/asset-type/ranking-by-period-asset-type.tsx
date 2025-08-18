"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
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
  branchId: string | null; // รองรับ "ทุกสาขา"
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

const subtractDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

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
      // สร้าง URL สำหรับ API - ถ้า branchId เป็น null จะไม่ส่งไป
      const params = new URLSearchParams();
      if (branchId) {
        params.append("branchId", branchId);
      }
      params.append("date", date);
      params.append("top", "5");

      const res = await apiClient.get<ApiResponse>(
        `/api/v1/asset-types/ranking-by-period?${params.toString()}`
      );
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
    if (!date) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, date]);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "ranking-by-period-asset-type",
    "ข้อมูลแนวโน้มประเภททรัพย์และราคาตามช่วงเวลา",
    "ข้อมูลแสดงแนวโน้มอันดับประเภททรัพย์สินตามช่วงเวลาต่างๆ",
    chartData.length > 0
      ? {
          branchId: branchId ? parseInt(branchId) : null, // แก้ไขให้รองรับ null
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
    });
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-80">
              ข้อมูลแนวโน้มประเภททรัพย์และราคาตามช่วงเวลา
            </CardTitle>
            <span className="text-sm text-slate-500">
              {isLoading ? (
                "กำลังโหลดข้อมูล..."
              ) : timestamp ? (
                <span className="text-sm text-slate-500">
                  {isLoading
                    ? "กำลังโหลดข้อมูล..."
                    : timestamp
                    ? `ข้อมูล ณ วันที่ ${formatDate(
                        subtractDays(date, 6)
                      )} ถึง วันที่ ${formatDate(date)}`
                    : branchId === "all"
                    ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                    : "ไม่พบข้อมูล"}
                </span>
              ) : branchId === "all" ? (
                "กรุณาเลือกสาขาเพื่อดูข้อมูล"
              ) : (
                "ไม่พบข้อมูล"
              )}
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
