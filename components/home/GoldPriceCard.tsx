"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GoldPrice = {
  id: number;
  goldBarBuy: number;
  goldBarSell: number;
  goldJewelryBuy: number;
  goldJewelrySell: number;
  createdAt: string;
};

const goldPriceJSON = {
  status: "success",
  message: "Latest gold price fetched successfully",
  data: {
    id: 1,
    goldBarBuy: 51750,
    goldBarSell: 51650,
    goldJewelryBuy: 52550,
    goldJewelrySell: 50619.24,
    comparePrevious: "-50",
    compareYesterday: "+",
    createdAt: "2025-07-22T07:22:23.257Z",
    updatedAt: "2025-07-22T07:22:23.257Z",
  },
};

export const GoldPriceCard = () => {
  const [latestPrice, setLatestPrice] = useState<GoldPrice | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const latest = goldPriceJSON.data;
      setLatestPrice(latest);
    } catch (err) {
      console.error("Error loading gold price:", err);
      setError("ไม่สามารถโหลดข้อมูลราคาทองได้");
    }
  }, []);

  const formatPrice = (value: number) =>
    value.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("th-TH", {
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
                {latestPrice
                  ? `ราคา ณ วันที่ ${formatDate(latestPrice.createdAt)}`
                  : "กำลังโหลดข้อมูล..."}
              </p>
            </div>
          </div>
          <div className="h-px bg-gray-300 w-full" />
        </div>
      </CardHeader>

      <CardContent className="-mt-5">
        {error && <p className="text-red-500">{error}</p>}

        {latestPrice && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium mb-4 inline-block">
                รับจำนำบาทละไม่เกิน
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(latestPrice.goldBarBuy * 0.7)}
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
