"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import apiClient from "@/lib/api";

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
  "#10b981", "#06b6d4", "#8b5cf6", "#ef4444", "#ec4899",
  "#f59e0b", "#f97316", "#3b82f6", "#14b8a6", "#a855f7",
  "#6366f1", "#eab308", "#f43f5e", "#0ea5e9", "#22c55e"
];

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
  const color = COLORS[index % COLORS.length];

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

export const AssetTypesSummary = ({ branchId, date, isLoading: parentLoading }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!branchId || !date || branchId === "all" || parentLoading) {
      setData([]);
      setTimestamp(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const res = await apiClient.get<ApiResponse>(
        `/api/v1/asset-types/summary?branchId=${branchId}&date=${date}&top=4`
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
  }, [branchId, date, parentLoading]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-[24px] font-semibold">
          ข้อมูลประเภททรัพย์และจำนวน
        </CardTitle>
        <p className="text-sm text-[#36B8EE]">
          {isLoading
            ? "กำลังโหลดข้อมูล..."
            : error
              ? "เกิดข้อผิดพลาดในการโหลดข้อมูล"
              : timestamp
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(timestamp)}`
                : "ไม่พบข้อมูล"}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
            <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
            ⚠️ {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12">
            <div className="text-center text-gray-400 py-16">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">ไม่มีข้อมูล</p>
              <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
            </div>
          </div>
        ) : (
          <>
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
              {data.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
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
