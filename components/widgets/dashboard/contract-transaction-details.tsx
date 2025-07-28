"use client";

import {
  Search,
  SlidersHorizontal,
  CreditCard,
  Percent,
  RefreshCw,
  HeartCrack,
  DivideSquare,
  PlusCircle,
  Clock,
  Download,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api";
import { useWidgetRegistration } from "@/context/widget-context";

// 📊 Types สำหรับ API Response
interface TransactionSummaryItem {
  type: string;
  value: number;
  total: number;
}

interface TransactionDetailItem {
  contractNumber: number;
  transactionDate: string;
  interestPaymentDate: string | null;
  overdueDays: number;
  remainingAmount: number;
  interestAmount: number;
  transactionType: string;
  branchId: number;
  assetType: string;
  assetDetail: string;
  pawnPrice: number;
  monthlyInterest: number;
  ticketStatus: string;
  redeemedDate: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerOccupation: string;
}

interface ContractTransactionDetailsResponse {
  branchId: number;
  summaries: TransactionSummaryItem[];
  transactions: TransactionDetailItem[];
  timestamp: string;
}

// 📊 Props สำหรับ Widget
interface ContractTransactionDetailsProps {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

// ✅ สีของการ์ดและไอคอน
const getStatusColor = (status: string) => {
  switch (status) {
    case "รับจำนำ":
      return "bg-green-100 text-green-700";
    case "ส่งดอกเบี้ย":
      return "bg-blue-100 text-blue-700";
    case "ไถ่ถอน":
      return "bg-orange-100 text-orange-700";
    case "หลุดจำนำ":
      return "bg-pink-100 text-pink-700";
    case "แบ่งไถ่":
      return "bg-yellow-100 text-yellow-700";
    case "เพิ่มต้น":
      return "bg-purple-100 text-purple-700";
    case "ผ่อนผัน":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getIconBgColor = (status: string) => {
  switch (status) {
    case "รับจำนำ":
      return "bg-green-700";
    case "ส่งดอกเบี้ย":
      return "bg-blue-700";
    case "ไถ่ถอน":
      return "bg-orange-700";
    case "หลุดจำนำ":
      return "bg-pink-700";
    case "แบ่งไถ่":
      return "bg-yellow-600";
    case "เพิ่มต้น":
      return "bg-purple-700";
    case "ผ่อนผัน":
      return "bg-teal-700";
    default:
      return "bg-gray-500";
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
  รับจำนำ: <CreditCard className="w-6 h-6 text-white" />,
  ส่งดอกเบี้ย: <Percent className="w-6 h-6 text-white" />,
  ไถ่ถอน: <RefreshCw className="w-6 h-6 text-white" />,
  หลุดจำนำ: <HeartCrack className="w-6 h-6 text-white" />,
  แบ่งไถ่: <DivideSquare className="w-6 h-6 text-white" />,
  เพิ่มต้น: <PlusCircle className="w-6 h-6 text-white" />,
  ผ่อนผัน: <Clock className="w-6 h-6 text-white" />,
};

export default function ContractTransactionDetails({
  branchId,
  date,
  isLoading = false,
}: ContractTransactionDetailsProps) {
  // 📊 State สำหรับข้อมูล
  const [data, setData] = useState<ContractTransactionDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 🔄 ดึงข้อมูลจาก API
  const fetchTransactionDetails = async () => {
    if (!branchId || isLoading) return;

    try {
      setLoading(true);
      setError(null);

      // เรียก API ดึงข้อมูลรายละเอียดรายการรับจำนำ
      const response = await apiClient.get<ContractTransactionDetailsResponse>(
        `/api/v1/contracts/transactions/details?branchId=${branchId}&date=${date}`
      );

      setData(response.data);

      // Log ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.log("✨ Transaction details loaded:", response.data);
      }
    } catch (err) {
      console.error("❌ Error fetching transaction details:", err);
      setError("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 เรียก API เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchTransactionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, date]);

  // 🔄 Reset pagination when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedType]);

  // 📥 Export CSV Function
  const handleExportCSV = () => {
    if (!branchId || !date) {
      alert("ไม่สามารถ export ได้ กรุณาเลือกสาขาและวันที่");
      return;
    }

    // สร้าง URL และเปิดในหน้าต่างใหม่เพื่อให้ browser จัดการการดาวน์โหลด
    const exportUrl = `http://localhost:3000/api/v1/contracts/transactions/export/csv?branchId=${branchId}&date=${date}`;

    // เปิดลิงค์ในหน้าต่างใหม่
    window.open(exportUrl, "_blank");

    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("✅ Opening CSV export URL:", exportUrl);
    }
  };

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้
  useWidgetRegistration(
    "contract-transaction-details",
    "รายละเอียดธุรกรรมตั๋วจำนำ",
    "ข้อมูลรายละเอียดธุรกรรมทุกตั๋วจำนำ พร้อมข้อมูลลูกค้า สถานะ และยอดเงิน",
    data
      ? {
          branchId: data.branchId,
          totalTransactions: data.transactions.length,
          summaries: data.summaries,
          sampleTransactions: data.transactions.slice(0, 5).map((t) => ({
            contractNumber: t.contractNumber,
            customerName: t.customerName,
            transactionType: t.transactionType,
            remainingAmount: t.remainingAmount,
            assetType: t.assetType,
            ticketStatus: t.ticketStatus,
          })),
          transactionTypes: [
            ...new Set(data.transactions.map((t) => t.transactionType)),
          ],
          totalAmount: data.transactions.reduce(
            (sum, t) => sum + t.remainingAmount,
            0
          ),
          lastUpdated: data.timestamp,
        }
      : null
  );

  // 🔍 Filter ข้อมูลตามการค้นหา
  const filteredTransactions =
    data?.transactions.filter((transaction) => {
      // Search filter - ค้นหาจากทุกฟิลด์
      const matchesSearch =
        searchTerm === "" ||
        transaction.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.contractNumber.toString().includes(searchTerm) ||
        transaction.assetType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.assetDetail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.pawnPrice.toString().includes(searchTerm) ||
        transaction.transactionType
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        selectedType === "all" || transaction.transactionType === selectedType;

      return matchesSearch && matchesType;
    }) || [];

  // 🎯 Get unique transaction types for dropdown
  const transactionTypes = data
    ? [...new Set(data.transactions.map((t) => t.transactionType))].sort()
    : [];

  const paginatedData = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  // 🎯 Helper function สำหรับจัดรูปแบบวันที่
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">รายการรับจำนำทั้งหมด</h2>
            <p className="text-sm text-blue-500">
              {data
                ? `อัปเดตล่าสุดเมื่อ ${new Intl.DateTimeFormat("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(data.timestamp))} น.`
                : `ประจำวันที่ ${formatDate(date)}`}
            </p>
          </div>

          {/* Export Button */}
          {data && data.transactions.length > 0 && (
            <Button
              onClick={handleExportCSV}
              disabled={loading || isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )}
        </div>

        {loading || isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !data || data.transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลรายการรับจำนำ</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        ) : (
          <>
            {/* ✅ Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {data?.summaries
                .slice(0, 4)
                .map((item: TransactionSummaryItem, index: number) => {
                  const icon = statusIconMap[item.type as TransactionType] || (
                    <SlidersHorizontal className="w-5 h-5" />
                  );
                  const bgClass = getStatusColor(item.type);
                  const iconBg = getIconBgColor(item.type);

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg shadow ${bgClass} flex flex-col justify-between`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`rounded-full w-9 h-9 ${iconBg} flex items-center justify-center`}
                        >
                          {icon}
                        </div>
                        <span className="font-semibold">{item.type}</span>
                      </div>
                      <div className="text-sm">
                        รายการทั้งหมด: <b>{item.total.toLocaleString()}</b>
                      </div>
                      <div className="text-sm">
                        จำนวนเงินรวม: <b>{item.value.toLocaleString()} บาท</b>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              {data?.summaries
                .slice(4, 6)
                .map((item: TransactionSummaryItem, index: number) => {
                  const icon = statusIconMap[item.type as TransactionType] || (
                    <SlidersHorizontal className="w-5 h-5" />
                  );
                  const bgClass = getStatusColor(item.type);
                  const iconBg = getIconBgColor(item.type);

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg shadow ${bgClass} flex flex-col justify-between w-full sm:w-[300px]`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`rounded-full w-9 h-9 ${iconBg} flex items-center justify-center`}
                        >
                          {icon}
                        </div>
                        <span className="font-semibold">{item.type}</span>
                      </div>
                      <div className="text-sm">
                        รายการทั้งหมด: <b>{item.total.toLocaleString()}</b>
                      </div>
                      <div className="text-sm">
                        จำนวนเงินรวม: <b>{item.value.toLocaleString()} บาท</b>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* ✅ Search & Filter */}
            <div className="my-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Search Box - Full Width */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ค้นหาจากเลขที่สัญญา, ชื่อ, ประเภททรัพย์, รายละเอียด, หรือราคา..."
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Type Filter Dropdown */}
                <div className="w-full sm:w-48">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภท</SelectItem>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ✅ Search Results Stats */}
            {(searchTerm || selectedType !== "all") && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  🔍 พบ{" "}
                  <span className="font-semibold">
                    {filteredTransactions.length}
                  </span>{" "}
                  รายการ
                  {searchTerm && (
                    <span>
                      {" "}
                      จากการค้นหา &ldquo;
                      <span className="font-semibold">{searchTerm}</span>&rdquo;
                    </span>
                  )}
                  {selectedType !== "all" && (
                    <span>
                      {" "}
                      ในประเภท &ldquo;
                      <span className="font-semibold">{selectedType}</span>
                      &rdquo;
                    </span>
                  )}
                  {data && (
                    <span className="text-blue-600">
                      {" "}
                      จากทั้งหมด {data.transactions.length} รายการ
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* ✅ Table */}
            <div className="overflow-x-auto min-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>เลขที่สัญญา</TableHead>
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
                      <TableCell className="font-mono">
                        {item.contractNumber}
                      </TableCell>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell>{item.assetType}</TableCell>
                      <TableCell className="whitespace-pre-wrap break-words max-w-[280px]">
                        {item.assetDetail}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block w-[90px] px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(
                            item.transactionType
                          )}`}
                        >
                          {item.transactionType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.pawnPrice.toLocaleString()} บาท
                      </TableCell>
                    </TableRow>
                  ))}
                  {Array.from({ length: pageSize - paginatedData.length }).map(
                    (_, idx) => (
                      <TableRow key={`empty-${idx}`}>
                        <TableCell colSpan={6} className="py-6" />
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ✅ Pagination */}
            {/* ✅ Pagination แบบปรับปรุง */}
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => Math.max(1, prev - 1));
                      }}
                    />
                  </PaginationItem>

                  {(() => {
                    const pages: (number | string)[] = [];
                    const maxVisible = 5;

                    if (totalPages <= maxVisible + 2) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (page > 3) pages.push("...");

                      const start = Math.max(2, page - 1);
                      const end = Math.min(totalPages - 1, page + 1);

                      for (let i = start; i <= end; i++) pages.push(i);

                      if (page < totalPages - 2) pages.push("...");
                      pages.push(totalPages);
                    }

                    return pages.map((p, idx) =>
                      p === "..." ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <span className="px-2 text-gray-400">...</span>
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
                    );
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => Math.min(totalPages, prev + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
