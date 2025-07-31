
/**
 * HTTP API Client
 * จัดการการเชื่อมต่อกับ Backend API พร้อม httpOnly Cookies และ Security Features
 */

import {
   ApiResponse,
   ApiErrorResponse,
   Message,
   ActivityLog,
   ActivityLogResponse,
    } from "@/types/api";
import {ConversationListResponse} from "@/types/api";


/**
 * Get base URL from environment variable
 */
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

/**
 * Get full API URL with /api/v1 path
 */
export const getApiUrl = (path: string = ""): string => {
  const baseUrl = getBaseUrl();
  const apiPath = `/api/v1${path}`;
  return `${baseUrl}${apiPath}`;
};

export async function sendChatMessage(message: string): Promise<string> {
  const controller = new AbortController(); // สำหรับยกเลิกได้ในอนาคต

  const response = await fetch(getApiUrl("/chat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  onComplete?: () => void // 🎯 เพิ่ม callback เมื่อจบ streaming
): Promise<void> {
  try {
    const response = await fetch(getApiUrl("/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, messages }), // ✅ ส่งทั้ง message เดี่ยวและ history
      credentials: "include",
    });

    if (!response.ok || !response.body) {
      throw new Error("ไม่สามารถเชื่อมต่อกับระบบได้");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n\n");
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith("data: ")) {
          const json = line.replace(/^data:\s*/, "");
          try {
            const parsed = JSON.parse(json);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (err) {
            console.error("❌ JSON parse error:", err);
          }
        }
      }

      buffer = lines[lines.length - 1];
    }

    // 🎯 เรียก callback เมื่อ streaming จบ
    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    // รอบการจัดการ error และเรียก onComplete ด้วย
    if (onComplete) {
      onComplete();
    }
    throw error;
  }
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
  return res.data;
}
// ลบข้อมูลบทสนทนา 
export async function deleteConversation(conversationId: string) {
  return apiClient.delete(`/api/v1/chat/conversations/${conversationId}`);
}


// get ประวัติผู้ใช้งาน
export async function getActivityLogs(page = 1, limit = 10) {
  const res = await apiClient.get<ActivityLog>(
    `/api/v1/activity/logs?page=${page}&limit=${limit}`
  );

  return res.data;
}
// export table
export async function getActivityLogexdport(page = 1,  limit = 10) {
  const res = await  apiClient.get<ActivityLogResponse>(
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
  console.log("📤 Sending logMenuAccess:", { menuId, menuName, menuPath });
  try {
    await apiClient.post("/api/v1/activity/menu-access", {
      menuId,
      menuName,
      menuPath,
      parentMenu,
    });
    console.log("✅ Log menu access success:", menuName);
  } catch (error) {
    console.error("❌ Error logging menu access:", error);
  }
}

// Types สำหรับ fetch API
interface FetchConfig extends RequestInit {
  timeout?: number;
}

interface FetchError extends Error {
  status?: number;
  response?: ApiErrorResponse;
}

/**
 * API Client Class - Singleton pattern สำหรับการจัดการ HTTP requests
 */
class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;

  constructor() {
    this.baseURL = getBaseUrl();
    this.timeout = 10000; // 10 วินาที timeout
  }

  /**
   * สร้าง default headers พร้อม configuration สำหรับ httpOnly cookies
   */
  private getDefaultHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * สร้าง default config สำหรับ fetch
   */
  private getDefaultConfig(): RequestInit {
    return {
      credentials: "include", // 🍪 สำคัญ! ส่ง httpOnly cookies ไปกับทุก request
      headers: this.getDefaultHeaders(),
    };
  }

  /**
   * จัดการ timeout สำหรับ fetch request
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout = this.timeout, ...fetchConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * จัดการ Response Errors อย่างเป็นระบบ
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Log response ใน development mode
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.url,
      });
    }

    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;

      try {
        errorData = await response.json();
      } catch {
        // ถ้า parse JSON ไม่ได้
      }

      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("❌ API Error:", {
          status: response.status,
          message: errorData?.message,
          url: response.url,
        });
      }

      // จัดการ error ตาม status code
      switch (response.status) {
        case 401:
          console.warn("🔐 Unauthorized: Token may be expired");
          break;
        case 403:
          console.warn("🚫 Forbidden: Insufficient permissions");
          break;
        case 404:
          console.warn("🔍 Not Found: Resource not found");
          break;
        case 429:
          console.warn("⏳ Rate Limited: Too many requests");
          break;
        case 500:
          console.error("🔥 Server Error: Internal server error");
          break;
        default:
          console.error("❓ Unknown Error:", response.status);
      }

      const error: FetchError = new Error(
        errorData?.message || `HTTP Error ${response.status}`
      );
      error.status = response.status;
      error.response = errorData || undefined;
      throw error;
    }

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }
  }

  /**
   * Log request ใน development mode
   */
  private logRequest(method: string, url: string, data?: unknown): void {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🚀 API Request:", {
        method: method.toUpperCase(),
        url,
        data,
      });
    }
  }

  /**
   * HTTP Methods - Public API สำหรับใช้งาน
   */

  /**
   * GET Request
   */
  async get<T = unknown>(
    url: string,
    config?: FetchConfig
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("GET", fullUrl);

    const response = await this.fetchWithTimeout(fullUrl, {
      ...this.getDefaultConfig(),
      ...config,
      method: "GET",
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST Request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: FetchConfig
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("POST", fullUrl, data);

    const response = await this.fetchWithTimeout(fullUrl, {
      ...this.getDefaultConfig(),
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT Request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: FetchConfig
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("PUT", fullUrl, data);

    const response = await this.fetchWithTimeout(fullUrl, {
      ...this.getDefaultConfig(),
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE Request
   */
  async delete<T = unknown>(
    url: string,
    config?: FetchConfig
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("DELETE", fullUrl);

    const response = await this.fetchWithTimeout(fullUrl, {
      ...this.getDefaultConfig(),
      ...config,
      method: "DELETE",
    });

    return this.handleResponse<T>(response);
  }
}

/**
 * Singleton Instance - ใช้ instance เดียวทั่วทั้งแอพ
 */
const apiClient = new ApiClient();

export default apiClient;

/**
 * Get permissions for dropdown/menu
 */
export async function getPermissions(): Promise<Permission[]> {
  try {
    const response = await fetch(getApiUrl("/menu/permissions"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
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
    const response = await fetch(getApiUrl("/menu/menu-permissions"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch menu permissions: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.data || [];
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
