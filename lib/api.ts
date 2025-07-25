/**
 * HTTP API Client
 * จัดการการเชื่อมต่อกับ Backend API พร้อม httpOnly Cookies และ Security Features
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiResponse, ApiErrorResponse } from "@/types/api";

export async function sendChatMessage(message: string): Promise<string> {
  const controller = new AbortController(); // สำหรับยกเลิกได้ในอนาคต

  const response = await fetch("http://localhost:3000/api/v1/chat", {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, messages }), // ✅ ส่งทั้ง message เดี่ยวและ history
        credentials: "include",
      }
    );

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

/**
 * API Client Class - Singleton pattern สำหรับการจัดการ HTTP requests
 */
class ApiClient {
  private api: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    this.api = this.createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * สร้าง Axios instance พร้อม configuration สำหรับ httpOnly cookies
   */
  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      withCredentials: true, // 🍪 สำคัญ! ส่ง httpOnly cookies ไปกับทุก request
      timeout: 10000, // 10 วินาที timeout
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "User-Agent": "Pawn-Shop-Frontend/1.0",
        // "X-API-Key": "your-api-key-here", // ถ้า Backend ต้องการ
      },
    });
  }

  /**
   * ติดตั้ง Request และ Response Interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor - ปรับแต่งก่อนส่ง request
    this.api.interceptors.request.use(
      (config) => {
        // Log request ใน development mode
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.log("🚀 API Request:", {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor - จัดการ response และ errors
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Log response ใน development mode
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.log("✅ API Response:", {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * จัดการ Response Errors อย่างเป็นระบบ
   */
  private handleResponseError(
    error: AxiosError<ApiErrorResponse>
  ): Promise<never> {
    const { response } = error;

    // Log error ใน development mode
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("❌ API Error:", {
        status: response?.status,
        message: response?.data?.message,
        url: error.config?.url,
      });
    }

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - อาจต้อง redirect ไป login
          console.warn("🔐 Unauthorized: Token may be expired");
          // สามารถเพิ่ม logic ลบ user state หรือ redirect
          break;

        case 403:
          // Forbidden - ไม่มีสิทธิ์
          console.warn("🚫 Forbidden: Insufficient permissions");
          break;

        case 404:
          // Not Found
          console.warn("🔍 Not Found: Resource not found");
          break;

        case 429:
          // Too Many Requests
          console.warn("⏳ Rate Limited: Too many requests");
          break;

        case 500:
          // Internal Server Error
          console.error("🔥 Server Error: Internal server error");
          break;

        default:
          console.error("❓ Unknown Error:", response.status);
      }
    } else {
      // Network Error
      console.error("🌐 Network Error: No response from server");
    }

    return Promise.reject(error);
  }

  /**
   * HTTP Methods - Public API สำหรับใช้งาน
   */

  /**
   * GET Request
   */
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST Request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT Request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE Request
   */
  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * ดึง Axios instance สำหรับการใช้งานพิเศษ
   */
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

/**
 * Singleton Instance - ใช้ instance เดียวทั่วทั้งแอพ
 */
const apiClient = new ApiClient();

export default apiClient;
