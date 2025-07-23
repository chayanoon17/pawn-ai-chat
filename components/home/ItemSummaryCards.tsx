'use client';

import { JSX, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search, SlidersHorizontal, CreditCard, Percent, RefreshCw, HeartCrack, DivideSquare, PlusCircle, Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ✅ import mock JSON
import mockJson from "@/app/data/mock-transactions-details-summary.json";

// ✅ สีของการ์ดและไอคอน
const getStatusColor = (status: string) => {
  switch (status) {
    case "รับจำนำ": return "bg-green-100 text-green-700";
    case "ส่งดอกเบี้ย": return "bg-blue-100 text-blue-700";
    case "ไถ่ถอน": return "bg-orange-100 text-orange-700";
    case "หลุดจำนำ": return "bg-pink-100 text-pink-700";
    case "แบ่งไถ่": return "bg-yellow-100 text-yellow-700";
    case "เพิ่มต้น": return "bg-purple-100 text-purple-700";
    case "ผ่อนผัน": return "bg-teal-100 text-teal-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getIconBgColor = (status: string) => {
  switch (status) {
    case "รับจำนำ": return "bg-green-700";
    case "ส่งดอกเบี้ย": return "bg-blue-700";
    case "ไถ่ถอน": return "bg-orange-700";
    case "หลุดจำนำ": return "bg-pink-700";
    case "แบ่งไถ่": return "bg-yellow-600";
    case "เพิ่มต้น": return "bg-purple-700";
    case "ผ่อนผัน": return "bg-teal-700";
    default: return "bg-gray-500";
  }
};

type TransactionType =
  | "รับจำนำ"
  | "ส่งดอกเบี้ย"
  | "ไถ่ถอน"
  | "หลุดจำนำ"
  | "แบ่งไถ่"
  | "เพิ่มต้น"
  | "ผ่อนผัน";

const statusIconMap: Record<TransactionType, JSX.Element> = {
  "รับจำนำ": <CreditCard className="w-6 h-6 text-white" />,
  "ส่งดอกเบี้ย": <Percent className="w-6 h-6 text-white" />,
  "ไถ่ถอน": <RefreshCw className="w-6 h-6 text-white" />,
  "หลุดจำนำ": <HeartCrack className="w-6 h-6 text-white" />,
  "แบ่งไถ่": <DivideSquare className="w-6 h-6 text-white" />,
  "เพิ่มต้น": <PlusCircle className="w-6 h-6 text-white" />,
  "ผ่อนผัน": <Clock className="w-6 h-6 text-white" />,
};

export default function ItemSummaryCards() {
  const [branchId, setBranchId] = useState<number>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const [summaries, setSummaries] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = async (branchId: number, date: string) => {
    try {
      const res = mockJson.data;
      setSummaries(res?.summaries || []);
      setTransactions(res?.transactions || []);
      setError(null);
      setPage(1);
    } catch (e) {
      console.error(e);
      setError("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchData(branchId, date);
  }, []);

  const paginatedData = transactions.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(transactions.length / pageSize);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">รายการรับจำนำทั้งหมด</h2>
          <p className="text-sm text-blue-500">ประจำวันที่ {new Date(date).toLocaleDateString("th-TH")}</p>
        </div>

        {/* 🔍 Filter */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="text-sm block mb-1">เลือกสาขา</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value={1}>สาขา 1</option>
              <option value={2}>สาขา 2</option>
              <option value={3}>สาขา 3</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">เลือกวันที่</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <Button onClick={() => fetchData(branchId, date)}>ค้นหา</Button>
        </div>

        {/* ✅ Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {summaries.slice(0, 4).map((item, index) => {
            const icon = statusIconMap[item.type as TransactionType] || <SlidersHorizontal className="w-5 h-5" />;
            const bgClass = getStatusColor(item.type);
            const iconBg = getIconBgColor(item.type);

            return (
              <div key={index} className={`p-4 rounded-lg shadow ${bgClass} flex flex-col justify-between`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`rounded-full w-9 h-9 ${iconBg} flex items-center justify-center`}>
                    {icon}
                  </div>
                  <span className="font-semibold">{item.type}</span>
                </div>
                <div className="text-sm">รายการทั้งหมด: <b>{item.total.toLocaleString()}</b></div>
                <div className="text-sm">จำนวนเงินรวม: <b>{item.value.toLocaleString()} บาท</b></div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          {summaries.slice(4, 6).map((item, index) => {
            const icon = statusIconMap[item.type as TransactionType] || <SlidersHorizontal className="w-5 h-5" />;
            const bgClass = getStatusColor(item.type);
            const iconBg = getIconBgColor(item.type);

            return (
              <div
                key={index}
                className={`p-4 rounded-lg shadow ${bgClass} flex flex-col justify-between w-full sm:w-[300px]`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`rounded-full w-9 h-9 ${iconBg} flex items-center justify-center`}>
                    {icon}
                  </div>
                  <span className="font-semibold">{item.type}</span>
                </div>
                <div className="text-sm">รายการทั้งหมด: <b>{item.total.toLocaleString()}</b></div>
                <div className="text-sm">จำนวนเงินรวม: <b>{item.value.toLocaleString()} บาท</b></div>
              </div>
            );
          })}
        </div>

        {/* ✅ Search */}
        <div className="flex items-center my-4">
          <Search className="w-4 h-4 mr-2 text-gray-400" />
          <Input placeholder="ค้นหาข้อมูล..." className="w-full sm:w-64" />
        </div>

        {/* ✅ Table */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>ชื่อ</TableHead>
                <TableHead>ประเภททรัพย์</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.assetType}</TableCell>
                  <TableCell className="whitespace-pre-wrap break-words max-w-[280px]">{item.assetDetail}</TableCell>
                  <TableCell>
                    <span className={`inline-block w-[90px] px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(item.transactionType)}`}>
                      {item.transactionType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.pawnPrice.toLocaleString()} บาท</TableCell>
                </TableRow>
              ))}
              {Array.from({ length: pageSize - paginatedData.length }).map((_, idx) => (
                <TableRow key={`empty-${idx}`}>
                  <TableCell colSpan={5} className="py-6" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => {
                  e.preventDefault();
                  setPage(prev => Math.max(1, prev - 1));
                }} />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  );
                })
                .reduce((acc: (number | string)[], curr, i, arr) => {
                  if (i > 0 && curr - (arr[i - 1] as number) > 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(curr);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={page === p}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(Number(p));
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => {
                  e.preventDefault();
                  setPage(prev => Math.min(totalPages, prev + 1));
                }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

      </CardContent>
    </Card>
  );
}
