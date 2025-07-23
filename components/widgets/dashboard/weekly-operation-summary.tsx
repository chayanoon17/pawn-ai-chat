import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import apiClient from "@/lib/api";

interface WeeklyOperationData {
  total: number;
  date: string;
}

interface OperationSummary {
  thisWeek: WeeklyOperationData[];
  lastWeek: WeeklyOperationData[];
  total: number;
  totalThisWeek: number;
  totalLastWeek: number;
  percentChange: number;
}

interface WeeklyOperationResponse {
  branchId: number;
  cashIn: OperationSummary;
  cashOut: OperationSummary;
  timestamp: string;
}

// 📊 Props สำหรับ Widget
interface WeeklyOperationSummaryProps {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

// 🎨 Chart Configuration
const chartConfig = {
  เงินสดรับ: {
    label: "เงินสดรับ",
    color: "#10b981",
  },
  เงินสดรับสัปดาห์ก่อน: {
    label: "เงินสดรับ (สัปดาห์ก่อน)",
    color: "#f97316",
  },
  เงินสดจ่าย: {
    label: "เงินสดจ่าย",
    color: "#06b6d4",
  },
  เงินสดจ่ายสัปดาห์ก่อน: {
    label: "เงินสดจ่าย (สัปดาห์ก่อน)",
    color: "#f59e0b",
  },
};

export const WeeklyOperationSummary = ({
  branchId,
  date,
  isLoading = false,
}: WeeklyOperationSummaryProps) => {
  // 📊 State สำหรับข้อมูล
  const [data, setData] = useState<WeeklyOperationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🎯 Helper functions สำหรับแปลงข้อมูล
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH").format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const formatPercentChange = (percent: number) => {
    const isPositive = percent >= 0;
    const emoji = isPositive ? "📈" : "📉";
    const text = isPositive ? "เพิ่มขึ้น" : "ลดลง";
    const color = isPositive ? "text-[#02B670]" : "text-red-600";

    return {
      emoji,
      text: `${text} ${Math.abs(percent).toFixed(2)}%`,
      color,
    };
  };

  // 🔄 ดึงข้อมูลจาก API
  const fetchWeeklyOperationSummary = async () => {
    if (!branchId || isLoading) return;

    try {
      setLoading(true);
      setError(null);

      // เรียก API ดึงข้อมูลสรุปการดำเนินงานรายสัปดาห์
      const response = await apiClient.get<WeeklyOperationResponse>(
        `/api/v1/branches/weekly-operation/summary?branchId=${branchId}&date=${date}`
      );

      setData(response.data);

      // Log ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.log("✨ Weekly operation summary loaded:", response.data);
      }
    } catch (err) {
      console.error("❌ Error fetching weekly operation summary:", err);
      setError("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 เรียก API เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchWeeklyOperationSummary();
  }, [branchId, date]);

  // ดึงข้อมูลทั้ง 2 ชุดมารวมใน chart (thisWeek + lastWeek)
  const leftChartData = (data?.cashIn?.thisWeek || []).map((item) => ({
    name: formatDate(item.date),
    เงินสดรับ: item.total / 1_000_000,
  })) as any[];

  // เพิ่มข้อมูลสัปดาห์ก่อน (ถ้ามี)
  data?.cashIn?.lastWeek?.forEach((item) => {
    const dateStr = formatDate(item.date);
    const existing = leftChartData.find((d) => d.name === dateStr);
    if (existing) {
      existing["เงินสดรับสัปดาห์ก่อน"] = item.total / 1_000_000;
    } else {
      leftChartData.push({
        name: dateStr,
        เงินสดรับสัปดาห์ก่อน: item.total / 1_000_000,
      });
    }
  });

  const rightChartData = (data?.cashOut?.thisWeek || []).map((item) => ({
    name: formatDate(item.date),
    เงินสดจ่าย: item.total / 1_000_000,
  })) as any[];

