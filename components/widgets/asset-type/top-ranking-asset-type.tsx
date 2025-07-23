"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";

interface AssetRanking {
  rank: number;
  assetType: string;
  count: number;
  totalValue: number;
}

interface ApiResponse {
  date: string;
  rankings: AssetRanking[];
  timestamp: string;
}

interface TopRankingAssetTypeProps {
  branchId: string;
  date: string;
}

export const TopRankingAssetType = ({
  branchId,
  date,
}: TopRankingAssetTypeProps) => {
  const [rankings, setRankings] = useState<AssetRanking[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTopRanking = async () => {
    if (!branchId || branchId === "all" || !date) {
      setRankings([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await apiClient.get<ApiResponse>(
        `/api/v1/asset-types/top-ranking?branchId=${branchId}&date=${date}&top=10`
      );

      setRankings(res.data.rankings || []);
      setTimestamp(res.data.timestamp ?? null);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(msg);
      setRankings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRanking();
  }, [branchId, date]);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "top-ranking-asset-type",
    "อันดับประเภททรัพย์สิน",
    "ข้อมูลการจัดอันดับประเภททรัพย์สินตามจำนวนและมูลค่า",
    rankings.length > 0
      ? {
          branchId: parseInt(branchId),
          totalRankings: rankings.length,
          rankings: rankings.map((r) => ({
            rank: r.rank,
            assetType: r.assetType,
            count: r.count,
            totalValue: r.totalValue,
            averageValue: r.totalValue / r.count,
          })),
          topAssetType: rankings[0]?.assetType,
          highestValueType: rankings.reduce(
            (max, r) => (r.totalValue > max.totalValue ? r : max),
            rankings[0]
          )?.assetType,
          lastUpdated: timestamp,
        }
      : null
  );

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-1 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-[24px] font-semibold mb-1">
              10 อันดับ รายการประเภททรัพย์และราคา
            </h2>
            <p className="text-sm text-[#36B8EE]">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : formattedDate
                ? `อัปเดตล่าสุดเมื่อ ${formattedDate}`
                : "ไม่พบข้อมูล"}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
            <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : rankings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM12 15.75c-2.25 0-4.5-1.5-4.5-4.5s2.25-4.5 4.5-4.5 4.5 2.25 4.5 4.5-2.25 4.5-4.5 4.5z"
              />
            </svg>
            <p className="text-sm">ไม่มีข้อมูลสำหรับช่วงเวลานี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">อันดับ</TableHead>
                  <TableHead className="min-w-[300px]">ประเภททรัพย์</TableHead>
                  <TableHead className="min-w-[120px]">จำนวนรายการ</TableHead>
                  <TableHead className="min-w-[160px] text-center">
                    มูลค่ารวมทั้งหมด (บาท)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((row) => (
                  <TableRow key={row.rank}>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>{row.assetType}</TableCell>
                    <TableCell>{row.count.toLocaleString()} รายการ</TableCell>
                    <TableCell className="text-center">
                      {row.totalValue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
