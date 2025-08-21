"use client";

import {
  Search,
  SlidersHorizontal,
  Download,
  TableIcon,
  Ticket,
  Tickets,
  TicketCheck,
  TicketMinus,
  TicketPercent,
  TicketPlus,
  Eye,
  Clock,
  UserRound,
  Gem,
  CircleDollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  PauseCircle,
  ShoppingCart,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getContractTransactionDetails,
  exportContractTransactionsCSV,
  type ContractTransactionDetailsResponse,
  type TransactionDetailItem,
  type TransactionSummaryItem,
} from "@/services/dashboard-service";
import { useWidgetContext } from "@/hooks/use-widget-context";
import { useFilter } from "@/context/filter-context";
import { showWarning } from "@/lib/sweetalert";

// 📊 Props สำหรับ Widget
interface ContractTransactionDetailsProps {
  branchId: string | null; // รองรับ "ทุกสาขา"
  date: string;
  isLoading?: boolean;
}

// ✅ สีของการ์ดและไอคอน
const getStatusColor = (status: string) => {
  switch (status) {
    // ประเภทธุรกรรม
    case "จำนำ":
      return "bg-[#596FF6] text-[#FFFFFF]";
    case "ส่งดอกเบี้ย":
      return "bg-[#F1C5C4] text-[#8D3A3A]";
    case "ผ่อนต้น":
      return "bg-[#83DDE5] text-[#0A5359]";
    case "เพิ่มต้น":
      return "bg-[#FBE689] text-[#544D1E]";
    case "แบ่งไถ่":
      return "bg-[#A6A6A6] text-[#000000]";
    // สถานะสัญญา
    case "ตั๋วปัจจุบัน":
      return "bg-[#6DEB9B] text-[#00521E]";
    case "ไถ่ถอนแล้ว":
      return "bg-[#96BEFF] text-[#1A4286]";
    case "หลุดจำนำ":
      return "bg-[#EF4444] text-[#FFFFFF]";
    case "ยกเลิก":
      return "bg-[#FF9042] text-[#FFFFFF]";
    case "อายัด":
      return "bg-[#CAB3FF] text-[#482598]";
    case "ขายแล้ว":
      return "bg-[#00B0CE] text-[#FFFFFF]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getIconBgColor = (status: string) => {
  switch (status) {
    // ประเภทธุรกรรม
    case "จำนำ":
      return "bg-[#FFFFFF]";
    case "ส่งดอกเบี้ย":
      return "bg-[#8D3A3A]";
    case "ผ่อนต้น":
      return "bg-[#0A5359]";
    case "เพิ่มต้น":
      return "bg-[#544D1E]";
    case "แบ่งไถ่":
      return "bg-[#FFFFFF]";
    // สถานะสัญญา
    case "ตั๋วปัจจุบัน":
      return "bg-[#FFFFFF]";
    case "ไถ่ถอนแล้ว":
      return "bg-[#FFFFFF]";
    case "หลุดจำนำ":
      return "bg-[#FFFFFF]";
    case "ยกเลิก":
      return "bg-[#FFFFFF]";
    case "อายัด":
      return "bg-[#FFFFFF]";
    case "ขายแล้ว":
      return "bg-[#FFFFFF]";
    default:
      return "bg-gray-500";
  }
};

type TransactionType =
  | "จำนำ"
  | "ส่งดอกเบี้ย"
  | "ผ่อนต้น"
  | "เพิ่มต้น"
  | "แบ่งไถ่";

type ContractStatus =
  | "ตั๋วปัจจุบัน"
  | "ไถ่ถอนแล้ว"
  | "หลุดจำนำ"
  | "ยกเลิก"
  | "อายัด"
  | "ขายแล้ว";

const statusIconMap: Record<TransactionType | ContractStatus, JSX.Element> = {
  // ประเภทธุรกรรม
  จำนำ: <Ticket className="w-5 h-5 text-[#596FF6]" />,
  ส่งดอกเบี้ย: <TicketPercent className="w-5 h-5 text-white" />,
  ผ่อนต้น: <TicketCheck className="w-5 h-5 text-white" />,
  เพิ่มต้น: <TicketPlus className="w-5 h-5 text-white" />,
  แบ่งไถ่: <Tickets className="w-5 h-5 text-[#000000]" />,
  // สถานะสัญญา
  ตั๋วปัจจุบัน: <Ticket className="w-5 h-5 text-[#00521E]" />,
  ไถ่ถอนแล้ว: <CheckCircle className="w-5 h-5 text-[#1A4286]" />,
  หลุดจำนำ: <XCircle className="w-5 h-5 text-[#EF4444]" />,
  ยกเลิก: <AlertCircle className="w-5 h-5 text-[#F97316]" />,
  อายัด: <PauseCircle className="w-5 h-5 text-[#482598]" />,
  ขายแล้ว: <ShoppingCart className="w-5 h-5 text-[#06B6D4]" />,
};

// ✅ Utilities สำหรับปิดบังข้อมูลชื่อ-นามสกุล (รองรับตัวอักษรไทย)
const maskTail = (text: string, tail = 4, maskChar = "X") => {
  if (!text) return "";
  const chars = Array.from(text.trim()); // กันปัญหา unicode/สระ-วรรณยุกต์
  if (chars.length <= tail) return maskChar.repeat(chars.length);
  return chars.slice(0, chars.length - tail).join("") + maskChar.repeat(tail);
};

const maskFirstLast = (fullName: string) => {
  if (!fullName) return "";
  // แยกคำด้วย space แล้ว mask แยกส่วน (เช่น "สมชาย ใจดี" -> "สมชา**** ใจด****")
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => maskTail(part, 4, "*"))
    .join(" ");
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
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetailItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [summaryType, setSummaryType] = useState<
    "contractStatus" | "transactionType"
  >("contractStatus");
  const pageSize = 10;

  // 🎯 ใช้ Filter Context เพื่อรับการแจ้งเตือนเมื่อ filter เปลี่ยน
  const { filterData } = useFilter();

  // 🔄 ดึงข้อมูลจาก API
  const fetchTransactionDetails = async () => {
    if (isLoading || !date) return;

    try {
      setLoading(true);
      setError(null);

      // เรียกใช้ function จาก dashboard-service
      const response = await getContractTransactionDetails({
        branchId,
        date,
        summaryType: summaryType,
      });

      setData(response);
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
  }, [branchId, date, summaryType]);

  // 🔄 Reset pagination when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedType, selectedStatus, summaryType]);

  // 📥 Export CSV Function
  const handleExportCSV = async () => {
    if (!date) {
      showWarning("ไม่สามารถ Export ได้", "กรุณาเลือกวันที่ก่อนทำการ Export");
      return;
    }

    try {
      setLoading(true);

      // เรียกใช้ function จาก dashboard-service
      await exportContractTransactionsCSV({
        branchId,
        date,
      });
    } catch (error) {
      console.error("❌ Error exporting CSV:", error);
      showWarning(
        "ไม่สามารถ Export ได้",
        "เกิดข้อผิดพลาดในการส่งออกไฟล์ CSV กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  };

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
        transaction.ticketBookNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.assetName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.assetDetail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.pawnPrice.toString().includes(searchTerm) ||
        transaction.transactionType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.contractStatus
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        selectedType === "all" || transaction.transactionType === selectedType;

      // Status filter
      const matchesStatus =
        selectedStatus === "all" ||
        transaction.contractStatus === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    }) || [];

  // 🎯 Get unique transaction types for dropdown
  const transactionTypes = data
    ? [...new Set(data.transactions.map((t) => t.transactionType))].sort()
    : [];

  // 🎯 Get unique contract statuses for dropdown
  const contractStatuses = data
    ? [...new Set(data.transactions.map((t) => t.contractStatus))].sort()
    : [];

  const paginatedData = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  // 🎯 Register Widget เพื่อให้ Chat สามารถใช้เป็น Context ได้ - ใช้ระบบใหม่
  useWidgetContext(
    "contract-transaction-details",
    "รายการตั๋วจำนำทั้งหมด",
    "ข้อมูลรายละเอียดธุรกรรมทุกตั๋วจำนำ สถานะ และราคารับจำนำ พร้อมข้อมูลลูกค้า",
    data
      ? {
          branchId: data.branchId,
          summaryType: summaryType,
          totalTransactions: data.transactions.length,
          summaries: data.summaries,
          // ✅ ใช้ transactions ที่กรองและแบ่งหน้าแล้ว (หน้าปัจจุบัน)
          transactions: paginatedData,
          // ข้อมูลเพิ่มเติมสำหรับ context
          currentPage: page,
          pageSize: pageSize,
          totalPages: totalPages,
          filteredTransactionsCount: filteredTransactions.length,
          searchTerm: searchTerm,
          selectedType: selectedType,
          selectedStatus: selectedStatus,
          transactionTypes: [
            ...new Set(data.transactions.map((t) => t.transactionType)),
          ],
          contractStatuses: [
            ...new Set(data.transactions.map((t) => t.contractStatus)),
          ],
          totalAmount: data.transactions.reduce(
            (sum, t) => sum + t.remainingAmount,
            0
          ),
          currentPageAmount: paginatedData.reduce(
            (sum, t) => sum + t.remainingAmount,
            0
          ),
          lastUpdated: data.timestamp,
          // 🆕 เพิ่มข้อมูล context สำหรับ filter
          filterContext: {
            branchId: filterData.branchId,
            date: filterData.date,
            isLoading: filterData.isLoading,
          },
        }
      : null,
    {
      autoUpdate: true, // 🔄 เปิด auto-update
      replaceOnUpdate: true, // 🔄 แทนที่ context เดิมเมื่อมีการอัพเดท
      dependencies: [filterData, summaryType], // 📊 dependencies เพิ่มเติม
    }
  );

  // 🎯 Helper function สำหรับจัดรูปแบบวันที่
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateOnly = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="px-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <TableIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-80">
                รายการตั๋วจำนำทั้งหมด
                {data && data.summaries && (
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    (
                    {summaryType === "contractStatus"
                      ? "แสดงตามสถานะสัญญาตั๋วจำนำ"
                      : "แสดงตามประเภทธุรกรรมตั๋วจำนำ"}
                    )
                  </span>
                )}
              </CardTitle>
              <span className="text-sm text-slate-500">
                {isLoading
                  ? "กำลังโหลดข้อมูล..."
                  : data
                  ? `ข้อมูล ณ วันที่ ${formatDate(date)}`
                  : branchId === "all"
                  ? "กรุณาเลือกสาขาเพื่อดูข้อมูล"
                  : "ไม่พบข้อมูล"}
              </span>
            </div>
          </div>
          {/* Dropdown และ Export Button */}
          {data && data.transactions.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Summary Type Dropdown */}
              <Select
                value={summaryType}
                onValueChange={(value: "contractStatus" | "transactionType") =>
                  setSummaryType(value)
                }
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="เลือกรูปแบบการแสดงผล" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractStatus">
                    แสดงตามสถานะสัญญาตั๋วจำนำ
                  </SelectItem>
                  <SelectItem value="transactionType">
                    แสดงตามประเภทธุรกรรมตั๋วจำนำ
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button
                onClick={handleExportCSV}
                disabled={loading || isLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              >
                <Download className="w-4 h-4" />
                ส่งออกเป็น CSV
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {loading || isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
              <span className="text-slate-600">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
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
        ) : !data || data.transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">ไม่มีข้อมูลรายการรับจำนำ</p>
            <p className="text-sm">สำหรับสาขาและวันที่ที่เลือก</p>
          </div>
        ) : (
          <>
            {/* ✅ Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 border-b border-gray-100">
              {data?.summaries.map(
                (item: TransactionSummaryItem, index: number) => {
                  const icon = statusIconMap[
                    item.type as TransactionType | ContractStatus
                  ] || <SlidersHorizontal className="w-5 h-5" />;
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
                }
              )}
            </div>

            {/* ✅ Search & Filter */}
            <div className="my-5">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Search Box - Full Width */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ค้นหาจากเลขที่สัญญา, เลขที่ตั๋ว, ชื่อ, ชื่อทรัพย์, รายละเอียด, สถานะตั๋วจำนำ, ประเภทธุรกรรม หรือราคารับจำนำ..."
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter Dropdown */}
                <div className="w-full sm:w-48">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกสถานะ</SelectItem>
                      {contractStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter Dropdown */}
                <div className="w-full sm:w-48">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกประเภทธุรกรรม" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภทธุรกรรม</SelectItem>
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
            {(searchTerm ||
              selectedType !== "all" ||
              selectedStatus !== "all") && (
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
                  {selectedStatus !== "all" && (
                    <span>
                      {" "}
                      ในสถานะ &ldquo;
                      <span className="font-semibold">{selectedStatus}</span>
                      &rdquo;
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
                    <TableHead>เลขที่ตั๋ว</TableHead>
                    <TableHead>ชื่อ - นามสกุล</TableHead>
                    <TableHead>ชื่อทรัพย์</TableHead>
                    <TableHead className="text-center">รายละเอียด</TableHead>
                    <TableHead className="pl-8">สถานะ</TableHead>
                    <TableHead>ประเภทธุรกรรม</TableHead>
                    <TableHead className="text-center pl-8">
                      ราคารับจำนำ
                    </TableHead>
                    <TableHead className="text-center">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-6 text-slate-500"
                      >
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {paginatedData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">
                            {item.contractNumber}
                          </TableCell>
                          <TableCell className="font-mono">
                            {item.ticketBookNumber}
                          </TableCell>
                          <TableCell>
                            {maskFirstLast(item.customerName)}
                          </TableCell>
                          <TableCell>{item.assetName}</TableCell>
                          <TableCell className="whitespace-pre-wrap break-words max-w-[280px]">
                            {item.assetDetail}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block w-[80px] px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(
                                item.contractStatus
                              )}`}
                            >
                              {item.contractStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block w-[80px] px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(
                                item.transactionType
                              )}`}
                            >
                              {item.transactionType}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.pawnPrice.toLocaleString()} บาท
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTransaction(item);
                                setViewDialogOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:bg-slate-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {Array.from({
                        length: pageSize - paginatedData.length,
                      }).map((_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell colSpan={9} className="py-6" />
                        </TableRow>
                      ))}
                    </>
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

        {/* Transaction Detail Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <TableIcon className="w-5 h-5 text-slate-600" />
                <span>รายละเอียดธุรกรรม</span>
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                ข้อมูลรายละเอียดของธุรกรรมเลขที่{" "}
                {selectedTransaction?.contractNumber}
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4">
                {/* ข้อมูลสัญญา */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                    <Ticket className="w-4 h-4 text-slate-500" />
                    <span>ข้อมูลสัญญา</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        เลขที่สัญญา
                      </label>
                      <p className="text-sm text-slate-800 mt-1 font-mono">
                        {selectedTransaction.contractNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        เลขที่สัญญาต้นฉบับ
                      </label>
                      <p className="text-sm text-slate-800 mt-1 font-mono">
                        {selectedTransaction.primaryContractNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        เลขที่สัญญาก่อนหน้า
                      </label>
                      <p className="text-sm text-slate-800 mt-1 font-mono">
                        {selectedTransaction.previousContractNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        เลขที่ตั๋ว
                      </label>
                      <p className="text-sm text-slate-800 mt-1 font-mono">
                        {selectedTransaction.ticketBookNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        สถานะสัญญา
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            selectedTransaction.contractStatus
                          )}`}
                        >
                          {selectedTransaction.contractStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ประเภทธุรกรรม
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            selectedTransaction.transactionType
                          )}`}
                        >
                          {selectedTransaction.transactionType}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        สาขา
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.branchLocation} (
                        {selectedTransaction.branchShortName})
                      </p>
                    </div>
                  </div>
                </div>

                {/* ข้อมูลลูกค้า */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                    <UserRound className="w-4 h-4 text-slate-500" />
                    <span>ข้อมูลลูกค้า</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ชื่อ-นามสกุล
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.customerName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        เบอร์โทรศัพท์
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.customerPhone || "-"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ที่อยู่
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.customerAddress || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        อาชีพ
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.customerOccupation || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ข้อมูลทรัพย์สิน */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                    <Gem className="w-4 h-4 text-slate-500" />
                    <span>ข้อมูลทรัพย์สิน</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ชื่อทรัพย์
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.assetName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ราคาจำนำ
                      </label>
                      <p className="text-sm text-slate-800 mt-1 font-semibold">
                        {selectedTransaction.pawnPrice.toLocaleString()} บาท
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        รายละเอียดทรัพย์
                      </label>
                      <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">
                        {selectedTransaction.assetDetail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ข้อมูลการเงิน */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                    <CircleDollarSign className="w-4 h-4 text-slate-500" />
                    <span>ข้อมูลการเงิน</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ยอดคงเหลือ
                      </label>
                      <p className="text-sm text-slate-800 mt-1 font-semibold">
                        {selectedTransaction.remainingAmount.toLocaleString()}{" "}
                        บาท
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ดอกเบี้ย
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.interestAmount.toLocaleString()}{" "}
                        บาท
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        ดอกเบี้ยรายเดือน
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.monthlyInterest.toLocaleString()}{" "}
                        บาท
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        จำนวนวันเกินกำหนด
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.overdueDays} วัน
                      </p>
                    </div>
                  </div>
                </div>

                {/* ข้อมูลวันที่ */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>ข้อมูลวันที่</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        วันที่ทำธุรกรรม
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {formatDateOnly(selectedTransaction.transactionDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        วันที่ชำระดอกเบี้ย
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.interestPaymentDate
                          ? formatDateOnly(
                              selectedTransaction.interestPaymentDate
                            )
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        วันที่ไถ่ถอน
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {selectedTransaction.redeemedDate
                          ? formatDateOnly(selectedTransaction.redeemedDate)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
