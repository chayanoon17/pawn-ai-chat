import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import { MarkdownMessage } from "./markdown-message";
import { ThinkingAnimation } from "./thinking-animation";
import { useEffect, useRef, useMemo } from "react";

export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date | string; // กันกรณีมาจาก API เป็น string
}

interface MessagesAreaProps {
  messages: Message[];
}

export const MessagesArea = ({ messages }: MessagesAreaProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ ทำ key ให้ยูนีกเสมอ แม้ message.id จะซ้ำ (เช่นจาก timestamp เดียวกัน)
  // ใช้วิธีนับลำดับที่เจอ id ซ้ำ และเติม suffix __N
  const uniqueKeys = useMemo(() => {
    const seen = new Map<string, number>();
    return messages.map((m) => {
      const n = seen.get(m.id) ?? 0;
      seen.set(m.id, n + 1);
      return n === 0 ? m.id : `${m.id}__${n}`;
    });
  }, [messages]);

  // 🎯 Auto-scroll to bottom when messages change
  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  };

  // Memoize derived values to reduce re-renders
  const messagesLength = messages.length;
  const lastMessage = useMemo(
    () => (messagesLength > 0 ? messages[messagesLength - 1] : null),
    [messagesLength, messages]
  );
  const hasThinking = useMemo(
    () => messages.some((m) => m.content === "thinking"),
    [messages]
  );
  const messagesContent = useMemo(
    () =>
      // ใช้เฉพาะความยาวเพื่อหลีกเลี่ยงการคำนวณหนัก แต่ยังทริกเกอร์เมื่อสตรีมเพิ่มตัวอักษร
      messages.map((m) => (typeof m.content === "string" ? m.content.length : 0)).join("|"),
    [messages]
  );

  // Helper: แปลง timestamp ให้เป็น Date เสมอ
  const toDate = (ts: Date | string) => (ts instanceof Date ? ts : new Date(ts));

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messagesLength > 0) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [messagesLength]);

  // Auto-scroll when message content changes (streaming)
  useEffect(() => {
    if (lastMessage && lastMessage.type === "bot" && lastMessage.content !== "thinking") {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messagesContent, lastMessage]);

  // Scroll to bottom immediately when thinking animation appears
  useEffect(() => {
    if (hasThinking) {
      const t = setTimeout(() => scrollToBottom(), 50);
      return () => clearTimeout(t);
    }
  }, [hasThinking]);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 p-4 overflow-auto bg-gradient-to-b from-gray-50/50 to-white scroll-smooth"
    >
      <div className="space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              ยินดีต้อนรับสู่ Pawn AI
            </h4>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              ฉันพร้อมช่วยเหลือทุกข้อสอบถาม เริ่มสนทนาได้เลย!
            </p>
          </div>
        )}

        {messages.map((message, i) => {
          const key = uniqueKeys[i];
          const isUser = message.type === "user";
          const isThinking = message.content === "thinking";
          const timeText = toDate(message.timestamp).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={key}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  isUser
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                    : "bg-white border border-gray-100 text-gray-900 shadow-md"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {isUser ? (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-white/20 rounded-full">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-xs opacity-90 font-medium">คุณ</span>
                      <span className="text-xs opacity-75">{timeText}</span>
                    </div>
                  ) : isThinking ? (
                    <ThinkingAnimation />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-blue-100 rounded-full">
                        <Bot className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-blue-600">Pawn AI</span>
                      <span className="text-xs text-gray-500">{timeText}</span>
                    </div>
                  )}
                </div>

                {!isThinking && (
                  <MarkdownMessage
                    content={
                      typeof message.content === "string"
                        ? message.content
                        : JSON.stringify(message.content)
                    }
                    isUser={isUser}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </ScrollArea>
  );
};
