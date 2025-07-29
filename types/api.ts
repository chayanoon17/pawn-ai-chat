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


