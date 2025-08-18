/**
 * Authentication Service
 * จัดการ Authentication logic ทั้งหมด รวมถึงการเรียก API และการตรวจสอบสิทธิ์
 */

import apiClient from "./api";
import { User } from "@/types/auth";
import { LoginResponse } from "@/types/api";
import { PERMISSION_ACTIONS, MENU_NAMES } from "@/types/common";

/**
 * User Management API Functions
 */

export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  profileUrl?: string;
  branchId?: number | null; // เพิ่ม null เพื่อให้สามารถไม่ระบุสาขาได้
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
}) {
  const response = await apiClient.post("/api/v1/users", data);
  return response.data;
}

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  branchId?: number;
  roleId?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.branchId)
    queryParams.append("branchId", params.branchId.toString());
  if (params?.roleId) queryParams.append("roleId", params.roleId.toString());

  const url = `/api/v1/users${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const response = await apiClient.get(url);
  return response.data;
}

export async function getUserById(id: string) {
  const response = await apiClient.get(`/api/v1/users/${id}`);
  return response.data;
}

export async function updateUser(
  id: string,
  data: {
    fullName?: string;
    phoneNumber?: string;
    profileUrl?: string;
    password?: string;
    branchId?: number | null; // เพิ่ม null เพื่อให้สามารถเคลียร์ข้อมูลสาขาได้
    roleId?: number;
    status?:
      | "ACTIVE"
      | "INACTIVE"
      | "SUSPENDED"
      | "DELETED"
      | "PENDING_VERIFICATION";
  }
) {
  const response = await apiClient.put(`/api/v1/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await apiClient.delete(`/api/v1/users/${id}`);
  return response.data;
}

export async function getUserPermissions(id: string) {
  const response = await apiClient.get(`/api/v1/users/${id}/permissions`);
  return response.data;
}

export async function updateUserRole(id: string, roleId: number) {
  const response = await apiClient.put(`/api/v1/users/${id}/role`, { roleId });
  return response.data;
}

// Legacy function for backward compatibility
export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  branch: number;
  role: number;
  status: string;
}) {
  return createUser({
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    branchId: data.branch,
    roleId: data.role,
    status: data.status as "ACTIVE" | "INACTIVE",
  });
}

/**
 * Login Credentials Interface
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * เข้าสู่ระบบด้วย email และ password
   * httpOnly Cookie จะถูกตั้งค่าอัตโนมัติโดย backend
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // เรียก API login endpoint - ใช้ postAuth สำหรับ auth endpoints
      const response = await apiClient.postAuth<LoginResponse>(
        "/api/auth/login",
        credentials
      );

      // เก็บ access token ใน localStorage สำหรับการใช้งานต่อไป
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("❌ Login failed:", error);
      }

      throw error;
    }
  }

  /**
   * ออกจากระบบ
   * Token จะถูกเพิ่มใน blacklist และ httpOnly Cookie จะถูกลบ
   */
  async logout(): Promise<void> {
    try {
      // เรียก API logout endpoint - ใช้ postAuth สำหรับ auth endpoints
      await apiClient.postAuth("/api/auth/logout");

      // ลบ access token จาก localStorage
      localStorage.removeItem("accessToken");
    } catch (error) {
      // Log warning แต่ไม่ throw error เพราะ logout ควรสำเร็จเสมอใน frontend
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.warn(
          "⚠️ Logout API failed, but continuing with local logout:",
          error
        );
      }

      // ลบ access token แม้ API fail
      localStorage.removeItem("accessToken");

      // ไม่ throw error เพราะแม้ API fail เราก็ควร clear local state
    }
  }

  /**
   * ดึงข้อมูลผู้ใช้ปัจจุบันจาก API
   * ใช้สำหรับตรวจสอบการยืนยันตัวตนและดึงข้อมูลล่าสุด
   */
  async getCurrentUser(): Promise<User> {
    try {
      // เรียก API เพื่อดึงข้อมูลผู้ใช้ปัจจุบัน - ใช้ getAuth สำหรับ auth endpoints
      const response = await apiClient.getAuth<User>("/api/auth/me");

      return response.data;
    } catch (error) {
      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("❌ Failed to fetch current user:", error);
      }

      throw error;
    }
  }

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการทำงานที่ระบุหรือไม่
   */
  hasPermission(user: User | null, action: string): boolean {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    // ตรวจสอบว่ามี permission ที่ตรงกับ action ที่ต้องการหรือไม่
    const hasPermission = user.role.permissions.some(
      (permission) => permission.name === action
    );

    // Log ใน development mode
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🔍 Permission check:", {
        action,
        hasPermission,
        userRole: user.role.name,
      });
    }

    return hasPermission;
  }

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงเมนูที่ระบุหรือไม่
   */
  hasMenuAccess(user: User | null, menuName: string): boolean {
    if (!user || !user.role || !user.role.menuPermissions) {
      return false;
    }

    // ตรวจสอบว่ามี menu permission ที่ตรงกับ menuName ที่ต้องการหรือไม่
    const hasAccess = user.role.menuPermissions.some(
      (menuPermission) => menuPermission.name === menuName
    );

    // Log ใน development mode
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🔍 Menu access check:", {
        menuName,
        hasAccess,
        userRole: user.role.name,
      });
    }

    return hasAccess;
  }

  /**
   * Helper methods สำหรับตรวจสอบสิทธิ์เฉพาะ
   */

  /**
   * ตรวจสอบว่าเป็น Admin หรือไม่
   */
  isAdmin(user: User | null): boolean {
    return user?.role?.name === "Super Admin" || user?.role?.name === "Admin";
  }

  /**
   * ตรวจสอบสิทธิ์การจัดการผู้ใช้
   */
  canManageUsers(user: User | null): boolean {
    return this.hasMenuAccess(user, MENU_NAMES.USER_MANAGEMENT);
  }

  /**
   * ตรวจสอบสิทธิ์การดูรายงาน
   */
  canViewReports(user: User | null): boolean {
    return this.hasPermission(user, PERMISSION_ACTIONS.READ_REPORT);
  }

  /**
   * ตรวจสอบสิทธิ์การส่งออกข้อมูล
   */
  canExportData(user: User | null): boolean {
    return this.hasPermission(user, PERMISSION_ACTIONS.EXPORT_REPORT);
  }
}

/**
 * Singleton Instance - ใช้ instance เดียวทั่วทั้งแอพ
 */
const authService = new AuthService();

export default authService;
