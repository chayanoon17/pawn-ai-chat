/**
 * Common Types & Constants
 * รวม constants, enums และ shared types ที่ใช้ทั่วทั้งแอพ
 */

/**
 * Permission Actions - สิทธิ์การทำงานทั้งหมดตาม API Documentation
 * ใช้ as const เพื่อให้ TypeScript รู้ค่าที่แน่นอน
 */
export const PERMISSION_ACTIONS = {
  // User Management
  CREATE_USER: "CREATE:User",
  READ_USER: "READ:User",
  UPDATE_USER: "UPDATE:User",
  DELETE_USER: "DELETE:User",

  // Role Management
  CREATE_ROLE: "CREATE:Role",
  READ_ROLE: "READ:Role",
  UPDATE_ROLE: "UPDATE:Role",
  DELETE_ROLE: "DELETE:Role",

  // Reports
  READ_REPORT: "READ:Report",
  EXPORT_REPORT: "EXPORT:Report",

  // System
  SYNC_DATA: "SYNC:Data",
  SYSTEM_ADMIN: "SYSTEM:Admin",
} as const;

/**
 * Menu Names - เมนูทั้งหมดในระบบตาม API Documentation
 */
export const MENU_NAMES = {
  DASHBOARD: "Dashboard",
  USER_MANAGEMENT: "User Management",
  ROLE_MANAGEMENT: "Role Management",
  REPORTS: "Reports",
  EXPORT: "Export",
  CHAT: "Chat",
  GOLD_PRICE: "Gold Price",
  METRICS: "Metrics",
  LOG: "Log",
} as const;

/**
 * User Status - สถานะของผู้ใช้ในระบบ
 */
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/**
 * Widget Data Types - สำหรับระบุประเภทของ widget data
 */
export type WidgetDataType =
  | "contract-transaction-type-summary"
  | "contract-status-summary"
  | "daily-operation-summary"
  | "weekly-operation-summary"
  | "gold-price"
  | "asset-type-summary"
  | "ranking-by-period"
  | "top-ranking";

/**
 * Filter Period Types - สำหรับระบุช่วงเวลาในการกรอง
 */
export type FilterPeriod = "today" | "week" | "month" | "year" | "custom";

/**
 * Permission Action Type - Type สำหรับ permission actions
 */
export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

/**
 * Menu Name Type - Type สำหรับ menu names
 */
export type MenuName = (typeof MENU_NAMES)[keyof typeof MENU_NAMES];
