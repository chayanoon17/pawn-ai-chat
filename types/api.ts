/**
 * API Response Types
 * รวม interface สำหรับการตอบกลับจาก API ทั้งหมด
 */

/**
 * Generic API Response structure ใช้กับทุก API endpoint
 * @template T - Type ของ data ที่ต้องการ
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * API Error Response structure สำหรับกรณีเกิดข้อผิดพลาด
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: any;
}

/**
 * Login API Response สำหรับ endpoint /auth/login เฉพาะ
 */
export interface LoginResponse {
  userId: number;
  accessToken?: string; // Optional เพราะใช้ httpOnly cookies เป็นหลัก
}
