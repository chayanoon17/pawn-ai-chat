"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import apiClient from "@/lib/api";
import { UnreadCountResponse } from "@/types";
import { useAuth } from "./auth-context";

/**
 * Notification Context Interface
 */
interface NotificationContextType {
  unreadCount: number;
  isLoading: boolean;
  refreshUnreadCount: () => Promise<void>;
}

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

/**
 * Notification Provider Props
 */
interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Notification Provider Component
 * จัดการ notification count ใน global state
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load unread count from API
   * Only load if user is authenticated and has permission
   */
  const loadUnreadCount = useCallback(async () => {
    // Only load if user is authenticated
    if (!isAuthenticated || !user) {
      console.log(
        "🔄 [NotificationContext] Skipping load - user not authenticated"
      );
      setUnreadCount(0);
      return;
    }

    // Only load for Super Admin and Admin
    const canViewNotifications =
      user.role.name === "Super Admin" || user.role.name === "Admin";

    if (!canViewNotifications) {
      console.log(
        "🔄 [NotificationContext] Skipping load - user lacks permission"
      );
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      console.log("🔄 [NotificationContext] Loading unread count...");

      const response = await apiClient.get<UnreadCountResponse>(
        "/api/v1/notifications/unread-count"
      );

      console.log(
        "✅ [NotificationContext] Unread count response:",
        response.data
      );

      if (response.status === "success" && response.data) {
        const count = response.data.unreadCount || 0;
        console.log("📊 [NotificationContext] Setting unread count to:", count);
        setUnreadCount(count);
      } else {
        console.warn(
          "⚠️ [NotificationContext] Invalid unread count API response"
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error(
        "❌ [NotificationContext] Error loading unread count:",
        error
      );
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Refresh unread count function (exposed to consumers)
   */
  const refreshUnreadCount = useCallback(async () => {
    await loadUnreadCount();
  }, [loadUnreadCount]);

  /**
   * Auto-load unread count เมื่อ authentication state เปลี่ยน
   * และ setup periodic refresh
   */
  useEffect(() => {
    // Load when authentication state changes
    loadUnreadCount();

    // Setup periodic refresh only if authenticated
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        loadUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [loadUnreadCount, isAuthenticated, user]);

  const contextValue: NotificationContextType = {
    unreadCount,
    isLoading,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Custom Hook สำหรับใช้ Notification Context
 */
export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }

  return context;
}

export default NotificationProvider;
