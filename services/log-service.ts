import apiClient from "@/lib/api-client";
import { ActivityLogResponse } from "@/types/api";

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

export interface MenuAccessData {
  menuName: string;
  menuPath: string;
  menuId: string;
  parentMenu?: string;
}

// ดึงประวัติผู้ใช้งาน
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

// ดึงข้อมูลสรุป Activity Logs
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

// บันทึกการเข้าถึงเมนู
export async function trackMenuAccess(data: MenuAccessData): Promise<void> {
  try {
    await apiClient.post("/api/v1/activity/menu-access", data);
  } catch (error) {
    console.error("Failed to track menu access:", error);
  }
}

export interface TrackExportReportData {
  filename: string;
  format: "xlsx" | "csv" | "pdf";
  recordsCount?: number;
  fileSize?: number;
  reportType?: string;
  success?: boolean;
}

// บันทึกการ export รายงาน
export async function trackExportReport(data: TrackExportReportData): Promise<void> {
  try {
    await apiClient.post("/api/v1/activity/export-report", data);
  } catch (error) {
    console.error("Failed to track export report:", error);
  }
}

// ดึงข้อมูลทั้งหมดสำหรับ export (ไม่มี pagination)
export async function getAllActivityLogsForExport({
  activity,
  startDate,
  endDate,
  userId,
}: {
  activity?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  userId?: string | null;
}) {
  return getActivityLogs({ page: 1, limit: 10000, activity, startDate, endDate, userId });
}
