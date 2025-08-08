import { MenuName } from "./common";
/**
 * API Response Types
 * รวม interface สำหรับการตอบกลับจาก API ทั้งหมด
 */

/**
 * Generic API Response structure ใช้กับทุก API endpoint
 * @template T - Type ของ data ที่ต้องการ
 */
export interface ApiResponse<T = any> {
  json(): unknown;
  status: string;
  message: string;
  data: T;
}

/**
 * API Error Response structure สำหรับกรณีเกิดข้อผิดพลาด
 */
export interface ApiErrorResponse {
  status: string;
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

// แต่ละข้อความในบทสนทนา
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// ใช้ใน body ของ POST /api/v1/chat
export interface UnifiedChatRequestBody {
  message?: string; // ข้อความเดี่ยว
  messages?: ChatMessage[]; // ประวัติทั้งหมด
  conversationId?: string;
  model?: string; // GPT-3.5 / GPT-4 ฯลฯ
}

// Query parameter สำหรับ GET /chat/conversations
export interface GetConversationsParams {
  page?: number | string;
  limit?: number | string;
}

// Path parameter สำหรับ DELETE /chat/conversations/:conversationId
export interface ConversationParams {
  conversationId: string;
}

// ข้อมูลบทสนทนาที่จะส่งกลับไปให้ client
export interface ConversationItem {
  [x: string]: string;
  conversationId: string;
  latestMessage: string;
  updatedAt: string; // ISO string
}

// Response จาก GET /chat/conversations
export interface ConversationListResponse {
  [x: string]: any;
  conversations: ConversationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// type ของการดึง log chat ของ user
export interface Message {
  from: "user" | "ai";
  text: string;
  time: string;
}
// ดึงข้อมูล ประวัติการเข้าใช้งาน
export interface ActivityLog {
  [x: string]: any;
  id: number;
  activity: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string | null;
  success: boolean;
  errorMessage: string | null;
  createdAt: string; // ISO string
  userId: number;
  metadata: {
    [x: string]: string;
    email: string;
    ipAddress: string;
    loginTime: string;
    userAgent: string;
    MenuName: string;
    menuPath: string;
    // เพิ่ม location ถ้า backend มี
  };
  user: {
    id: number;
    email: string;
    fullName: string;
    role: {
      id: number;
      name: string;
    };
    branch: {
      id: number;
      name: string;
    } | null;
  };
}

export type ActivityLogResponse = {
  [x: string]: any;
  status: string; // "success"
  message: string;
  data: {
    activityLogs: ActivityLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export interface ActivityLogExport {
  id: number;
  activity: string;
  description: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: any;
    branch: any;
  };
  metadata?: {
    date?: string;
    branchId?: number;
    filename?: string;
    format?: string;
    recordsCount?: number;
    fileSize?: {
      bytes: number;
      kilobytes: number;
      megabytes: number;
    };
    reportType?: string;
    status?: string;
    exportTime?: string;
    error?: string;
  };
  success: boolean;
  errorMessage?: string;
  ipAddress: string;
  sessionId?: string | null;
  userAgent?: string;
  status?: string;
}

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: {
    id: number;
    name: string;
  };
  branch: string;
}
