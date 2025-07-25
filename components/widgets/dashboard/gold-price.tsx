"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";

type GoldPrice = {
  id: number;
  goldBarBuy: number;
  goldBarSell: number;
  goldJewelryBuy: number;
  goldJewelrySell: number;
  createdAt: string;
  updatedAt: string;
};

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

        // Log ใน development mode
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.log("✨ Gold price loaded:", response.data);
        }
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
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
              ✨
            </div>
            <div>
              <CardTitle className="text-[24px] font-semibold">
                ราคาทองคำอ้างอิง
              </CardTitle>
              <p className="text-sm text-[#36B8EE]">
                {isLoading
                  ? "กำลังโหลดข้อมูล..."
                  : latestPrice
                  ? `อัปเดตล่าสุด ${formatDate(latestPrice.updatedAt)}`
                  : "ไม่พบข้อมูล"}
              </p>
            </div>
          </div>
          <div className="h-px bg-gray-300 w-full" />
        </div>
      </CardHeader>

      <CardContent className="-mt-5">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="text-gray-600">กำลังโหลดราคาทอง...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">เกิดข้อผิดพลาด</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {latestPrice && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ทองคำแท่ง */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="bg-orange-300 text-white px-3 py-1 rounded text-sm font-medium mb-4 inline-block">
                ทองคำแท่ง
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(latestPrice.goldBarBuy)}
                </div>
                <div className="text-sm text-gray-600 relative -top-1">บาท</div>
              </div>
            </div>

            {/* ทองรูปพรรณ */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="bg-orange-300 text-white px-3 py-1 rounded text-sm font-medium mb-4 inline-block">
                ทองรูปพรรณ
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(latestPrice.goldJewelryBuy)}
                </div>
                <div className="text-sm text-gray-600 relative -top-1">บาท</div>
              </div>
            </div>

            {/* ทองรูปพรรณ 70% (คำนวณ) */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="bg-orange-300 text-white px-3 py-1 rounded text-sm font-medium mb-4 inline-block">
                ทองรูปพรรณ 70%
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">
                  ≈{formatPrice(latestPrice.goldJewelryBuy * 0.7)}
                </div>
                <div className="text-sm text-gray-600 relative -top-1">บาท</div>
              </div>
            </div>

            {/* รับจำนำบาทละไม่เกิน (กำหนดเองหรือล็อกค่าก็ได้) */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium mb-4 inline-block">
                รับจำนำบาทละไม่เกิน
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(latestPrice.goldBarBuy * 0.7)}{" "}
                  {/* สมมุติลดลง 100 บาท */}
                </div>
                <div className="text-sm text-gray-600 relative -top-1">บาท</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
