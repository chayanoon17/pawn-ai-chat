"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { ProtectedLayout } from "@/components/layouts/protected-layout";

export default function ApiTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuperAdmin } = usePermissions();

  // ตรวจสอบ environment variable
  const isApiTesterEnabled =
    process.env.NEXT_PUBLIC_ENABLE_API_TESTER === "true";

  // ตรวจสอบว่าเป็น Super Admin และ feature เปิดใช้งาน
  if (!isSuperAdmin() || !isApiTesterEnabled) {
    return (
      <ProtectedLayout selectedPage="api-tester">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่สามารถเข้าถึงได้
            </h2>
            <p className="text-gray-600 mb-4">
              {!isSuperAdmin()
                ? "คุณต้องเป็น Super Admin เพื่อเข้าถึงหน้านี้"
                : "ฟีเจอร์นี้ถูกปิดใช้งาน"}
            </p>
            <p className="text-sm text-gray-500">
              กรุณาติดต่อผู้ดูแลระบบหากคุณต้องการใช้งานฟีเจอร์นี้
            </p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout selectedPage="api-tester">{children}</ProtectedLayout>
  );
}
