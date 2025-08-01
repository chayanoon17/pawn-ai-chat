"use client";

import { useEffect, useState } from "react";
import { getUserConversations } from "@/lib/api";
import { usePermissions } from "@/hooks/use-permissions";
import { ConversationItem } from "@/types/api";
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
import {
  Search,
  Eye,
  MessageSquare,
  Calendar,
  Send,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  History,
  User,
} from "lucide-react";

export default function ChatTable() {
  const { user } = useAuth(); // เพิ่ม useAuth เพื่อเช็ค role
  const { isSuperAdmin, isAdmin } = usePermissions();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isChatHistoryDialogOpen, setIsChatHistoryDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationItem | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);

        // ตรวจสอบ role ของ user
        // ถ้าเป็น Super Admin หรือ Admin จะดูได้ทั้งหมด
        // ถ้าไม่ใช่จะดูแค่ข้อมูลของตัวเอง
        const isAdminRole = isSuperAdmin() || isAdmin();

        console.log(
          "🔍 Fetching conversations for user:",
          user?.email,
          "isAdmin:",
          isAdminRole
        );

        // Fetch ข้อมูลทั้งหมดแล้วค่อย paginate ที่ frontend
        // ใช้ page size ใหญ่เพื่อให้ได้ข้อมูลทั้งหมด
        const pageSize = 100; // เพิ่มขนาดให้ใหญ่ขึ้นเพื่อให้ได้ข้อมูลทั้งหมด

        // getUserConversations จะ filter ตาม email ของ user ที่ login อยู่แล้ว
        // ยกเว้น Admin ที่จะเห็นได้ทั้งหมด
        const data = await getUserConversations(1, pageSize);

        // เรียงตามวันที่ล่าสุด
        const allConversations = (data.conversations || []).sort(
          (a: ConversationItem, b: ConversationItem) =>
            new Date(b.lastMessageAt || b.createdAt).getTime() -
            new Date(a.lastMessageAt || a.createdAt).getTime()
        );

        // ใช้ข้อมูลจริงที่ได้มาคำนวณ pagination
        const totalCombinedItems = data.total || allConversations.length;
        const calculatedTotalPages = Math.ceil(
          totalCombinedItems / itemsPerPage
        );

        // Slice ข้อมูลตาม page ปัจจุบัน
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedConversations = allConversations.slice(
          startIndex,
          endIndex
        );

        setTotalItems(totalCombinedItems);
        setTotalPages(calculatedTotalPages);
        setConversations(paginatedConversations);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentPage, user]); // เมื่อ currentPage หรือ user เปลี่ยนให้ fetch ข้อมูลใหม่

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.conversationId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter((conv) => {
    const count =
      typeof conv.messageCount === "number"
        ? conv.messageCount
        : parseInt(String(conv.messageCount || 0));
    return count > 0;
  }).length;
  const totalMessages = conversations.reduce((total, conv) => {
    const count =
      typeof conv.messageCount === "number"
        ? conv.messageCount
        : parseInt(String(conv.messageCount || 0));
    return total + count;
  }, 0);

  return (
    <>
      {/* Main Card */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="px-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-80">
                ประวัติการสนทนา
              </CardTitle>
              <span className="text-sm text-slate-500">
                ติดตามบทสนทนาระหว่างผู้ใช้กับ Pawn AI
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="ค้นหาผู้ใช้, อีเมล, ID การสนทนา หรือโมเดล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500">กำลังโหลด...</div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">
                      ผู้ใช้
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 hidden sm:table-cell">
                      ID การสนทนา
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 hidden md:table-cell">
                      จำนวนข้อความ
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      โมเดล
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      อัปเดตล่าสุด
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {filteredConversations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-slate-500"
                      >
                        ไม่พบข้อมูลการสนทนา
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <TableRow
                        key={conversation.conversationId}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {conversation.fullName}
                              </div>
                              <div className="text-sm text-slate-500">
                                {conversation.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 hidden sm:table-cell">
                          <div className="text-sm font-mono max-w-xs truncate">
                            {conversation.conversationId}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {conversation.messageCount || 0} ข้อความ
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {conversation.model || "ไม่ระบุ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(
                            conversation.lastMessageAt || conversation.createdAt
                          ).toLocaleString("th-TH", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedConversation(conversation);
                                setIsViewDialogOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:bg-slate-100"
                              title="ดูรายละเอียด"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedConversation(conversation);
                                setIsChatHistoryDialogOpen(true);
                              }}
                              className="text-green-600 hover:text-green-800 hover:bg-slate-100"
                              title="ดูประวัติการสนทนา"
                            >
                              <History className="w-4 h-4" />
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

      {/* View Dialog - รายละเอียดการสนทนา */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>รายละเอียดห้องแชท</span>
            </DialogTitle>
            <DialogDescription>ข้อมูลรายละเอียดของห้องสนทนา</DialogDescription>
          </DialogHeader>

          {selectedConversation && (
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
                      {selectedConversation.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      อีเมล
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedConversation.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* ข้อมูลห้องแชท */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>ข้อมูลห้องแชท</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      ID ห้องแชท
                    </label>
                    <p className="text-sm text-slate-800 mt-1 font-mono">
                      {selectedConversation.conversationId}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      โมเดล AI
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedConversation.model || "ไม่ระบุ"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      จำนวนข้อความในห้อง
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedConversation.messageCount || 0} ข้อความ
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>สร้างห้องแชท</span>
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {new Date(
                          selectedConversation.createdAt
                        ).toLocaleString("th-TH")}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>อัปเดตล่าสุด</span>
                      </label>
                      <p className="text-sm text-slate-800 mt-1">
                        {new Date(
                          selectedConversation.lastMessageAt ||
                            selectedConversation.createdAt
                        ).toLocaleString("th-TH")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat History Dialog - ประวัติการสนทนา */}
      <Dialog
        open={isChatHistoryDialogOpen}
        onOpenChange={setIsChatHistoryDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-green-600" />
              <span>ประวัติการสนทนา</span>
            </DialogTitle>
            <DialogDescription>
              ประวัติการสนทนาทั้งหมดในห้องแชทนี้
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-4">
              {/* ข้อมูลห้องแชท */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {selectedConversation.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedConversation.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      ID: {selectedConversation.conversationId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedConversation.messageCount || 0} ข้อความ
                    </p>
                  </div>
                </div>
              </div>

              {/* ส่วนแสดงประวัติการสนทนา */}
              <div className="border border-slate-200 rounded-lg max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* แสดงข้อความตัวอย่าง - ในภายหลังจะต้องดึงข้อมูลจาก API */}
                  {selectedConversation.userQuestion && (
                    <>
                      {/* ข้อความจากผู้ใช้ */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-blue-600 text-white p-3 rounded-lg rounded-br-none">
                          <p className="text-sm">
                            {selectedConversation.userQuestion}
                          </p>
                          <p className="text-xs text-blue-100 mt-1">
                            {new Date(
                              selectedConversation.createdAt
                            ).toLocaleString("th-TH", {
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* ข้อความจาก AI */}
                      {selectedConversation.aiResponse && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] bg-slate-100 text-slate-800 p-3 rounded-lg rounded-bl-none">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-slate-500" />
                              <span className="text-xs font-medium text-slate-500">
                                {selectedConversation.model || "AI"}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {selectedConversation.aiResponse}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              {new Date(
                                selectedConversation.createdAt
                              ).toLocaleString("th-TH", {
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* แสดงข้อความเมื่อไม่มีข้อมูล */}
                  {!selectedConversation.userQuestion && (
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>ไม่มีข้อมูลการสนทนาในห้องนี้</p>
                      <p className="text-sm">
                        อาจเป็นห้องแชทที่ยังไม่ได้เริ่มการสนทนา
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ปุ่มดูข้อมูลเพิ่มเติม */}
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" className="text-slate-600">
                  <History className="w-4 h-4 mr-2" />
                  โหลดข้อความเพิ่มเติม
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
