/**
 * Menu Permission Guard Components
 */

import React from "react";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/context/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ShieldX } from "lucide-react";

interface MenuPermissionGuardProps {
  children: React.ReactNode;
  requiredMenuPermission: string;
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

interface AnyMenuPermissionGuardProps {
  children: React.ReactNode;
  requiredMenuPermissions: string[];
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

/**
 * MenuPermissionGuard - ห่อหุ้ม component ที่ต้องการสิทธิ์เข้าถึงเมนู
 */
export function MenuPermissionGuard({
  children,
  requiredMenuPermission,
  fallback,
  showAlert = true,
}: MenuPermissionGuardProps) {
  const { hasMenuPermission, isAuthenticated } = useMenuPermissions();
  const { isLoading } = useAuth();

  // แสดง Loading state ขณะที่กำลังตรวจสอบ authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback ||
      (showAlert ? (
        <Alert className="border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้
          </AlertDescription>
        </Alert>
      ) : null)
    );
  }

  if (!hasMenuPermission(requiredMenuPermission)) {
    return (
      fallback ||
      (showAlert ? (
        <Alert className="border-red-200 bg-red-50">
          <ShieldX className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (ต้องการสิทธิ์:{" "}
            {requiredMenuPermission})
          </AlertDescription>
        </Alert>
      ) : null)
    );
  }

  return <>{children}</>;
}

/**
 * AnyMenuPermissionGuard - ต้องการสิทธิ์อย่างน้อย 1 สิทธิ์จาก array ที่กำหนด
 */
export function AnyMenuPermissionGuard({
  children,
  requiredMenuPermissions,
  fallback,
  showAlert = true,
}: AnyMenuPermissionGuardProps) {
  const { hasAnyMenuPermission, isAuthenticated } = useMenuPermissions();
  const { isLoading } = useAuth();

  // แสดง Loading state ขณะที่กำลังตรวจสอบ authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback ||
      (showAlert ? (
        <Alert className="border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้
          </AlertDescription>
        </Alert>
      ) : null)
    );
  }

  if (!hasAnyMenuPermission(requiredMenuPermissions)) {
    return (
      fallback ||
      (showAlert ? (
        <Alert className="border-red-200 bg-red-50">
          <ShieldX className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (ต้องการสิทธิ์อย่างน้อย 1 จาก:{" "}
            {requiredMenuPermissions.join(", ")})
          </AlertDescription>
        </Alert>
      ) : null)
    );
  }

  return <>{children}</>;
}
