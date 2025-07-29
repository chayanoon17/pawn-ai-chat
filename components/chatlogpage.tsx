"use client";

import { useEffect, useState } from "react";
import {
  getUserConversations,
  deleteConversation,
  getConversationMessages,
} from "@/lib/api";

import { ChatModal } from "@/components/log/chatmodal";

interface Message {
  from: "user" | "ai";
  text: string;
  time: string;
}

export interface ConversationItem {
  conversationId: string;
  userQuestion: string;
  aiResponse: string;
  createdAt: string;
  updatedAt?: string;
  messageCount?: number;
  lastMessageAt?: string;
  model?: string;
  email?: string;
  fullName?: string;
}

export interface ConversationListResponse {
  conversations: ConversationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ChatLogPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchConversations = async () => {
    try {
      const res = await getUserConversations(page, 10);

      const transformed: ConversationItem[] = res.conversations.map((item) => ({
        conversationId: item.conversationId,
        userQuestion: item.userQuestion ?? "(ไม่มีคำถาม)",
        aiResponse: item.aiResponse ?? "(ไม่มีคำตอบ)",
        createdAt: item.createdAt ?? new Date().toISOString(),
        email: item.email ?? "-",
        fullName: item.fullName ?? "-",
      }));

      setConversations(transformed);
    } catch (err) {
      console.error("ไม่สามารถโหลดบทสนทนาได้", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบบทสนทนานี้หรือไม่?")) {
      try {
        await deleteConversation(id);
        fetchConversations();
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบ:", err);
      }
    }
  };

  const handleViewMessages = async (
    id: string,
    userQuestion: string,
    aiResponse: string
  ) => {
    try {
      const res = await getConversationMessages(id);
      setMessages(res.data ?? []);
      setSelectedTopic(`${userQuestion}|||${aiResponse}`);
    } catch (err) {
      console.error("ไม่สามารถโหลดข้อความ:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">ประวัติการสนทนา</h1>

      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">คำถาม</th>
            <th className="text-left p-2">email</th>
            <th className="text-left p-2">ผู้ใช้</th>
            <th className="text-left p-2">วันที่</th>
            <th className="text-left p-2">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {conversations.map((conv) => (
            <tr key={conv.conversationId} className="border-b hover:bg-gray-50">
              <td className="p-2">
                {conv.userQuestion.length > 30
                  ? conv.userQuestion.slice(0, 30) + "..."
                  : conv.userQuestion}
              </td>
              <td className="p-2">{conv.email}</td>
              <td className="p-2">{conv.fullName}</td>
              <td className="p-2">
                {new Date(conv.createdAt).toLocaleString("th-TH")}
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() =>
                    handleViewMessages(
                      conv.conversationId,
                      conv.userQuestion,
                      conv.aiResponse
                    )
                  }
                  className="text-blue-600 hover:underline"
                >
                  ดูรายละเอียด
                </button>
                <button
                  onClick={() => handleDelete(conv.conversationId)}
                  className="text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal แสดงข้อความในบทสนทนา */}
      {messages && selectedTopic && (
        <ChatModal
          messages={messages}
          selectedTopic={selectedTopic}
          onClose={() => {
            setMessages(null);
            setSelectedTopic(null);
          }}
        />
      )}
    </div>
  );
}
