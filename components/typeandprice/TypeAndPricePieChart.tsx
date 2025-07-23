"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const response = {
  status: "success",
  data: {
    branchId: 1,
    totalTransactions: 1279,
    assetTypeSummaries: [
      { assetType: "เก็ตทองคำ", count: 795, percentage: 62.16 },
      { assetType: "แหวนทองคำ", count: 203, percentage: 15.87 },
      { assetType: "กำไลนาก", count: 138, percentage: 10.79 },
      { assetType: "***", count: 90, percentage: 7.04 },
      { assetType: "เหรียญทองคำ", count: 19, percentage: 1.49 },
      { assetType: "จักรเย็บผ้า", count: 8, percentage: 0.63 },
      { assetType: "**", count: 7, percentage: 0.55 },
      { assetType: ":", count: 5, percentage: 0.39 },
      { assetType: "*เหรียญทองคำ", count: 4, percentage: 0.31 },
      { assetType: "แหวนนาก", count: 3, percentage: 0.23 },
      { assetType: "สร้อยมือทองคำ", count: 3, percentage: 0.23 },
      { assetType: "นาฬิกาข้อมือ", count: 2, percentage: 0.16 },
      { assetType: "**แหวนทองคำ", count: 2, percentage: 0.16 },
    ],
    timestamp: "2025-07-22T11:08:04.238Z",
  },
};

// สีที่วนใช้ได้ไม่จำกัดจำนวนรายการ
const COLORS = [
  "#10b981", "#06b6d4", "#8b5cf6", "#ef4444", "#ec4899",
  "#f59e0b", "#f97316", "#3b82f6", "#14b8a6", "#a855f7",
  "#6366f1", "#eab308", "#f43f5e", "#0ea5e9", "#22c55e"
];

// แปลงข้อมูลให้พร้อมใช้ใน chart
const rawData = response.data.assetTypeSummaries;
const data = rawData.map((item, index) => ({
  name: item.assetType,
  value: item.count,
  percentage: item.percentage,
  color: COLORS[index % COLORS.length],
}));

const formatNumber = (num: number): string =>
  num.toLocaleString("th-TH");

const renderCustomLabel = ({
  cx, cy, midAngle, outerRadius, name, value, percent, index,
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
      <text x={ex} y={ey - 10} textAnchor={textAnchor} fill="#1f2937" fontSize={13} fontWeight="bold">
        {name}
      </text>
      <text x={ex} y={ey + 5} textAnchor={textAnchor} fill={color} fontSize={13} fontWeight={500}>
        {`${formatNumber(value)} ชิ้น (${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const TypeAndPricePieChart = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[24px] font-semibold">
            ข้อมูลประเภททรัพย์และจำนวน
          </CardTitle>
          <p className="text-sm text-[#36B8EE]">
            อัปเดตล่าสุดเมื่อวันที่ 22 กรกฎาคม 2568 เวลา 11.08 น.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[500px]">
          <ChartContainer
            config={{
              value: { label: "จำนวน (ชิ้น)" },
              ...Object.fromEntries(data.map(d => [d.name, { label: d.name, color: d.color }])),
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-4">
          {data.map(item => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
