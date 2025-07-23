"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// 🟢 Mock JSON response
const response = {
  data: {
    date: "2025-07-21",
    rankings: [
      { rank: 1, assetType: "เก็ตทองคำ", count: 795, totalValue: 16638000 },
      { rank: 2, assetType: "กำไลนาก", count: 138, totalValue: 4152500 },
      { rank: 3, assetType: "แหวนทองคำ", count: 203, totalValue: 1737400 },
      { rank: 4, assetType: "***", count: 90, totalValue: 959000 },
      { rank: 5, assetType: "เหรียญทองคำ", count: 19, totalValue: 290400 },
      { rank: 6, assetType: "**", count: 7, totalValue: 229400 },
      { rank: 7, assetType: "สร้อยมือทองคำ", count: 3, totalValue: 101000 },
      { rank: 8, assetType: ":", count: 5, totalValue: 63500 },
      { rank: 9, assetType: "จักรเย็บผ้า", count: 8, totalValue: 22800 },
      { rank: 10, assetType: "นาฬิกาข้อมือ", count: 2, totalValue: 20000 },
    ],
    timestamp: "2025-07-22T11:09:00.664Z",
  },
};

// 🔵 Extract data
const rankings = response.data.rankings;
const formattedDate = new Date(response.data.timestamp).toLocaleDateString("th-TH", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const TypeAndPriceSummaryCards = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="ค้นหาข้อมูล" className="pl-10 w-355" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">เรียงตาม: ชื่อ</Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-6 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-[24px] font-semibold mb-1">10 อันดับ รายการประเภททรัพย์และราคา</h2>
            <p className="text-sm text-blue-500">อัปเดตล่าสุดเมื่อ {formattedDate}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[80px]">อันดับ</TableHead>
                <TableHead className="min-w-[300px]">ประเภททรัพย์</TableHead>
                <TableHead className="min-w-[120px]">จำนวนรายการ</TableHead>
                <TableHead className="min-w-[160px] text-center">มูลค่ารวมทั้งหมด (บาท)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((row) => (
                <TableRow key={row.rank}>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>{row.assetType}</TableCell>
                  <TableCell>{row.count.toLocaleString()} รายการ</TableCell>
                  <TableCell className="text-center">{row.totalValue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
