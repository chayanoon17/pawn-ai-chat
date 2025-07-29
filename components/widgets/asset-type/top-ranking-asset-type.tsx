"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        error.response?.data?.message ||
        error.message ||
        "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(msg);
      setRankings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              10 อันดับ รายการประเภททรัพย์และราคา
            </CardTitle>
            <p className="text-sm text-[#3F99D8]">
              {isLoading
                ? "กำลังโหลดข้อมูล..."
                : timestamp
                ? `อัปเดตล่าสุดเมื่อ ${formatDate(timestamp)}`
                : branchId === "all"
                ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                : "ไม่พบข้อมูล"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Error */}
        {error && (
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

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
            <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : rankings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12">
            <div className="text-center text-gray-400 py-16">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">ไม่มีข้อมูล</p>
              <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
            </div>
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
