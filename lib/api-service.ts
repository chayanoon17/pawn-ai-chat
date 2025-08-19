/**
 * HTTP API Client
 * จัดการการเชื่อมต่อกับ Backend API พร้อม httpOnly Cookies และ Security Features
 */

import type { Branch } from "@/types/auth";
import { ApiResponse, Message, ActivityLogResponse } from "@/types/api";
import { ConversationListResponse } from "@/types/api";
import type { Role, CreateRoleData, UpdateRoleData } from "@/types/role";
import apiClient, { getApiUrl } from "@/lib/api-client";

export async function sendChatMessage(message: string): Promise<string> {
  const controller = new AbortController(); // สำหรับยกเลิกได้ในอนาคต

  // สร้าง headers พร้อม authentication
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // เพิ่ม Authorization header ถ้ามี token ใน localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(getApiUrl("/api/v1/chat"), {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
    credentials: "include", // ✅ สำคัญ: เพื่อส่ง cookie / token ไปด้วย
    signal: controller.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("การเชื่อมต่อกับ AI ล้มเหลว");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    result += chunk;

    // 👉 หากต้องการแสดงทีละ chunk:
    // onChunk(chunk); // คุณจะต้องส่ง callback มาในฟังก์ชัน
  }

  return result;
}

export async function sendChatMessageStream(
  message: string,
  onChunk: (chunk: string) => void,
  messages: { role: "user" | "assistant" | "system"; content: string }[] = [],
  conversationId?: string,
  onComplete?: () => void
): Promise<void> {
  // headers + bearer token (ถ้ามี)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl("/chat"), {
    method: "POST",
    headers,
    body: JSON.stringify({ message, messages, conversationId }),
    credentials: "include",
  });

  if (!response.ok || !response.body) {
    throw new Error("ไม่สามารถเชื่อมต่อกับระบบได้");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let completed = false;
  let gotAnyChunk = false;

  const safeComplete = () => {
    if (!completed) {
      completed = true;
      onComplete?.();
    }
  };

  const emitContent = (text: unknown) => {
    if (typeof text === "string" && text.length > 0) {
      gotAnyChunk = true;
      onChunk(text);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const rawBlock = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        const block = rawBlock.replace(/\r/g, "").trim();
        if (!block) continue;

        // พาร์สรูปแบบ SSE: รองรับทั้ง event: และ data:
        let eventName = "message";
        const dataLines: string[] = [];

        for (const rawLine of block.split("\n")) {
          const line = rawLine.trim();
          if (!line || line.startsWith(":")) continue; // comment/keepalive
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
            continue;
          }
          if (line.startsWith("data:")) {
            dataLines.push(line.slice(5));
          }
        }

        const dataStr = dataLines.join("\n").trim();

        // จบสตรีม (สองรูปแบบ)
        if (eventName === "done" || dataStr === "[DONE]") {
          safeComplete();
          return;
        }

        if (eventName === "error") {
          throw new Error(dataStr || "SSE error");
        }

        // ข้าม ping/keepalive ที่มาเป็น data
        if (dataStr === ":ping" || dataStr === '":ping"') continue;
        if (!dataStr) continue;

        // โครงสร้างที่ server อาจส่งมา: {content:"..."} หรือ delta แบบ OpenAI
        try {
          const parsed = JSON.parse(dataStr);
          const direct =
            typeof parsed?.content === "string" ? parsed.content : undefined;

          const delta =
            parsed?.choices?.[0]?.delta?.content ??
            parsed?.delta?.content ??
            parsed?.text ??
            undefined;

          if (direct !== undefined) {
            emitContent(direct);
          } else if (typeof delta === "string") {
            emitContent(delta);
          }
          // ไม่รู้จักรูปแบบ → ไม่ต้อง emit
        } catch {
          // สตริงดิบ
          emitContent(dataStr);
        }
      }
    }

    // flush ก้อนท้าย (ถ้ามีแต่ไม่ได้ตามด้วย "\n\n")
    const tail = buffer.trim();
    if (tail && tail !== "[DONE]") {
      try {
        const parsed = JSON.parse(tail);
        const direct =
          typeof parsed?.content === "string" ? parsed.content : undefined;
        const delta =
          parsed?.choices?.[0]?.delta?.content ??
          parsed?.delta?.content ??
          parsed?.text ??
          undefined;

        if (direct !== undefined) emitContent(direct);
        else if (typeof delta === "string") emitContent(delta);
        else emitContent(tail);
      } catch {
        emitContent(tail);
      }
    }

    safeComplete();
  } catch (err: unknown) {
    // ถ้าเรา “จบแล้ว” หรือ “ได้ข้อความมาแล้ว” และ error เป็นแนว network-close ก็เมิน
    const msg =
      err instanceof Error ? err.message : typeof err === "string" ? err : "";

    if (
      completed ||
      (gotAnyChunk &&
        typeof msg === "string" &&
        /network|abort|reset/i.test(msg))
    ) {
      console.warn("SSE closed after completion. Suppressed:", err);
      return;
    }

    safeComplete();
    throw err instanceof Error ? err : new Error(String(err));
  }
}

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
