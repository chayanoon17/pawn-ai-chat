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

// 📊 Types สำหรับ API Response
interface WeeklyOperationData {
  total: number;
  date: string;
}

interface WeeklyOperationSummary {
  data: WeeklyOperationData[];
  total: number;
  last7Days: number;
  prev7Days: number;
  percentChange: number;
}

interface WeeklyOperationResponse {
  branchId: number;
  cashIn: WeeklyOperationSummary;
  cashOut: WeeklyOperationSummary;
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

const leftChartData = [
  { name: "15 พ.ค.", เงินสดรับ: 3.8, เงินสดรับสัปดาห์ก่อน: 3.2 },
  { name: "16 พ.ค.", เงินสดรับ: 3.0, เงินสดรับสัปดาห์ก่อน: 3.4 },
  { name: "17 พ.ค.", เงินสดรับ: 3.6, เงินสดรับสัปดาห์ก่อน: 3.0 },
  { name: "18 พ.ค.", เงินสดรับ: 3.0, เงินสดรับสัปดาห์ก่อน: 3.6 },
  { name: "19 พ.ค.", เงินสดรับ: 2.9, เงินสดรับสัปดาห์ก่อน: 3.8 },
  { name: "20 พ.ค.", เงินสดรับ: 3.6, เงินสดรับสัปดาห์ก่อน: 3.6 },
  { name: "21 พ.ค.", เงินสดรับ: 4.1, เงินสดรับสัปดาห์ก่อน: 3.3 },
];

const rightChartData = [
  { name: "15 พ.ค.", เงินสดจ่าย: 3.8, เงินสดจ่ายสัปดาห์ก่อน: 3.7 },
  { name: "16 พ.ค.", เงินสดจ่าย: 3.6, เงินสดจ่ายสัปดาห์ก่อน: 3.8 },
  { name: "17 พ.ค.", เงินสดจ่าย: 3.3, เงินสดจ่ายสัปดาห์ก่อน: 3.9 },
  { name: "18 พ.ค.", เงินสดจ่าย: 3.6, เงินสดจ่ายสัปดาห์ก่อน: 4.2 },
  { name: "19 พ.ค.", เงินสดจ่าย: 3.2, เงินสดจ่ายสัปดาห์ก่อน: 3.6 },
  { name: "20 พ.ค.", เงินสดจ่าย: 3.6, เงินสดจ่ายสัปดาห์ก่อน: 3.7 },
  { name: "21 พ.ค.", เงินสดจ่าย: 3.7, เงินสดจ่ายสัปดาห์ก่อน: 3.7 },
];

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

  // 📊 แปลงข้อมูลสำหรับ Chart
  const leftChartData =
    data?.cashIn.data.map((item) => ({
      name: formatDate(item.date),
      เงินสดรับ: item.total / 1000000, // แปลงเป็นล้านบาท
      เงินสดรับสัปดาห์ก่อน: 0, // TODO: ต้องมีข้อมูลสัปดาห์ก่อนจาก API
    })) || [];

  const rightChartData =
    data?.cashOut.data.map((item) => ({
      name: formatDate(item.date),
      เงินสดจ่าย: item.total / 1000000, // แปลงเป็นล้านบาท
      เงินสดจ่ายสัปดาห์ก่อน: 0, // TODO: ต้องมีข้อมูลสัปดาห์ก่อนจาก API
    })) || [];

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

              <div className="h-48">
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
