"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Info } from "lucide-react";
import apiClient from "@/lib/api-client";
import { useWidgetRegistration } from "@/context/widget-context";
import type { GoldPrice } from "@/types/dashboard";

export const GoldPriceCard = () => {
  const [latestPrice, setLatestPrice] = useState<GoldPrice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 โหลดข้อมูลราคาทองล่าสุด
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // เรียก API ดึงข้อมูลราคาทองล่าสุด
        const response = await apiClient.get<GoldPrice>(
          "/api/v1/gold-price/latest"
        );

        setLatestPrice(response.data);
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถโหลดราคาทองได้";
        setError(errorMessage);

        // Log error ใน development mode
        if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
          console.error("❌ Failed to fetch gold price:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "gold-price",
    "ราคาทองคำอ้างอิง",
    "ข้อมูลราคาทองคำซื้อ-ขาย ทั้งทองแท่งและทองรูปพรรณ พร้อมวันที่อัปเดตล่าสุด",
    latestPrice
      ? {
          goldBarBuy: latestPrice.goldBarBuy,
          goldBarSell: latestPrice.goldBarSell,
          goldJewelryBuy: latestPrice.goldJewelryBuy,
          goldJewelrySell: latestPrice.goldJewelrySell,
          lastUpdated: latestPrice.updatedAt,
          priceSpreadBar: latestPrice.goldBarSell - latestPrice.goldBarBuy,
          priceSpreadJewelry:
            latestPrice.goldJewelrySell - latestPrice.goldJewelryBuy,
        }
      : null
  );

  const formatPrice = (value: number) =>
    value.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-100 rounded-lg">
            <Coins className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-80">
              ราคาทองคำอ้างอิง
            </CardTitle>
            <span className="text-sm text-slate-500">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : latestPrice
                ? `ข้อมูล ณ วันที่ ${formatDate(latestPrice.updatedAt)} น.`
                : "ไม่พบข้อมูล"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {/* Price Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-20 rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Spread Skeleton */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลราคาทองคำอ้างอิง</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        )}

        {/* Data Display */}
        {latestPrice && !isLoading && (
          <div className="space-y-6">
            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* ราคารับซื้อ - ทองคำแท่ง */}
              <div className="bg-[#FFF7ED] border border-[#FFD49E] rounded-lg p-4 hover:bg-[#FFF1DD] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-[#FEB859] text-white px-2.5 py-1 rounded-sm text-sm font-medium">
                    ทองคำแท่ง
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-xl lg:text-2xl font-semibold text-slate-800">
                      {formatPrice(latestPrice.goldBarBuy)}
                    </div>
                    <div className="text-sm text-slate-500">บาท</div>
                  </div>
                  <div className="text-sm text-slate-500">ราคารับซื้อ</div>
                </div>
              </div>

              {/* ราคารับซื้อ - ทองรูปพรรณ */}
              <div className="bg-[#FFF7ED] border border-[#FFD49E] rounded-lg p-4 hover:bg-[#FFF1DD] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-[#FEB859] text-white px-2.5 py-1 rounded-sm text-sm font-medium">
                    ทองรูปพรรณ
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-xl lg:text-2xl font-semibold text-slate-800">
                      {formatPrice(latestPrice.goldJewelryBuy)}
                    </div>
                    <div className="text-sm text-slate-500">บาท</div>
                  </div>
                  <div className="text-sm text-slate-500">ราคารับซื้อ</div>
                </div>
              </div>

              {/* ราคาขาย - ทองคำแท่ง */}
              <div className="bg-[#F0F9FF] border border-[#7DD3FC] rounded-lg p-4 hover:bg-[#E0F2FE] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-[#0EA5E9] text-white px-2.5 py-1 rounded-sm text-sm font-medium">
                    ทองคำแท่ง
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-xl lg:text-2xl font-semibold text-slate-800">
                      {formatPrice(latestPrice.goldBarSell)}
                    </div>
                    <div className="text-sm text-slate-500">บาท</div>
                  </div>
                  <div className="text-sm text-slate-500">ราคาขาย</div>
                </div>
              </div>

              {/* ราคาขาย - ทองรูปพรรณ */}
              <div className="bg-[#F0F9FF] border border-[#7DD3FC] rounded-lg p-4 hover:bg-[#E0F2FE] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-[#0EA5E9] text-white px-2.5 py-1 rounded-sm text-sm font-medium">
                    ทองรูปพรรณ
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-xl lg:text-2xl font-semibold text-slate-800">
                      {formatPrice(latestPrice.goldJewelrySell)}
                    </div>
                    <div className="text-sm text-slate-500">บาท</div>
                  </div>
                  <div className="text-sm text-slate-500">ราคาขาย</div>
                </div>
              </div>

              {/* รับจำนำไม่เกิน */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-slate-600 text-white px-2.5 py-1 rounded-sm text-sm font-medium">
                    รับจำนำไม่เกิน
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-xl lg:text-2xl font-semibold text-slate-800">
                      ≈ {formatPrice(latestPrice.goldBarBuy * 0.81)}
                    </div>
                    <div className="text-sm text-slate-500">บาท</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    81% ของราคารับซื้อทองคำแท่ง
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-500 rounded-sm flex items-center justify-center">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-slate-700">
                      ข้อมูลเพิ่มเติม
                    </h4>
                    <p className="text-sm text-slate-500">
                      ราคาอ้างอิงจากตลาดทองคำ
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center lg:text-right">
                    <div className="text-slate-500 mb-1">
                      ส่วนต่างราคา (ขาย-รับซื้อ)
                    </div>
                    <div className="font-medium text-slate-700">
                      {formatPrice(
                        latestPrice.goldBarSell - latestPrice.goldBarBuy
                      )}{" "}
                      บาท
                    </div>
                    <div className="text-xs text-slate-400 mb-1">ทองแท่ง</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-slate-500 mb-1">
                      ส่วนต่างราคา (ขาย-รับซื้อ)
                    </div>
                    <div className="font-medium text-slate-700">
                      {formatPrice(
                        latestPrice.goldJewelrySell - latestPrice.goldJewelryBuy
                      )}{" "}
                      บาท
                    </div>
                    <div className="text-xs text-slate-400 mb-1">
                      ทองรูปพรรณ
                    </div>
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
