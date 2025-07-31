/**
 * Menu Permission Management Hooks
 */

import { useAuth } from "@/context/auth-context";
import { useMemo } from "react";

/**
 * Hook สำหรับตรวจสอบ Permission ของผู้ใช้งาน
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการทำงานที่ระบุหรือไม่
   */
  const hasPermission = (action: string): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    return user.role.permissions.some(
      (permission) => permission.name === action
    );
  };

  /**
   * ตรวจสอบว่าผู้ใช้เป็น Super Admin หรือไม่
   */
  const isSuperAdmin = (): boolean => {
    return user?.role?.name === "Super Admin";
  };

  /**
   * ตรวจสอบว่าผู้ใช้เป็น Admin (Super Admin หรือ Admin) หรือไม่
   */
  const isAdmin = (): boolean => {
    return user?.role?.name === "Super Admin" || user?.role?.name === "Admin";
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์จัดการ Permission หรือไม่
   * (เฉพาะ Super Admin เท่านั้น)
   */
  const canManagePermissions = (): boolean => {
    return isSuperAdmin();
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์จัดการ Menu Permission หรือไม่
   * (Super Admin และ Admin สามารถจัดการได้)
   */
  const canManageMenuPermissions = (): boolean => {
    return isAdmin();
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์จัดการ Role หรือไม่
   */
  const canManageRoles = (): boolean => {
    return (
      hasPermission("CREATE:Role") ||
      hasPermission("UPDATE:Role") ||
      hasPermission("DELETE:Role")
    );
  };

  return {
    user,
    hasPermission,
    isSuperAdmin,
    isAdmin,
    canManagePermissions,
    canManageMenuPermissions,
    canManageRoles,
  };
}

/**
 * Hook สำหรับตรวจสอบ Menu Permission ของผู้ใช้งาน
 */
export function useMenuPermissions() {
  const { user, isAuthenticated } = useAuth();

  const userMenuPermissions = useMemo(() => {
    if (!user?.role?.menuPermissions) return [];
    // Backend response has 'menu' field, not 'menuName'
    return user.role.menuPermissions.map((mp: any) => mp.menu as String);
  }, [user?.role?.menuPermissions]);

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูนี้หรือไม่
   */
  const hasMenuPermission = (menuPermission: String): boolean => {
    if (!isAuthenticated || !user) return false;
    return userMenuPermissions.includes(menuPermission);
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูใดๆ จาก array ที่กำหนด
   */
  const hasAnyMenuPermission = (menuPermissions: String[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return menuPermissions.some((permission) => hasMenuPermission(permission));
  };

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูทั้งหมดใน array หรือไม่
   */
  const hasAllMenuPermissions = (menuPermissions: String[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return menuPermissions.every((permission) => hasMenuPermission(permission));
  };

  /**
   * ดึงรายการเมนูที่ผู้ใช้มีสิทธิ์เข้าถึง
   */
  const getAccessibleMenus = (): String[] => {
    return userMenuPermissions;
  };

  /**
   * ตรวจสอบว่าผู้ใช้สามารถเข้าถึงหน้านี้ได้หรือไม่ (alias)
   */
  const canAccessPage = (menuPermission: String): boolean => {
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
export function useRequireMenuPermission(requiredMenuPermission: String) {
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
