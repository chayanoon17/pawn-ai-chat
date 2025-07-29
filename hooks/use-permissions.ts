/**
 * Menu Permission Management Hooks
 */

import { useAuth } from "@/context/auth-context";
import { useMemo } from "react";
import type { MenuPermission } from "@/lib/permissions";

/**
 * Hook สำหรับตรวจสอบ Menu Permission ของผู้ใช้งาน
 */
export function useMenuPermissions() {
  const { user, isAuthenticated } = useAuth();

  const userMenuPermissions = useMemo(() => {
    if (!user?.role?.menuPermissions) return [];
    // Backend response has 'menu' field, not 'menuName'
    return user.role.menuPermissions.map(
      (mp: any) => mp.menu as MenuPermission
    );
  }, [user?.role?.menuPermissions]);

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูนี้หรือไม่
   */
  const hasMenuPermission = (menuPermission: MenuPermission): boolean => {
    if (!isAuthenticated || !user) return false;
    return userMenuPermissions.includes(menuPermission);
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูใดๆ จาก array ที่กำหนด
   */
  const hasAnyMenuPermission = (menuPermissions: MenuPermission[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return menuPermissions.some((permission) => hasMenuPermission(permission));
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูทั้งหมดใน array หรือไม่
   */
  const hasAllMenuPermissions = (
    menuPermissions: MenuPermission[]
  ): boolean => {
    if (!isAuthenticated || !user) return false;
    return menuPermissions.every((permission) => hasMenuPermission(permission));
  };

  /**
   * ดึงรายการเมนูที่ผู้ใช้มีสิทธิ์เข้าถึง
   */
  const getAccessibleMenus = (): MenuPermission[] => {
    return userMenuPermissions;
  };

  /**
   * ตรวจสอบว่าผู้ใช้สามารถเข้าถึงหน้านี้ได้หรือไม่ (alias)
   */
  const canAccessPage = (menuPermission: MenuPermission): boolean => {
    return hasMenuPermission(menuPermission);
  };

  return {
    // Status
    isAuthenticated,
    user,
    userMenuPermissions,

    // Menu Permission Checks
    hasMenuPermission,
    hasAnyMenuPermission,
    hasAllMenuPermissions,
    canAccessPage,

    // Utilities
    getAccessibleMenus,
  };
}

/**
 * Hook สำหรับป้องกันหน้าที่ต้องการ Menu Permission
 */
export function useRequireMenuPermission(
  requiredMenuPermission: MenuPermission
) {
  const { hasMenuPermission, isAuthenticated } = useMenuPermissions();

  const canAccess = useMemo(() => {
    return isAuthenticated && hasMenuPermission(requiredMenuPermission);
  }, [isAuthenticated, hasMenuPermission, requiredMenuPermission]);

  return {
    canAccess,
    isAuthenticated,
    requiredMenuPermission,
  };
}

// Export types
export type { MenuPermission };
