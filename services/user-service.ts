import apiClient from "@/lib/api-client";

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

export async function getUserPermissions(id: string) {
  const response = await apiClient.get(`/api/v1/users/${id}/permissions`);
  return response.data;
}

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

export async function updateUserRole(id: string, roleId: number) {
  const response = await apiClient.put(`/api/v1/users/${id}/role`, { roleId });
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await apiClient.delete(`/api/v1/users/${id}`);
  return response.data;
}