  data?.cashOut?.lastWeek?.forEach((item) => {
    const dateStr = formatDate(item.date);
    const existing = rightChartData.find((d) => d.name === dateStr);
    if (existing) {
      existing["เงินสดจ่ายสัปดาห์ก่อน"] = item.total / 1_000_000;
    } else {
      rightChartData.push({
        name: dateStr,
        เงินสดจ่ายสัปดาห์ก่อน: item.total / 1_000_000,
      });
    }
  });
  const cashInChange = data
    ? formatPercentChange(data.cashIn.percentChange)
    : null;
  const cashOutChange = data
    ? formatPercentChange(data.cashOut.percentChange)
    : null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ยอดรับจำนำและรายละเอียด
            </CardTitle>
            <p className="text-sm text-blue-500">
              {data
                ? `อัปเดตล่าสุดเมื่อ ${new Intl.DateTimeFormat("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(data.timestamp))} น.`
                : "กำลังโหลดข้อมูล..."}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading || isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !data ||
          (data.cashIn.thisWeek.length === 0 &&
            data.cashIn.lastWeek.length === 0 &&
            data.cashOut.thisWeek.length === 0 &&
            data.cashOut.lastWeek.length === 0) ? (
              
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p>ไม่มีข้อมูลยอดรับจำนำและรายละเอียด</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded"></span>
                <span className="text-sm font-medium">
                  เงินสดรับ ณ วันที่ {formatDate(date)}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {data ? `${formatCurrency(data.cashIn.total)} บาท` : "0 บาท"}
              </div>
              <div className="flex items-center text-sm">
                {cashInChange && (
                  <>
                    <span className={`${cashInChange.color} flex items-center`}>
                      {cashInChange.emoji}{" "}
                      <span className="font-medium ml-1">
                        {cashInChange.text}
                      </span>
                    </span>
                    <span className="ml-1 text-[#344A61]">
                      เทียบกับค่าเฉลี่ยของสัปดาห์ก่อน
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500">
                แนวโน้มของเงินสดรับช่วง 7 วันที่ผ่านมา
              </p>

              <div className="flex-1 mt-4">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={leftChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis
                        className="text-xs"
                        tickFormatter={(value) => value}
                        label={{
                          value: "ล้านบาท",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          style: {
                            fontSize: "12px",
                            fill: "#6b7280",
                          },
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="เงินสดรับ"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="เงินสดรับสัปดาห์ก่อน"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap gap-4 mt-2 align-items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: chartConfig["เงินสดรับ"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดรับ"].label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartConfig["เงินสดรับสัปดาห์ก่อน"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดรับสัปดาห์ก่อน"].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded"></span>
                <span className="text-sm font-medium">
                  เงินสดจ่าย ณ วันที่ {formatDate(date)}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {data ? `${formatCurrency(data.cashOut.total)} บาท` : "0 บาท"}
              </div>
              <div className="flex items-center text-sm">
                {cashOutChange && (
                  <>
                    <span
                      className={`${cashOutChange.color} flex items-center`}
                    >
                      {cashOutChange.emoji}{" "}
                      <span className="font-medium ml-1">
                        {cashOutChange.text}
                      </span>
                    </span>
                    <span className="ml-1 text-[#344A61]">
                      เทียบกับค่าเฉลี่ยของสัปดาห์ก่อน
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                แนวโน้มของเงินสดจ่ายช่วง 7 วันที่ผ่านมา
              </p>

              <div className="h-48">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rightChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis
                        className="text-xs"
                        tickFormatter={(value) => value}
                        label={{
                          value: "ล้านบาท",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          style: {
                            fontSize: "12px",
                            fill: "#6b7280",
                          },
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="เงินสดจ่าย"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="เงินสดจ่ายสัปดาห์ก่อน"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap gap-4 mt-2 align-items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: chartConfig["เงินสดจ่าย"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดจ่าย"].label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartConfig["เงินสดจ่ายสัปดาห์ก่อน"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดจ่ายสัปดาห์ก่อน"].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );


};
