/**
 * HTTP API Client
 * จัดการการเชื่อมต่อกับ Backend API พร้อม httpOnly Cookies และ Security Features
 */

import type { Branch } from "@/types/auth";
import { ApiResponse, Message, ActivityLogResponse } from "@/types/api";
import { ConversationListResponse } from "@/types/api";
import type { Role, CreateRoleData, UpdateRoleData } from "@/types/role";
import type { GoldPrice } from "@/types/dashboard";
import apiClient from "@/lib/api-client";

export async function getAllConversations({
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null,
  userId = null,
}: {
  page: number;
  limit: number;
  startDate?: string | null;
  endDate?: string | null;
  userId?: string | null;
}) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  if (userId) {
    params.append("userId", userId);
  }

  const queryString = params.toString();
  const res = await apiClient.get<ConversationListResponse>(
    `/api/v1/chat/conversations/all?${queryString}`
  );

  return res.data;
}

// ดึงข้อมูลประวัติของผู้ใช้ในหน้า log เพื่่อดููบทสนทนาที่ผู็ใช้สนมนา
export async function getUserConversations(page = 1, limit = 10) {
  const res = await apiClient.get<ConversationListResponse>(
    `/api/v1/chat/conversations?page=${page}&limit=${limit}`
  );
  // Return แบบไม่ซ้อน data.data
  return res.data;
}

// ดึงบทสนทนาแสดงใน modul
export async function getConversationMessages(conversationId: string) {
  const res = await apiClient.get<ApiResponse<Message[]>>(
    `/api/v1/chat/conversations/${conversationId}/messages`
  );
  // ป้องกันกรณี data ซ้อน data
  if (res && Array.isArray(res.data)) {
    return res.data;
  } else if (res && res.data && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  return [];
}
// ลบข้อมูลบทสนทนา
export async function deleteConversation(conversationId: string) {
  return apiClient.delete(`/api/v1/chat/conversations/${conversationId}`);
}

// get ประวัติผู้ใช้งาน
export async function getActivityLogs({
  page = 1,
  limit = 10,
  activity = null,
  startDate = null,
  endDate = null,
  userId = null,
}: {
  page: number;
  limit: number;
  activity?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  userId?: string | null;
}) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (activity) {
    params.append("activity", activity);
  }

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  if (userId) {
    params.append("userId", userId);
  }

  const queryString = params.toString();
  const res = await apiClient.get<ActivityLogResponse>(
    `/api/v1/activity/logs?${queryString}`
  );

  return res.data;
}

// export table
export async function getActivityLogexdport(page = 1, limit = 10) {
  const res = await apiClient.get<ActivityLogResponse>(
    `/api/v1/activity/logs?page${page}&limit=${limit}`
  );

  return res.data;
}

interface MenuAccessPayload {
  menuId: string;
  menuName: string;
  menuPath: string;
  parentMenu?: string;
}

export async function logMenuAccess({
  menuId,
  menuName,
  menuPath,
  parentMenu = "",
}: MenuAccessPayload): Promise<void> {
  try {
    await apiClient.post("/api/v1/activity/menu-access", {
      menuId,
      menuName,
      menuPath,
      parentMenu,
    });
  } catch (error) {
    console.error("❌ Error logging menu access:", error);
  }
}

/**
 * Get permissions for dropdown/menu
 */
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

/**
 * Get menu permissions for dropdown/menu
 */
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

// Types for API functions
interface Permission {
  id: number;
  name: string;
  description: string;
}

interface MenuPermission {
  id: number;
  name: string;
  description: string;
  menu?: string;
}

/**
 * Menu/Dropdown Data API Functions
 */
export async function getMenuRoles() {
  const response = await apiClient.get("/api/v1/menu/roles");
  return response.data;
}

export async function getMenuBranches(): Promise<Branch[]> {
  const response = await apiClient.get<Branch[]>("/api/v1/menu/branches");
  return response.data;
}

/**
 * ===================================
 * 👥 ROLE MANAGEMENT API
 * ===================================
 */

export interface RoleListResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * ดึงรายการ Roles ทั้งหมด
 */
export async function getRoles(
  params?: GetRolesParams
): Promise<RoleListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const url = `/api/v1/roles${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await apiClient.get<RoleListResponse>(url);
  return response.data;
}

/**
 * ดึงข้อมูล Role ตาม ID
 */
export async function getRoleById(id: number): Promise<Role> {
  const response = await apiClient.get<{ role: Role }>(`/api/v1/roles/${id}`);
  return response.data.role;
}

/**
 * สร้าง Role ใหม่
 */
export async function createRole(data: CreateRoleData): Promise<Role> {
  const response = await apiClient.post<{ role: Role }>("/api/v1/roles", data);
  return response.data.role;
}

/**
 * อัปเดตข้อมูล Role
 */
export async function updateRole(
  id: number,
  data: UpdateRoleData
): Promise<Role> {
  const response = await apiClient.put<{ role: Role }>(
    `/api/v1/roles/${id}`,
    data
  );
  return response.data.role;
}

/**
 * ลบ Role
 */
export async function deleteRole(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/roles/${id}`);
}

