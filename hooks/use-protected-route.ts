/**
 * Protected Route Hook
 * Custom Hook สำหรับป้องกันหน้าที่ต้องการการยืนยันตัวตน
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

/**
 * Options สำหรับการกำหนดค่า Protected Route
 */
interface UseProtectedRouteOptions {
  /** หน้าที่จะ redirect ไปเมื่อไม่ได้ login (default: "/login") */
  redirectTo?: string;
  /** ข้อความที่แสดงขณะตรวจสอบ authentication (default: "Checking authentication...") */
  loadingMessage?: string;
  /** ข้อความที่แสดงขณะ redirect (default: "Redirecting to login...") */
  redirectMessage?: string;
}

/**
 * Return type ของ useProtectedRoute hook
 */
interface UseProtectedRouteReturn {
  /** สถานะการ login */
  isAuthenticated: boolean;
  /** สถานะการโหลด */
  isLoading: boolean;
  /** ข้อมูลผู้ใช้ */
  user: any;
  /** ข้อความที่ควรแสดง */
  message: string;
  /** ควร render component หรือไม่ */
  shouldRender: boolean;
}

/**
 * Custom Hook สำหรับ Protected Routes
 *
 * @param options ตัวเลือกสำหรับการกำหนดค่า
 * @returns ข้อมูลสถานะและการควบคุมการแสดงผล
 *
 * @example
 * ```tsx
 * export default function DashboardPage() {
 *   const { shouldRender, message } = useProtectedRoute();
 *
 *   if (!shouldRender) {
 *     return <div>{message}</div>;
 *   }
 *
 *   return <div>Dashboard Content</div>;
 * }
 * ```
 */
export function useProtectedRoute(
  options: UseProtectedRouteOptions = {}
): UseProtectedRouteReturn {
  const {
    redirectTo = "/login",
    loadingMessage = "กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...",
    redirectMessage = "กำลังนำทางไปยังหน้าเข้าสู่ระบบ...",
  } = options;

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  /**
   * ตรวจสอบและ redirect ถ้าจำเป็น
   */
  useEffect(() => {
    // รอให้การตรวจสอบ authentication เสร็จสิ้น
    if (isLoading) return;

    // ถ้าไม่ได้ login ให้ redirect
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  /**
   * กำหนดข้อความที่ควรแสดง
   */
  let message = "";
  if (isLoading) {
    message = loadingMessage;
  } else if (!isAuthenticated) {
    message = redirectMessage;
  }

  /**
   * กำหนดว่าควร render component หรือไม่
   */
  const shouldRender = !isLoading && isAuthenticated;

  return {
    isAuthenticated,
    isLoading,
    user,
    message,
    shouldRender,
  };
}

/**
 * Export สำหรับใช้งาน
 */
export default useProtectedRoute;
