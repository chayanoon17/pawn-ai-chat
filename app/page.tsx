"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { LoadingScreen } from "@/components/ui/loading-screen";

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
            : firstMenu === "User Management"
            ? "/users"
            : firstMenu === "Role Management"
            ? "/roles"
            : firstMenu === "Activity Logs"
            ? "/logs"
            : "/welcome"; // fallback
      }

      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, userMenuPermissions, router]);

  // Loading state while checking authentication
  return <LoadingScreen message="กำลังตรวจสอบสถานะ..." size="lg" />;
}
