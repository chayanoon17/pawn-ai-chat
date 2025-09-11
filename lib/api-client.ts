import { ApiResponse, ApiErrorResponse } from "@/types/api";

// Types สำหรับ fetch API
interface FetchConfig extends RequestInit {
  timeout?: number;
}

interface FetchError extends Error {
  status?: number;
  response?: ApiErrorResponse;
}

/**
 * Get base URL from environment variable
 */
const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "";
};

/**
 * API Client Class - Singleton pattern สำหรับการจัดการ HTTP requests
 */
class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;

  constructor() {
    this.baseURL = getBaseUrl();
    this.timeout = 60000; // 60 วินาที timeout (เพิ่มขึ้นเพื่อรองรับ delay 20-25 วินาที + AI processing)

    // ตรวจสอบว่า baseURL ไม่ว่าง
    if (!this.baseURL) {
      console.error("❌ API_URL is not set! Check environment variables.");
    }
  }

  /**
   * สร้าง default headers พร้อม configuration สำหรับ httpOnly cookies
   */
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // เพิ่ม Authorization header ถ้ามี token ใน localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * สร้าง default config สำหรับ fetch
   */
  private getDefaultConfig(): RequestInit {
    return {
      credentials: "include", // ส่ง cookies และ authentication headers
      mode: "cors", // เพิ่ม CORS mode
      cache: "no-cache", // ป้องกัน cache issues
      headers: {
        ...this.getDefaultHeaders(),
        // เพิ่ม headers เพื่อรองรับ CORS และ Azure
        "Access-Control-Allow-Credentials": "true",
        "X-Requested-With": "XMLHttpRequest",
      },
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
      console.error("❌ fetch error:", {
        url,
        error: error instanceof Error ? error.message : error,
        name: error instanceof Error ? error.name : "Unknown",
        cause: error instanceof Error ? error.cause : undefined,
      });

      clearTimeout(timeoutId);

      throw error;
    }
  }

  /**
   * จัดการ Response Errors อย่างเป็นระบบ
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;

      try {
        errorData = await response.json();
      } catch {
        // ถ้า parse JSON ไม่ได้
      }

      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
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
    } catch {
      throw new Error("Failed to parse response JSON");
    }
  }

  /**
   * Log request ใน development mode
   */
  private logRequest(method: string, url: string, data?: unknown): void {
    if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      const detail: { method: string; url: string; data?: unknown | null } = {
        method: method.toUpperCase(),
        url,
      };

      if (data) detail.data = data;

      console.log("🚀 API Request:", detail);
    }
  }

  /**
   * GET Request
   * @param url - endpoint URL
   * @param config - fetch configuration
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
   * @param url - endpoint URL
   * @param data - request body data
   * @param config - fetch configuration
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
   * @param url - endpoint URL
   * @param data - request body data
   * @param config - fetch configuration
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
   * @param url - endpoint URL
   * @param config - fetch configuration
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

  /**
   * Download File (สำหรับ CSV, Excel, PDF etc.)
   * @param url - endpoint URL
   * @param filename - ชื่อไฟล์ที่ต้องการดาวน์โหลด
   * @param config - fetch configuration
   */
  async download(
    url: string,
    filename: string,
    config?: FetchConfig
  ): Promise<void> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("GET", fullUrl);

    // สร้าง headers พิเศษสำหรับการดาวน์โหลดไฟล์
    const downloadHeaders = {
      ...this.getDefaultHeaders(),
      Accept: "text/csv,application/csv,application/octet-stream,*/*",
    };

    const response = await this.fetchWithTimeout(fullUrl, {
      ...this.getDefaultConfig(),
      ...config,
      method: "GET",
      headers: {
        ...downloadHeaders,
        ...config?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ถ้า parse JSON ไม่ได้ ใช้ error message เดิม
      }

      throw new Error(errorMessage);
    }

    // แปลงเป็น blob
    const blob = await response.blob();

    // สร้าง blob URL และดาวน์โหลดไฟล์
    const blobUrl = window.URL.createObjectURL(blob);

    // สร้าง element <a> เพื่อดาวน์โหลด
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // ทำความสะอาด
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }

  /**
   * Stream Request (สำหรับ Server-Sent Events และ Streaming Responses)
   * @param url - endpoint URL
   * @param data - request body data
   * @param onChunk - callback เมื่อได้รับ chunk ใหม่
   * @param onComplete - callback เมื่อ stream จบ
   * @param config - fetch configuration
   */
  async stream(
    url: string,
    data?: unknown,
    onChunk?: (chunk: string) => void,
    onComplete?: () => void,
    config?: FetchConfig
  ): Promise<void> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("POST", fullUrl, data);

    // Use extended timeout for streaming requests (90 seconds)
    const streamConfig = {
      ...this.getDefaultConfig(),
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      timeout: 90000, // 90 seconds for streaming with delays
    };

    const response = await this.fetchWithTimeout(fullUrl, streamConfig);

    if (!response.ok || !response.body) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
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
        onChunk?.(text);
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
      // ถ้าเรา "จบแล้ว" หรือ "ได้ข้อความมาแล้ว" และ error เป็นแนว network-close ก็เมิน
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

  /**
   * Chat Request (สำหรับ non-streaming chat)
   * @param url - endpoint URL
   * @param message - ข้อความที่จะส่ง
   * @param config - fetch configuration
   */
  async chat(
    url: string,
    message: string,
    config?: FetchConfig
  ): Promise<string> {
    const fullUrl = `${this.baseURL}${url}`;
    this.logRequest("POST", fullUrl, { message });

    const response = await this.fetchWithTimeout(fullUrl, {
      ...this.getDefaultConfig(),
      ...config,
      method: "POST",
      body: JSON.stringify({ message }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
    }

    return result;
  }
}
/**
 * Singleton Instance - ใช้ instance เดียวทั่วทั้งแอพ
 */
const apiClient = new ApiClient();

export default apiClient;

/**
 * Get full API URL with /api/v1 path
 */
export const getApiUrl = (path: string = ""): string => {
  const baseUrl = getBaseUrl();
  const apiPath = `/api/v1${path}`;
  return `${baseUrl}${apiPath}`;
};
