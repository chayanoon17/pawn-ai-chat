"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import apiClient from "@/lib/api";

type AssetTypeSummary = {
    branchId: string;
    totalTransactions: number;
    assetTypeSummaries: {
        assetType: string;
        count: number;
        percentage: number;
    }[];
    timestamp: string;
};


interface Props {
    branchId: string;
    date: string;
    isLoading?: boolean;
}

export const AssetTypeSummaryTable = ({
    branchId,
    date,
    isLoading: parentLoading,
}: Props) => {
    const [data, setSummary] = useState<AssetTypeSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        if (!branchId || branchId === "all" || !date || parentLoading) {
            setSummary(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);



            const response = await apiClient.get<AssetTypeSummary>(
                `/api/v1/asset-types/summary?branchId=${branchId}&date=${date}`
            );



            setSummary(response.data);

            if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
                console.log("✅ Asset Type Summary:", response.data);
            }
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "ไม่สามารถโหลดข้อมูลได้";
            setError(message);
            setSummary(null);

            if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
                console.error("❌ API error:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [branchId, date, parentLoading]);

    const formatDate = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-6 space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-[24px] font-semibold mb-1">
                            รายงานสรุปประเภททรัพย์
                        </h2>
                        <p className="text-sm text-blue-500">
                            {isLoading
                                ? "กำลังโหลดข้อมูล..."
                                : data
                                    ? `อัปเดตล่าสุดเมื่อ ${formatDate(data.timestamp)}`
                                    : branchId === "all"
                                        ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                                        : "ไม่พบข้อมูล"}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 font-medium">เกิดข้อผิดพลาด</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {!error && data && (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[300px]">ประเภททรัพย์</TableHead>
                                    <TableHead className="min-w-[120px] text-right">จำนวนรายการ</TableHead>
                                    <TableHead className="min-w-[120px] text-right">ร้อยละ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.assetTypeSummaries.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.assetType}</TableCell>
                                        <TableCell className="text-right">
                                            {item.count.toLocaleString()} รายการ
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.percentage.toFixed(2)}%
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
