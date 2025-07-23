"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// 🔸 JSON Mock ข้อมูลแบบ Static
const mockJson = {
  status: "success",
  message: "Contract transactions summary retrieved successfully",
  data: {
    branchId: 1,
    summaries: [
      {
        type: "รับจำนำ",
        value: 21135300,
        percentage: 85.58,
      },
      {
        type: "เพิ่มต้น",
        value: 3561200,
        percentage: 14.42,
      },
    ],
    timestamp: "2025-07-22T07:44:35.738Z",
  },
};

const COLORS = [
  "#10b981", "#06b6d4", "#8b5cf6", "#ef4444",
  "#ec4899", "#f59e0b", "#f97316", "#0ea5e9",
];

const formatNumber = (num: number): string =>
  num.toLocaleString("th-TH");

export const StatusPieChart = () => {
  const [branchId, setBranchId] = useState<number>(1);
  const [date, setDate] = useState<string>("2025-07-21");
  const [data, setData] = useState<any[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const { summaries, timestamp } = mockJson.data;
      if (summaries?.length) {
        const colored = summaries.map((item: any, index: number) => ({
          name: item.type,
          value: item.value,
          percentage: item.percentage,
          color: COLORS[index % COLORS.length],
        }));
        setData(colored);
        setTimestamp(timestamp);
        setError(null);
      } else {
        setData([]);
        setError("ไม่พบข้อมูลสรุปธุรกรรม");
      }
    } catch (err) {
      console.error("โหลดข้อมูลผิดพลาด:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
  }, [branchId, date]);

  const chartConfig = {
    value: { label: "จำนวน" },
    ...Object.fromEntries(
      data.map((item) => [
        item.name,
        { label: item.name, color: item.color },
      ])
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ข้อมูลแสดงสถานะตั๋วจำนำ
            </CardTitle>
            <p className="text-sm text-[#36B8EE]">
              {timestamp
                ? `อัปเดตล่าสุดเมื่อ ${new Date(timestamp).toLocaleString("th-TH", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}`
                : error ?? "กำลังโหลดข้อมูล..."}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <label className="text-sm">เลือกสาขา</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={1}>สาขาสะพานขาว</option>
                <option value={2}>สาขาห้วยขวาง</option>
                <option value={3}>สาขาบางแค</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">เลือกวันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[500px]">
          {data.length > 0 ? (
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
          ) : (
            <div className="text-center text-gray-400 pt-16">ไม่มีข้อมูล</div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
