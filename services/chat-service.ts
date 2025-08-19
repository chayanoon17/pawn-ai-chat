import apiClient from "@/lib/api-client";

export async function sendChatMessage(message: string): Promise<string> {
  return await apiClient.chat("/api/v1/chat", message);
}

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
