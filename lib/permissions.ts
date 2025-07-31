// /**
//  * Menu Permission Constants & Utilities
//  */

// export type MenuPermission =
//   | "Dashboard"
//   | "Asset Types"
//   | "User Management"
//   | "Role Management"
//   | "Activity Logs"
//   | "AI Chat";

// export const MENU_PERMISSIONS = {
//   DASHBOARD: "Dashboard" as MenuPermission,
//   ASSET_TYPES: "Asset Types" as MenuPermission,
//   USER_MANAGEMENT: "User Management" as MenuPermission,
//   ROLE_MANAGEMENT: "Role Management" as MenuPermission,
//   ACTIVITY_LOGS: "Activity Logs" as MenuPermission,
//   AI_CHAT: "AI Chat" as MenuPermission,
// } as const;

// /**
//  * Helper function to get menu permission by name
//  */
// export function getMenuPermission(
//   menuName: string
// ): MenuPermission | undefined {
//   const entries = Object.entries(MENU_PERMISSIONS);
//   const found = entries.find(([_, value]) => value === menuName);
//   return found ? found[1] : undefined;
// }

// /**
//  * Helper function to check if a string is a valid menu permission
//  */
// export function isValidMenuPermission(
//   permission: string
// ): permission is MenuPermission {
//   return Object.values(MENU_PERMISSIONS).includes(permission as MenuPermission);
// }

// /**
//  * Helper function to get all available menu permissions
//  */
// export function getAllMenuPermissions(): MenuPermission[] {
//   return Object.values(MENU_PERMISSIONS);
// }
