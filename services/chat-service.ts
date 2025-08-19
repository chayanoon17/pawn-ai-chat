import apiClient from "@/lib/api-client";
import { ApiResponse, Message } from "@/types/api";
import { ConversationListResponse } from "@/types/api";

// ส่งข้อความไปยัง Chat API
export async function sendChatMessage(message: string): Promise<string> {
  return await apiClient.chat("/api/v1/chat", message);
}

// ส่งข้อความแบบ Streaming ไปยัง Chat API
export async function sendChatMessageStream(
  message: string,
  onChunk: (chunk: string) => void,
  messages: { role: "user" | "assistant" | "system"; content: string }[] = [],
  conversationId?: string,
  onComplete?: () => void
): Promise<void> {
  const requestData = { message, messages, conversationId };

  await apiClient.stream("/api/v1/chat", requestData, onChunk, onComplete);
}

// ดึงข้อมูลบทสนทนาทั้งหมด
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

// ดึงข้อมูลประวัติของผู้ใช้ในหน้า log เพื่อดูบทสนทนาที่ผู้ใช้สนทนา
export async function getUserConversations(page = 1, limit = 10) {
  const res = await apiClient.get<ConversationListResponse>(
    `/api/v1/chat/conversations?page=${page}&limit=${limit}`
  );

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
