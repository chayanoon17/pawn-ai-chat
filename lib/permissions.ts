/**
 * Menu Permission Constants & Utilities
 */

export type MenuPermission =
  | "Dashboard"
  | "Asset Types"
  | "Users Management"
  | "Roles Management"
  | "Activity Logs"
  | "AI Chat"
  | "User Management"
  | "Permission Management"
  | "Export"
  | "Reports"
  | "Log"
  | "Role Management"
  | "Chat"
  | "Metrics";

export const MENU_PERMISSIONS = {
  DASHBOARD: "Dashboard" as MenuPermission,
  ASSET_TYPES: "Asset Types" as MenuPermission,
  USERS_MANAGEMENT: "Users Management" as MenuPermission,
  ROLES_MANAGEMENT: "Roles Management" as MenuPermission,
  ACTIVITY_LOGS: "Activity Logs" as MenuPermission,
  AI_CHAT: "AI Chat" as MenuPermission,

  // Additional menu permissions from backend
  USER_MANAGEMENT: "User Management" as MenuPermission,
  PERMISSION_MANAGEMENT: "Permission Management" as MenuPermission,
  EXPORT: "Export" as MenuPermission,
  REPORTS: "Reports" as MenuPermission,
  LOG: "Log" as MenuPermission,
  ROLE_MANAGEMENT: "Role Management" as MenuPermission,
  CHAT: "Chat" as MenuPermission,
  METRICS: "Metrics" as MenuPermission,
} as const;

/**
 * Menu Permission Groups for different roles
 */
export const MENU_PERMISSION_GROUPS = {
  ADMIN: [
    MENU_PERMISSIONS.DASHBOARD,
    MENU_PERMISSIONS.ASSET_TYPES,
    MENU_PERMISSIONS.USERS_MANAGEMENT,
    MENU_PERMISSIONS.ROLES_MANAGEMENT,
    MENU_PERMISSIONS.ACTIVITY_LOGS,
    MENU_PERMISSIONS.AI_CHAT,
    MENU_PERMISSIONS.USER_MANAGEMENT,
    MENU_PERMISSIONS.PERMISSION_MANAGEMENT,
    MENU_PERMISSIONS.EXPORT,
    MENU_PERMISSIONS.REPORTS,
    MENU_PERMISSIONS.LOG,
    MENU_PERMISSIONS.ROLE_MANAGEMENT,
    MENU_PERMISSIONS.CHAT,
    MENU_PERMISSIONS.METRICS,
  ],
  MANAGER: [
    MENU_PERMISSIONS.DASHBOARD,
    MENU_PERMISSIONS.ASSET_TYPES,
    MENU_PERMISSIONS.USERS_MANAGEMENT,
    MENU_PERMISSIONS.ACTIVITY_LOGS,
    MENU_PERMISSIONS.AI_CHAT,
    MENU_PERMISSIONS.REPORTS,
    MENU_PERMISSIONS.CHAT,
    MENU_PERMISSIONS.METRICS,
  ],
  STAFF: [
    MENU_PERMISSIONS.DASHBOARD,
    MENU_PERMISSIONS.ASSET_TYPES,
    MENU_PERMISSIONS.AI_CHAT,
    MENU_PERMISSIONS.CHAT,
  ],
  VIEWER: [
    MENU_PERMISSIONS.DASHBOARD,
    MENU_PERMISSIONS.ASSET_TYPES,
    MENU_PERMISSIONS.REPORTS,
  ],
} as const;

/**
 * Helper function to get menu permission by name
 */
export function getMenuPermission(
  menuName: string
): MenuPermission | undefined {
  const entries = Object.entries(MENU_PERMISSIONS);
  const found = entries.find(([_, value]) => value === menuName);
  return found ? found[1] : undefined;
}

/**
 * Helper function to check if a string is a valid menu permission
 */
export function isValidMenuPermission(
  permission: string
): permission is MenuPermission {
  return Object.values(MENU_PERMISSIONS).includes(permission as MenuPermission);
}

/**
 * Helper function to get all available menu permissions
 */
export function getAllMenuPermissions(): MenuPermission[] {
  return Object.values(MENU_PERMISSIONS);
}