/**
 * ===================================
 * 📊 ACTIVITY TRACKING API
 * ===================================
 */

export interface MenuAccessData {
  menuName: string;
  menuPath: string;
  menuId: string;
  parentMenu?: string;
}

/**
 * บันทึกการเข้าถึงเมนู
 */
export async function trackMenuAccess(data: MenuAccessData): Promise<void> {
  try {
    await apiClient.post("/api/v1/activity/menu-access", data);
  } catch (error) {
    // Log error แต่ไม่ throw เพื่อไม่ให้กระทบการทำงานของเมนู
    console.error("Failed to track menu access:", error);
  }
}

/**
 * ดึงข้อมูลสรุป Activity Logs
 */
export interface ActivitySummaryParams {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  userId?: string | null; // Optional, for admin/super admin
}

export interface ActivitySummaryResponse {
  summary: {
    totalLogs: number;
    currentMonthLogs: number;
    activeUsersCount: number;
  };
  activityStats: Array<{
    activity: string;
    count: number;
  }>;
}

export async function getActivitySummary(
  params: ActivitySummaryParams
): Promise<ActivitySummaryResponse> {
  const searchParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  if (params.userId) {
    searchParams.append("userId", params.userId);
  }

  const response = await apiClient.get<ActivitySummaryResponse>(
    `/api/v1/activity/logs/summary?${searchParams.toString()}`
  );

  return response.data;
}

/**
 * ===================================
 * 📊 CONTRACT TRANSACTION API
 * ===================================
 */

// Types สำหรับ Contract Transaction API
export interface TransactionSummaryItem {
  type: string;
  value: number;
  total: number;
}

export interface TransactionDetailItem {
  contractNumber: number;
  ticketBookNumber: string;
  transactionDate: string;
  interestPaymentDate: string | null;
  overdueDays: number;
  remainingAmount: number;
  interestAmount: number;
  transactionType: string;
  branchId: number;
  branchName: string;
  branchShortName: string;
  branchLocation: string;
  assetType: string;
  assetDetail: string;
  pawnPrice: number;
  monthlyInterest: number;
  contractStatus: string;
  redeemedDate: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerOccupation: string;
}

export interface ContractTransactionDetailsResponse {
  branchId: number;
  summaries: TransactionSummaryItem[];
  transactions: TransactionDetailItem[];
  timestamp: string;
}

/**
 * ดึงข้อมูลรายละเอียดธุรกรรมสัญญาจำนำ
 */
export async function getContractTransactionDetails(params: {
  branchId?: string | null;
  date: string;
}): Promise<ContractTransactionDetailsResponse> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);

  const response = await apiClient.get<ContractTransactionDetailsResponse>(
    `/api/v1/contracts/transactions/details?${searchParams.toString()}`
  );

  return response.data;
}

/**
 * ส่งออกข้อมูลธุรกรรมสัญญาจำนำเป็น CSV
 */
export async function exportContractTransactionsCSV(params: {
  branchId?: string | null;
  date: string;
  filename?: string;
}): Promise<void> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);

  const exportUrl = `/api/v1/contracts/transactions/export/csv?${searchParams.toString()}`;
  const filename =
    params.filename ||
    `contract-transactions-${params.branchId || "all"}-${params.date}.csv`;

  await apiClient.download(exportUrl, filename);
}

/**
 * ===================================
 * 💰 GOLD PRICE API
 * ===================================
 */

/**
 * ดึงข้อมูลราคาทองล่าสุด
 */
export async function getLatestGoldPrice(): Promise<GoldPrice> {
  const response = await apiClient.get<GoldPrice>("/api/v1/gold-price/latest");
  return response.data;
}

/**
 * ===================================
 * 📊 DASHBOARD SUMMARY API
 * ===================================
 */

// Types สำหรับ Dashboard Summary
export interface StatusSummaryResponse {
  branchId: number;
  summaries: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
  timestamp: string;
}

/**
 * ดึงข้อมูลสรุปสถานะสัญญา
 */
export async function getContractStatusSummary(params: {
  branchId?: string | null;
  date: string;
}): Promise<StatusSummaryResponse> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);
  searchParams.append("summaryType", "contractStatus");

  const response = await apiClient.get<StatusSummaryResponse>(
    `/api/v1/contracts/transactions/summary?${searchParams.toString()}`
  );

  return response.data;
}

/**
 * ดึงข้อมูลสรุปประเภทธุรกรรม
 */
export async function getContractTransactionTypeSummary(params: {
  branchId?: string | null;
  date: string;
}): Promise<StatusSummaryResponse> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);
  searchParams.append("summaryType", "transactionType");

  const response = await apiClient.get<StatusSummaryResponse>(
    `/api/v1/contracts/transactions/summary?${searchParams.toString()}`
  );

  return response.data;
}
