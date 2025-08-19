import apiClient from "@/lib/api-client";
import type { Branch } from "@/types/auth";

// ดึงข้อมูลสิทธิ์การเข้าถึงในเมนู
export async function getPermissions(): Promise<Permission[]> {
  try {
    const response = await apiClient.get<Permission[]>(
      "/api/v1/menu/permissions"
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return [];
  }
}

// ดึงข้อมูลสิทธิ์การเข้าถึงเมนูในเมนู
export async function getMenuPermissions(): Promise<MenuPermission[]> {
  try {
    const response = await apiClient.get<MenuPermission[]>(
      "/api/v1/menu/menu-permissions"
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching menu permissions:", error);
    return [];
  }
}

// ดึงข้อมูลตำแหน่งในเมนู
export async function getMenuRoles() {
  const response = await apiClient.get("/api/v1/menu/roles");
  return response.data;
}

// ดึงข้อมูลสาขาในเมนู
export async function getMenuBranches(): Promise<Branch[]> {
  const response = await apiClient.get<Branch[]>("/api/v1/menu/branches");
  return response.data;
}
