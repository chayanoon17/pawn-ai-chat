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
        "User-Agent": "Pawn-Shop-Frontend/1.0",
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
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST Request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT Request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE Request
   */
  async delete<T = any>(
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
