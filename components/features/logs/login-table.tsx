"use client";

import { useEffect, useState } from "react";
import { getActivityLogs } from "@/lib/api";
import { usePermissions } from "@/hooks/use-permissions";
import { ActivityLog } from "@/types/api";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Eye,
  LogIn,
  User,
  Calendar,
  MapPin,
  Monitor,
  Shield,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function LoginTable() {
  const { user } = useAuth(); // เพิ่ม useAuth เพื่อเช็ค role
  const { isSuperAdmin, isAdmin } = usePermissions();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);

        // ตรวจสอบ role ของ user
        // ถ้าเป็น Super Admin หรือ Admin จะไม่ส่ง userId (ดูได้ทั้งหมด)
        // ถ้าไม่ใช่จะส่ง userId เพื่อดูแค่ข้อมูลของตัวเอง
        const isAdminRole = isSuperAdmin() || isAdmin();
        const targetUserId = isAdminRole
          ? null
          : user?.id
          ? String(user.id)
          : null;

        console.log("🔍 Fetching logs for user:", targetUserId);

        // Fetch ข้อมูลทั้งหมดแล้วค่อย paginate ที่ frontend
        // ใช้ page size ใหญ่เพื่อให้ได้ข้อมูลทั้งหมด
        const pageSize = 100; // เพิ่มขนาดให้ใหญ่ขึ้นเพื่อให้ได้ข้อมูลทั้งหมด
        const [loginRes, logoutRes] = await Promise.all([
          getActivityLogs({
            page: 1,
            limit: pageSize,
            activity: "LOGIN",
            userId: targetUserId,
          }),
          getActivityLogs({
            page: 1,
            limit: pageSize,
            activity: "LOGOUT",
            userId: targetUserId,
          }),
        ]);

        // รวมข้อมูล LOGIN และ LOGOUT แล้วเรียงตามวันที่
        const allLogs = [
          ...loginRes.activityLogs,
          ...logoutRes.activityLogs,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // ใช้ pagination info จาก API response
        // รวม total จาก LOGIN และ LOGOUT
        const totalCombinedItems =
          (loginRes.total || 0) + (logoutRes.total || 0);
        const calculatedTotalPages = Math.ceil(
          totalCombinedItems / itemsPerPage
        );

        // Slice ข้อมูลตาม page ปัจจุบัน
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedLogs = allLogs.slice(startIndex, endIndex);

        setTotalItems(totalCombinedItems);
        setTotalPages(calculatedTotalPages);
        setLogs(paginatedLogs);
      } catch (err) {
        console.error("Request failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, user]); // เมื่อ currentPage หรือ user เปลี่ยนให้ fetch ข้อมูลใหม่

  // Filter logs based on search term
  const filteredLogs = logs.filter(
    (log) =>
      log.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case "LOGIN":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            เข้าสู่ระบบ
          </Badge>
        );
      case "LOGOUT":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ออกจากระบบ
          </Badge>
        );
      default:
        return <Badge variant="outline">{activity}</Badge>;
    }
  };

  return (
    <>
      {/* 🔍 Search and Filter Section */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="px-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <LogIn className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-800">
                  ประวัติการเข้าสู่ระบบ
                </CardTitle>
                <p className="text-sm text-slate-500">
                  รายการการเข้าสู่ระบบและออกจากระบบของผู้ใช้
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="ค้นหาผู้ใช้หรือกิจกรรม..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {/* Table Header Skeleton */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-4">
                  <div className="grid grid-cols-7 gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                {/* Table Rows Skeleton */}
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="p-4">
                      <div className="grid grid-cols-7 gap-4 items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">
                      ชื่อผู้ใช้
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 hidden sm:table-cell">
                      อีเมล
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      กิจกรรม
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      วันที่และเวลา
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 hidden md:table-cell">
                      IP Address
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-slate-500"
                      >
                        ไม่มีข้อมูลการเข้าสู่ระบบ
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-800">
                          {log.user.fullName}
                        </TableCell>
                        <TableCell className="text-slate-600 hidden sm:table-cell">
                          {log.user.email}
                        </TableCell>
                        <TableCell>{getActivityBadge(log.activity)}</TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(log.createdAt).toLocaleString("th-TH", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </TableCell>
                        <TableCell className="text-slate-600 font-mono text-sm hidden md:table-cell">
                          {log.ipAddress || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedLog(log);
                                setIsViewDialogOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:bg-slate-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-500">
                แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} จาก{" "}
                {totalItems} รายการ
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="text-slate-600 border-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  ก่อนหน้า
                </Button>

                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "text-slate-600 border-slate-300"
                          }
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      (page === currentPage - 2 && page > 1) ||
                      (page === currentPage + 2 && page < totalPages)
                    ) {
                      return (
                        <span key={page} className="text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="text-slate-600 border-slate-300"
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <LogIn className="w-5 h-5 text-blue-600" />
              <span>รายละเอียดการเข้าสู่ระบบ</span>
            </DialogTitle>
            <DialogDescription>
              ข้อมูลรายละเอียดของการเข้าสู่ระบบ
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              {/* ข้อมูลผู้ใช้ */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>ข้อมูลผู้ใช้</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      ชื่อผู้ใช้
                    </label>
                    <p className="text-sm text-slate-800 mt-1 font-medium">
                      {selectedLog.user.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      อีเมล
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedLog.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* ข้อมูลการเข้าสู่ระบบ */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>ข้อมูลการเข้าสู่ระบบ</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      กิจกรรม
                    </label>
                    <div className="mt-1">
                      {getActivityBadge(selectedLog.activity)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>วันที่และเวลา</span>
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {new Date(selectedLog.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>IP Address</span>
                    </label>
                    <p className="text-sm text-slate-800 mt-1 font-mono">
                      {selectedLog.ipAddress || "ไม่ระบุ"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                      <Monitor className="w-3 h-3" />
                      <span>อุปกรณ์</span>
                    </label>
                    <p className="text-sm text-slate-800 mt-1 break-all">
                      {selectedLog.userAgent || "ไม่ระบุ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
