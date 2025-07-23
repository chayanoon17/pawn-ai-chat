"use client";

import { useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockResponse = {
  cashIn: {
    data: [
      { total: 28500, date: "2025-07-16T00:00:00.000Z" },
      { total: 29000, date: "2025-07-17T00:00:00.000Z" },
      { total: 30000, date: "2025-07-18T00:00:00.000Z" },
      { total: 31000, date: "2025-07-19T00:00:00.000Z" },
      { total: 29500, date: "2025-07-20T00:00:00.000Z" },
      { total: 30500, date: "2025-07-21T00:00:00.000Z" },
      { total: 29500, date: "2025-07-22T00:00:00.000Z" },
    ],
    percentChange: 5.05,
  },
  cashOut: {
    data: [
      { total: 27000, date: "2025-07-16T00:00:00.000Z" },
      { total: 26000, date: "2025-07-17T00:00:00.000Z" },
      { total: 27500, date: "2025-07-18T00:00:00.000Z" },
      { total: 28500, date: "2025-07-19T00:00:00.000Z" },
      { total: 28000, date: "2025-07-20T00:00:00.000Z" },
      { total: 29000, date: "2025-07-21T00:00:00.000Z" },
      { total: 29500, date: "2025-07-22T00:00:00.000Z" },
    ],
    percentChange: 2.34,
  },
};

const chartConfig = {
  เงินสดรับ: { label: "เงินสดรับ", color: "#10b981" },
  เงินสดจ่าย: { label: "เงินสดจ่าย", color: "#06b6d4" },
};

const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
  });
};

export const TrendCharts = () => {
  const leftChartData = useMemo(
    () =>
      mockResponse.cashIn.data.map((item) => ({
        name: formatDateShort(item.date),
        เงินสดรับ: item.total,
      })),
    []
  );

  const rightChartData = useMemo(
    () =>
      mockResponse.cashOut.data.map((item) => ({
        name: formatDateShort(item.date),
        เงินสดจ่าย: item.total,
      })),
    []
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ยอดรับจำนำและรายละเอียด
            </CardTitle>
            <p className="text-sm text-blue-500">
              อัปเดตล่าสุดเมื่อ วันที่ 22 กรกฎาคม 2568 เวลา 15.00 น.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="bangna">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bangna">สาขา : บางนา</SelectItem>
                <SelectItem value="other">สาขาอื่น</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="22072568">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="22072568">วันที่ : 22/07/2568</SelectItem>
                <SelectItem value="other">วันที่อื่น</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Chart - Cash In */}
          <div className="flex flex-col min-h-[420px]">
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-600">
                เงินสดรับ ณ วันที่ 22 ก.ค. 68
              </div>
              <div className="text-2xl font-bold">
                {mockResponse.cashIn.data.at(-1)?.total.toLocaleString()} บาท
              </div>
              <div className="text-sm text-[#02B670]">
                📈 เพิ่มขึ้น {mockResponse.cashIn.percentChange.toFixed(2)}%
              </div>
              <p className="text-xs text-gray-500">
                แนวโน้มช่วง 7 วันที่ผ่านมา
              </p>
            </div>
            <div className="flex-1 mt-4">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leftChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="เงินสดรับ"
                      stroke={chartConfig["เงินสดรับ"].color}
                      fill={chartConfig["เงินสดรับ"].color}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Right Chart - Cash Out */}
          <div className="flex flex-col min-h-[420px]">
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-600">
                เงินสดจ่าย ณ วันที่ 22 ก.ค. 68
              </div>
              <div className="text-2xl font-bold">
                {mockResponse.cashOut.data.at(-1)?.total.toLocaleString()} บาท
              </div>
              <div className="text-sm text-red-600">
                📉 เพิ่มขึ้น {mockResponse.cashOut.percentChange.toFixed(2)}%
              </div>
              <p className="text-xs text-gray-500">
                แนวโน้มช่วง 7 วันที่ผ่านมา
              </p>
            </div>
            <div className="flex-1 mt-4">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rightChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="เงินสดจ่าย"
                      stroke={chartConfig["เงินสดจ่าย"].color}
                      fill={chartConfig["เงินสดจ่าย"].color}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
