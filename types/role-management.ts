/**
 * Types สำหรับ Role Management
 * รวม interfaces และ types ที่ใช้ในระบบจัดการบทบาทและสิทธิ์
 */

// Import shared types
import { Permission, MenuPermission, Branch } from "./auth";

// ===== ROLE MANAGEMENT SPECIFIC TYPES =====
export interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  menuPermissions: MenuPermission[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: number[]; // Array of permission IDs
  menuPermissions: number[]; // Array of menu permission IDs
  branches: number[]; // Array of branch IDs
}

export interface UpdateRoleData extends CreateRoleData {
  id: number;
}

export interface RoleFormData {
  name: string;
  description: string;
  selectedPermissions: number[];
  selectedMenuPermissions: number[];
  selectedBranches: number[];
}

// ===== PERMISSION MANAGEMENT TYPES =====
export interface PermissionGroup {
  groupName: string;
  permissions: Permission[];
}

export interface MenuPermissionGroup {
  menuName: string;
  permissions: MenuPermission[];
}
