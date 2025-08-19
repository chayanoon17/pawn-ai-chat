"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  CheckCheck,
  AlertTriangle,
  Info,
  Shield,
  Settings,
  FileText,
  Clock,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiClient from "@/lib/api-client";
import { useNotificationContext } from "@/context/notification-context";
import {
  NotificationItem,
  RawNotificationItem,
  NotificationResponse,
  convertRawNotification,
} from "@/types";

// 🎨 Helper Functions
const getNotificationIcon = (
  type: NotificationItem["type"],
  priority: NotificationItem["priority"]
) => {
  const iconSize = "w-4 h-4";

  switch (type) {
    case "EXPORT_REPORT":
      return <FileText className={`${iconSize} text-blue-500`} />;
    case "SYSTEM_ALERT":
      return priority === "URGENT" ? (
        <AlertTriangle className={`${iconSize} text-red-500`} />
      ) : (
        <Info className={`${iconSize} text-orange-500`} />
      );
    case "USER_ACTION":
      return <Eye className={`${iconSize} text-green-500`} />;
    case "MAINTENANCE":
      return <Settings className={`${iconSize} text-gray-500`} />;
    case "SECURITY":
      return <Shield className={`${iconSize} text-purple-500`} />;
    default:
      return <Bell className={`${iconSize} text-gray-500`} />;
  }
};

const getPriorityColor = (priority: NotificationItem["priority"]) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-800 border-red-200";
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "MEDIUM":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "LOW":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMs = now.getTime() - time.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "เมื่อสักครู่";
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
  if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

  return time.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function NotificationDropdown() {
  // 🌐 Use global notification context
  const { unreadCount, refreshUnreadCount } = useNotificationContext();

  // 📊 Local State (เฉพาะ component นี้)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 🔄 Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<NotificationResponse>(
        "/api/v1/notifications?limit=10"
      );
      // API returns: { status: "success", message: "...", data: {...} }
      if (response.status === "success" && response.data?.notifications) {
        const { notifications, totalCount } = response.data;

        if (Array.isArray(notifications)) {
          // Convert raw notifications to typed notifications
          const typedNotifications = notifications.map(
            (raw: RawNotificationItem) => convertRawNotification(raw)
          );

          setNotifications(typedNotifications);

          // Refresh unread count from context
          refreshUnreadCount();
        } else {
          console.warn("⚠️ No notifications array found in response");
          setNotifications([]);
        }
      } else {
        console.warn("⚠️ Invalid API response structure");
        console.warn("⚠️ Response:", response.data);
        setNotifications([]);
      }
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      await apiClient.put(`/api/v1/notifications/${notificationId}/read`);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );

      // Refresh unread count from context
      refreshUnreadCount();
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  // 🎯 Mark all as read
  const markAllAsRead = async () => {
    try {
      await apiClient.put("/api/v1/notifications/mark-all-read");

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }))
      );

      // Refresh unread count from context
      refreshUnreadCount();
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
    }
  };

  // 🎯 View notification detail
  const viewDetail = async (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setDetailDialogOpen(true);

    // Mark as read if not already read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  // 🗑️ Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      setIsDeleting(true);
      await apiClient.delete(`/api/v1/notifications/${notificationId}`);

      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Refresh unread count from context
      refreshUnreadCount();

      // Close dialogs
      setDeleteDialogOpen(false);
      setDetailDialogOpen(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 🔄 Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative p-2 h-9 w-9">
            {unreadCount > 0 ? (
              <BellRing className="w-4 h-4 text-orange-600" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[420px] max-w-[95vw] p-0"
          align="end"
          sideOffset={5}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <DropdownMenuLabel className="text-sm font-medium">
              การแจ้งเตือน
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7 px-2"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                อ่านทั้งหมด
              </Button>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">ไม่มีการแจ้งเตือน</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadNotifications}
                  className="mt-2 text-xs"
                >
                  รีเฟรช
                </Button>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 mb-2 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.isRead
                        ? "bg-blue-50 border-blue-100"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => viewDetail(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(
                          notification.type,
                          notification.priority
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <p className="text-sm font-medium text-gray-900 flex-1 leading-tight">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={`text-xs whitespace-nowrap ${getPriorityColor(
                                notification.priority
                              )}`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-2 break-words leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </span>

                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    // Navigate to notifications page if exists
                    setIsOpen(false);
                  }}
                >
                  ดูการแจ้งเตือนทั้งหมด
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedNotification &&
                getNotificationIcon(
                  selectedNotification.type,
                  selectedNotification.priority
                )}
              <span>รายละเอียดการแจ้งเตือน</span>
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedNotification?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              {/* Priority & Type */}
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={getPriorityColor(selectedNotification.priority)}
                >
                  {selectedNotification.priority}
                </Badge>
                <Badge variant="outline">
                  {selectedNotification.type.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  ข้อความ
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Metadata */}
              {selectedNotification.metadata && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ข้อมูลเพิ่มเติม
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(selectedNotification.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Related User */}
              {selectedNotification.relatedUser && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ผู้เกี่ยวข้อง
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedNotification.relatedUser.fullName} (
                    {selectedNotification.relatedUser.email})
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <p className="font-medium">วันที่สร้าง</p>
                  <p>
                    {new Date(selectedNotification.createdAt).toLocaleString(
                      "th-TH"
                    )}
                  </p>
                </div>
                {selectedNotification.readAt && (
                  <div>
                    <p className="font-medium">วันที่อ่าน</p>
                    <p>
                      {new Date(selectedNotification.readAt).toLocaleString(
                        "th-TH"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dialog Footer with Delete Button */}
          {selectedNotification && (
            <DialogFooter className="flex items-center justify-between pt-4 border-t">
              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>ลบการแจ้งเตือน</span>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการลบการแจ้งเตือน</AlertDialogTitle>
                    <AlertDialogDescription>
                      คุณต้องการลบการแจ้งเตือนนี้หรือไม่?
                      การดำเนินการนี้ไม่สามารถย้อนกลับได้
                      <br />
                      <br />
                      <strong>&quot;{selectedNotification.title}&quot;</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteNotification(selectedNotification.id)
                      }
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          กำลังลบ...
                        </>
                      ) : (
                        "ลบการแจ้งเตือน"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDetailDialogOpen(false)}
              >
                ปิด
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
