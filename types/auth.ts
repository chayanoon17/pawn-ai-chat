/**
 * Authentication Types
 * รวม interface และ types สำหรับระบบ Authentication และ User Management
 */

import { UserStatus } from "./common";

/**
 * Permission Interface - สิทธิ์การทำงานแต่ละรายการ (ตาม API format)
 */
export interface Permission {
  id: number;
  name: string; // เช่น "CREATE:User", "READ:Report"
  description: string; // คำอธิบายสิทธิ์
}

/**
 * Menu Permission Interface - สิทธิ์เข้าถึงเมนูแต่ละรายการ (ตาม API format)
 */
export interface MenuPermission {
  id: number;
  name: string; // เช่น "User Management", "Reports"
  description: string; // คำอธิบายเมนู
}

/**
 * Branch Interface - สาขาที่ใช้ในระบบ
 */
export interface Branch {
  id: number;
  name: string;
  location: string;
  shortName: string;
}

/**
 * Role Interface - บทบาทของผู้ใช้ในระบบ
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  menuPermissions: MenuPermission[];
  userCount?: number; // จำนวนผู้ใช้ที่มีบทบาทนี้
}

/**
 * Branch Interface - ข้อมูลสาขา
 */
export interface Branch {
  id: number;
  name: string;
  shortName: string;
  location: string;
}

/**
 * User Interface - ข้อมูลผู้ใช้ในระบบ
 */
export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileUrl?: string;
  status: UserStatus;
  branchId: number;
  roleId: number;
  role: Role;
  branch: Branch;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth Context Type - Interface สำหรับ React Context ที่จัดการ Authentication
 */
export interface AuthContextType {
  /** State ปัจจุบัน */
  user: User | null; // ข้อมูลผู้ใช้ปัจจุบัน (null = ยังไม่ login)
  isAuthenticated: boolean; // สถานะการล็อกอิน
  isLoading: boolean; // สถานะการโหลด

  /** Actions ที่สามารถทำได้ */
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; // อัพเดทข้อมูลผู้ใช้ล่าสุด
  clearRememberMe: () => void; // ล้างข้อมูล remember me

  /** Helper functions สำหรับตรวจสอบสิทธิ์ */
  hasPermission: (action: string) => boolean;
  hasMenuAccess: (menuName: string) => boolean;
}

/**
 * Create User Payload Interface
 */
export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  profileUrl?: string;
  branchId?: number;
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
}
