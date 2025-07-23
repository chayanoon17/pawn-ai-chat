"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessageStream } from "@/lib/api";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Mock data ราคาทอง (สามารถปรับเปลี่ยนได้)
const goldPrice = {
  buy: 30000, // ราคาซื้อ
  sell: 30500, // ราคาขาย
  source: "สมาคมค้าทองคำ",
};

export const ChatSidebar = ({
  isOpen,
  onClose,
  className,
}: ChatSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [promptsVisible, setPromptsVisible] = useState(true); // State สำหรับควบคุมการแสดงผลของ prompt

  const latestMessagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const streamingId = `streaming-${Date.now()}`;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setPromptsVisible(false); // เมื่อส่งข้อความ ให้ซ่อน prompt

    try {
      let botReply = "";

      setMessages((prev) => [
        ...prev,
        {
          id: streamingId,
          type: "bot",
          content: "",
          timestamp: new Date(),
        },
      ]);

      // Response จาก AI หรือ bot จะเปลี่ยนไปตามข้อความของผู้ใช้
      if (inputValue.includes("ราคาทอง")) {
        botReply = `ราคาทองวันนี้: ซื้อที่ ${goldPrice.buy} บาท/บาททองคำ, ขายที่ ${goldPrice.sell} บาท/บาททองคำ (แหล่งที่มา: ${goldPrice.source})`;
      } else {
        botReply = "ขอโทษครับ ฉันไม่เข้าใจคำถามนี้";
      }

      const historyMessages: {
        role: "user" | "assistant" | "system";
        content: string;
      }[] = [...latestMessagesRef.current, userMessage].map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      await sendChatMessageStream(
        userMessage.content,
        (chunk: string) => {
          botReply += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId ? { ...msg, content: botReply } : msg
            )
          );
        },
        historyMessages
      );

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== streamingId),
        {
          id: Date.now().toString(),
          type: "bot",
          content: botReply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("❌ Error จาก AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content: "❌ เกิดข้อผิดพลาดในการติดต่อ AI โปรดลองใหม่อีกครั้ง",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "w-80 bg-white border-l border-gray-200 flex flex-col h-full",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Chat Pawn</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}

      <ScrollArea className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.type === "user" ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.timestamp.toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      {promptsVisible && (
        <div className="px-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {[
              "ราคาทองวันนี้เท่าไร?",
              "แนวโน้มราคาทองช่วงนี้เป็นอย่างไร?",
              "ควรขายทองตอนนี้ไหม?",
            ].map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => {
                  setInputValue(prompt); // กำหนดค่า input เป็นข้อความจาก prompt
                  handleSendMessage(); // ส่งข้อความเมื่อคลิก
                }}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
