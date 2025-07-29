/**
 * Types สำหรับ Role Management
 * รวม interfaces และ types ที่ใช้ในระบบจัดการบทบาทและสิทธิ์
 */

// ===== ROLE MANAGEMENT SPECIFIC TYPES =====
export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface MenuPermission {
  id: number;
  name: string;
  description: string;
  menu?: string;
}

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
  permissionIds: number[];
  menuPermissionIds: number[];
}

export interface UpdateRoleData extends CreateRoleData {
  id: number;
}

export interface RoleFormData {
  name: string;
  description: string;
  selectedPermissions: number[];
  selectedMenuPermissions: number[];
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
