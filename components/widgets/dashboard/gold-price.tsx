"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api";
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
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-[24px] font-semibold">
              ราคาทองคำอ้างอิง
            </CardTitle>
            <p className="text-sm text-[#3F99D8]">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : latestPrice
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(latestPrice.updatedAt)} น.`
                : "ไม่พบข้อมูล"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-200 border-t-yellow-500"></div>
              <span className="text-gray-600 text-sm">กำลังโหลดราคาทอง...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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
        )}

        {/* Data Display */}
        {latestPrice && !isLoading && (
          <div className="space-y-6">
            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* ทองคำแท่ง */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-6 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                    ทองคำแท่ง
                  </div>
                  <div className="text-yellow-600 text-lg">📊</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {formatPrice(latestPrice.goldBarBuy)}
                    </div>
                    <div className="text-sm text-gray-600">บาท</div>
                  </div>
                  <div className="text-xs text-gray-500">ราคารับซื้อ</div>
                </div>
              </div>

              {/* ทองรูปพรรณ */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-6 rounded-xl border border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                    ทองรูปพรรณ
                  </div>
                  <div className="text-purple-600 text-lg">💍</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {formatPrice(latestPrice.goldJewelryBuy)}
                    </div>
                    <div className="text-sm text-gray-600">บาท</div>
                  </div>
                  <div className="text-xs text-gray-500">ราคารับซื้อ</div>
                </div>
              </div>

              {/* ทองรูปพรรณ 70% */}
              <div className="group relative bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-6 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                    ทองรูปพรรณ 70%
                  </div>
                  <div className="text-green-600 text-lg">📈</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      ≈{formatPrice(latestPrice.goldJewelryBuy * 0.7)}
                    </div>
                    <div className="text-sm text-gray-600">บาท</div>
                  </div>
                  <div className="text-xs text-gray-500">ราคาประเมิน</div>
                </div>
              </div>

              {/* รับจำนำบาทละไม่เกิน */}
              <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                    รับจำนำไม่เกิน
                  </div>
                  <div className="text-gray-600 text-lg">🏦</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {formatPrice(latestPrice.goldBarBuy * 0.7)}
                    </div>
                    <div className="text-sm text-gray-600">บาท</div>
                  </div>
                  <div className="text-xs text-gray-500">วงเงินสูงสุด</div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">ℹ️</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      ข้อมูลเพิ่มเติม
                    </h4>
                    <p className="text-sm text-gray-600">
                      ราคาอ้างอิงจากตลาดทองคำ
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center lg:text-right">
                    <div className="text-gray-500">ส่วนต่างทองแท่ง</div>
                    <div className="font-medium text-gray-900">
                      {formatPrice(
                        latestPrice.goldBarSell - latestPrice.goldBarBuy
                      )}{" "}
                      บาท
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-gray-500">ส่วนต่างทองรูปพรรณ</div>
                    <div className="font-medium text-gray-900">
                      {formatPrice(
                        latestPrice.goldJewelrySell - latestPrice.goldJewelryBuy
                      )}{" "}
                      บาท
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
