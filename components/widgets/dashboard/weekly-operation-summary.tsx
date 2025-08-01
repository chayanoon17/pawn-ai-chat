import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import apiClient from "@/lib/api";
import { Download, Upload, FileBarChart } from "lucide-react";
import { useWidgetRegistration } from "@/context/widget-context";

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
  เงินสดรับอาทิตย์นี้: {
    label: "เงินสดรับ (อาทิตย์นี้)",
    color: "#059669", // เขียวเข้ม
  },
  เงินสดรับอาทิตย์ที่แล้ว: {
    label: "เงินสดรับ (อาทิตย์ที่แล้ว)",
    color: "#fb7185", // ชมพูส้ม
  },
  เงินสดจ่ายอาทิตย์นี้: {
    label: "เงินสดจ่าย (อาทิตย์นี้)",
    color: "#0284c7", // น้ำเงินเข้ม
  },
  เงินสดจ่ายอาทิตย์ที่แล้ว: {
    label: "เงินสดจ่าย (อาทิตย์ที่แล้ว)",
    color: "#f59e0b", // ส้มทอง
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

  const formatPercentChange = (percent: number) => {
    const isPositive = percent >= 0;
    const icon = isPositive ? "/icons/up.png" : "/icons/down.png"; // 👈 ใช้ path public/
    const text = isPositive ? "เพิ่มขึ้น" : "ลดลง";
    const color = isPositive ? "text-[#02B670]" : "text-red-600";

    return {
      icon, // 👈 เปลี่ยนจาก emoji
      text: `${text} ${Math.abs(percent).toFixed(2)}%`,
      color,
    };
  };

  // 🔄 ดึงข้อมูลจาก API
  const fetchWeeklyOperationSummary = useCallback(async () => {
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
  }, [branchId, date, isLoading]);

  // 🎯 เรียก API เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchWeeklyOperationSummary();
  }, [branchId, date, fetchWeeklyOperationSummary]);

  // 📊 แปลงข้อมูลสำหรับกราห - รวมข้อมูล thisWeek และ lastWeek
  const prepareChartData = (
    thisWeekData: WeeklyOperationData[],
    lastWeekData: WeeklyOperationData[],
    dataKey: string
  ) => {
    // สร้าง Map สำหรับเก็บข้อมูลตามวันในสัปดาห์
    const chartDataMap = new Map();

    // เพิ่มข้อมูลอาทิตย์นี้
    thisWeekData.forEach((item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString("th-TH", { weekday: "long" }); // เปลี่ยนเป็น "long" เพื่อให้ได้ชื่อเต็ม
      const dateStr = formatDate(item.date);
      const fullDate = date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      chartDataMap.set(dayName, {
        name: dayName, // แสดงเฉพาะชื่อวันบนแกน X
        fullDate: fullDate, // เก็บวันที่เต็มสำหรับ tooltip
        dateStr: dateStr,
        [`${dataKey}อาทิตย์นี้`]: item.total / 1_000_000,
        [`${dataKey}อาทิตย์ที่แล้ว`]: 0,
      });
    });

    // เพิ่มข้อมูลอาทิตย์ที่แล้ว
    lastWeekData.forEach((item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString("th-TH", { weekday: "long" });
      const dateStr = formatDate(item.date);
      const fullDate = date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (chartDataMap.has(dayName)) {
        const existing = chartDataMap.get(dayName);
        existing[`${dataKey}อาทิตย์ที่แล้ว`] = item.total / 1_000_000;
        // เก็บวันที่ของอาทิตย์ที่แล้วด้วย
        existing.lastWeekDate = fullDate;
      } else {
        chartDataMap.set(dayName, {
          name: dayName,
          fullDate: fullDate,
          dateStr: dateStr,
          [`${dataKey}อาทิตย์นี้`]: 0,
          [`${dataKey}อาทิตย์ที่แล้ว`]: item.total / 1_000_000,
          lastWeekDate: fullDate,
        });
      }
    });

    // แปลงเป็น Array และเรียงตามวันในสัปดาห์
    const weekOrder = [
      "วันจันทร์",
      "วันอังคาร",
      "วันพุธ",
      "วันพฤหัสบดี",
      "วันศุกร์",
      "วันเสาร์",
      "วันอาทิตย์",
    ];
    return Array.from(chartDataMap.values()).sort(
      (a, b) => weekOrder.indexOf(a.name) - weekOrder.indexOf(b.name)
    );
  };

  const leftChartData = data
    ? prepareChartData(data.cashIn.thisWeek, data.cashIn.lastWeek, "เงินสดรับ")
    : [];

  const rightChartData = data
    ? prepareChartData(
        data.cashOut.thisWeek,
        data.cashOut.lastWeek,
        "เงินสดจ่าย"
      )
    : [];
  // 🎯 Custom Tooltip Component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        fullDate?: string;
        lastWeekDate?: string;
      };
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-2">{label}</h3>
          {data.fullDate && (
            <p className="text-xs text-gray-500 mb-2">
              อาทิตย์นี้: {data.fullDate}
            </p>
          )}
          {data.lastWeekDate && (
            <p className="text-xs text-gray-500 mb-2">
              อาทิตย์ที่แล้ว: {data.lastWeekDate}
            </p>
          )}
          {payload.map(
            (
              entry: {
                name: string;
                value: number;
                color: string;
              },
              index: number
            ) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}:</span>
                <span className="text-sm font-bold">
                  {entry.value.toFixed(2)} ล้านบาท
                </span>
              </div>
            )
          )}
        </div>
      );
    }
    return null;
  };

  const cashInChange = data
    ? formatPercentChange(data.cashIn.percentChange)
    : null;
  const cashOutChange = data
    ? formatPercentChange(data.cashOut.percentChange)
    : null;

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "weekly-operation-summary",
    "ยอดรับจำนำและรายละเอียด",
    "ข้อมูลการเปรียบเทียบเงินสดรับและเงินสดจ่ายระหว่างอาทิตย์นี้กับอาทิตย์ที่แล้ว",
    data
      ? {
          branchId: data.branchId,
          cashIn: {
            thisWeek: data.cashIn.thisWeek,
            lastWeek: data.cashIn.lastWeek,
            totalThisWeek: data.cashIn.totalThisWeek,
            totalLastWeek: data.cashIn.totalLastWeek,
            percentChange: data.cashIn.percentChange,
          },
          cashOut: {
            thisWeek: data.cashOut.thisWeek,
            lastWeek: data.cashOut.lastWeek,
            totalThisWeek: data.cashOut.totalThisWeek,
            totalLastWeek: data.cashOut.totalLastWeek,
            percentChange: data.cashOut.percentChange,
          },
          timestamp: data.timestamp,
          // เพิ่มข้อมูลที่ประมวลผลแล้วสำหรับ AI
          analysis: {
            chartDataLeft: leftChartData,
            chartDataRight: rightChartData,
            summary: {
              cashInThisWeek: data.cashIn.totalThisWeek,
              cashInLastWeek: data.cashIn.totalLastWeek,
              cashInChange: data.cashIn.percentChange,
              cashOutThisWeek: data.cashOut.totalThisWeek,
              cashOutLastWeek: data.cashOut.totalLastWeek,
              cashOutChange: data.cashOut.percentChange,
            },
          },
        }
      : null,
    [data]
  );

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-100 rounded-lg">
            <FileBarChart className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-80">
              ยอดรับจำนำและรายละเอียด
            </CardTitle>
            <span className="text-sm text-slate-500">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : data
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(data.timestamp)}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : "ไม่พบข้อมูล"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading || isLoading ? (
          <div className="flex justify-center items-center h-64">
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
        ) : !data ||
          (data.cashIn.thisWeek.length === 0 &&
            data.cashIn.lastWeek.length === 0 &&
            data.cashOut.thisWeek.length === 0 &&
            data.cashOut.lastWeek.length === 0) ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลยอดรับจำนำและรายละเอียด</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        ) : (
          <div className="h-fit grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {/* Badge สีเขียว */}
                <div className="flex items-center px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm font-medium">
                  <Download className="w-4 h-4 mr-1" />
                  เงินสดรับ
                </div>

                {/* ข้อความวันที่ */}
                <span className="text-sm text-gray-800 font-medium">
                  ณ วันที่ {formatDate(date)}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {data
                  ? `${formatCurrency(data.cashIn.totalThisWeek)} บาท`
                  : "0 บาท"}
              </div>
              <div className="flex items-center text-sm">
                {cashInChange && (
                  <>
                    <span className={`${cashInChange.color} flex items-center`}>
                      <Image
                        src={cashInChange.icon}
                        width={16}
                        height={16}
                        alt="trend"
                        className="w-4 h-4 mr-1 object-contain"
                      />
                      <span className="font-medium">{cashInChange.text}</span>
                    </span>

                    <span className="ml-1 text-[#344A61]">
                      เทียบกับอาทิตย์ที่แล้ว
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500">
                เปรียบเทียบเงินสดรับอาทิตย์นี้กับอาทิตย์ที่แล้ว
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
                      <ChartTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="เงินสดรับอาทิตย์นี้"
                        stroke="#059669"
                        fill="#059669"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="เงินสดรับอาทิตย์ที่แล้ว"
                        stroke="#fb7185"
                        fill="#fb7185"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap gap-4 mt-2 align-items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartConfig["เงินสดรับอาทิตย์นี้"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดรับอาทิตย์นี้"].label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartConfig["เงินสดรับอาทิตย์ที่แล้ว"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดรับอาทิตย์ที่แล้ว"].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {/* Badge สีฟ้า */}
                <div className="flex items-center px-3 py-1 bg-blue-100 text-sky-600 rounded-md text-sm font-medium">
                  <Upload className="w-4 h-4 mr-1" />
                  เงินสดจ่าย
                </div>

                {/* ข้อความวันที่ */}
                <span className="text-sm text-gray-800 font-medium">
                  ณ วันที่ {formatDate(date)}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {data
                  ? `${formatCurrency(data.cashOut.totalThisWeek)} บาท`
                  : "0 บาท"}
              </div>
              <div className="flex items-center text-sm">
                {cashOutChange && (
                  <>
                    <span
                      className={`${cashOutChange.color} flex items-center`}
                    >
                      <Image
                        src={cashOutChange.icon}
                        width={16}
                        height={16}
                        alt="trend"
                        className="w-4 h-4 mr-1 object-contain"
                      />
                      <span className="font-medium">{cashOutChange.text}</span>
                    </span>
                    <span className="ml-1 text-[#344A61]">
                      เทียบกับอาทิตย์ที่แล้ว
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                เปรียบเทียบเงินสดจ่ายอาทิตย์นี้กับอาทิตย์ที่แล้ว
              </p>

              <div className="flex-1">
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
                      <ChartTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="เงินสดจ่ายอาทิตย์นี้"
                        stroke="#0284c7"
                        fill="#0284c7"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="เงินสดจ่ายอาทิตย์ที่แล้ว"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap gap-4 mt-2 align-items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartConfig["เงินสดจ่ายอาทิตย์นี้"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดจ่ายอาทิตย์นี้"].label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartConfig["เงินสดจ่ายอาทิตย์ที่แล้ว"].color,
                      }}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {chartConfig["เงินสดจ่ายอาทิตย์ที่แล้ว"].label}
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
