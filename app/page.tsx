"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth();
  const { userMenuPermissions } = useMenuPermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // หาก login แล้วแต่ไม่มีสิทธิ์เข้าถึงเมนูใดๆ
      if (userMenuPermissions.length === 0) {
        router.push("/welcome");
        return;
      }

      // Redirect ไปเมนูแรกที่มีสิทธิ์เข้าถึง
      let redirectPath = "";
      if (userMenuPermissions.includes("Dashboard")) {
        redirectPath = "/dashboard";
      } else {
        const firstMenu = userMenuPermissions[0];
        redirectPath =
          firstMenu === "Asset Types"
            ? "/asset-types"
            : firstMenu === "Users Management"
            ? "/users"
            : firstMenu === "Roles Management"
            ? "/roles"
            : firstMenu === "Activity Logs"
            ? "/logs"
            : "/welcome"; // fallback
      }

      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, userMenuPermissions, router]);

  // Loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="text-gray-600">กำลังตรวจสอบสถานะ...</p>
      </div>
    </div>
  );
}
