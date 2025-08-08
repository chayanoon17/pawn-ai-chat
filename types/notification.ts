// 📊 Notification Types

export interface NotificationItem {
  id: number;
  type:
    | "EXPORT_REPORT"
    | "SYSTEM_ALERT"
    | "USER_ACTION"
    | "MAINTENANCE"
    | "SECURITY";
  title: string;
  message: string;
  metadata?: any;
  isRead: boolean;
  readAt: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt: string;
  updatedAt: string;
  relatedUser?: {
    id: number;
    fullName: string;
    email: string;
  };
}

// Raw notification interface for API response that might have different types
export interface RawNotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  metadata?: any;
  isRead: boolean;
  readAt: string | null;
  priority: string;
  createdAt: string;
  updatedAt: string;
  relatedUser?: {
    id: number;
    fullName: string;
    email: string;
  };
}

// API Response interfaces
export interface NotificationResponse {
  notifications: NotificationItem[];
  totalCount: number;
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// Type guards and utility types
export type NotificationType = NotificationItem["type"];
export type NotificationPriority = NotificationItem["priority"];

// Helper function to convert raw notification to typed notification
export const convertRawNotification = (
  raw: RawNotificationItem
): NotificationItem => {
  return {
    ...raw,
    type: raw.type as NotificationItem["type"],
    priority: raw.priority as NotificationItem["priority"],
  };
};
