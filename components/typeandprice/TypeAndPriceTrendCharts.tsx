"use client";

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

// ✅ JSON mock จาก API
const response = {
  data: {
    rankings: [
      {
        assetType: "เก็ตทองคำ",
        dailyData: [
          { date: "2025-07-20", count: 14 },
          { date: "2025-07-21", count: 795 },
        ],
      },
      {
        assetType: "กำไลนาก",
        dailyData: [
          { date: "2025-07-20", count: 3 },
          { date: "2025-07-21", count: 138 },
        ],
      },
      {
        assetType: "แหวนทองคำ",
        dailyData: [
          { date: "2025-07-20", count: 8 },
          { date: "2025-07-21", count: 203 },
        ],
      },
      {
        assetType: "***",
        dailyData: [
          { date: "2025-07-20", count: 1 },
          { date: "2025-07-21", count: 90 },
        ],
      },
      {
        assetType: "เหรียญทองคำ",
        dailyData: [
          { date: "2025-07-21", count: 19 },
        ],
      },
    ],
  },
};

// ✅ สร้าง color map
const COLORS = [
  "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4",
];
const chartConfig: Record<string, { label: string; color: string }> = {};
response.data.rankings.forEach((r, i) => {
  chartConfig[r.assetType] = {
    label: r.assetType,
    color: COLORS[i % COLORS.length],
  };
});
type ChartKey = keyof typeof chartConfig;

// ✅ สร้างชุดข้อมูลที่รวม dailyData ทุก assetType ตามวันที่
const dateMap: Record<string, any> = {};
response.data.rankings.forEach((r) => {
  r.dailyData.forEach(({ date, count }) => {
    if (!dateMap[date]) dateMap[date] = { name: new Date(date).toLocaleDateString("th-TH") };
    dateMap[date][r.assetType] = count;
  });
});
const chartData = Object.values(dateMap).sort((a: any, b: any) => new Date(a.name).getTime() - new Date(b.name).getTime());

export const TypeAndPriceTrendCharts = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ข้อมูลแนวโน้มประเภททรัพย์และราคาตามช่วงเวลา
            </CardTitle>
            <p className="text-sm text-blue-500">
              อัปเดตล่าสุดเมื่อ วันที่ 22 กรกฎาคม 2568 เวลา 11.08 น.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {(Object.keys(chartConfig) as ChartKey[]).map((key) => (
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

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-2 items-center justify-center">
            {(Object.keys(chartConfig) as ChartKey[]).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig[key].color }}></span>
                <span className="text-xs text-gray-600">{chartConfig[key].label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
