"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { sendChatMessageStream } from "@/lib/api";
import { WidgetData } from "@/context/widget-context";
import {
  ChatHeader,
  ActiveContextSection,
  MessagesArea,
  PromptSuggestions,
  ChatInput,
  ChatErrorBoundary,
  generateDynamicPrompts,
  getPromptButtonStyle,
  getContextSummary,
  type ActiveContext,
  type Message,
} from "./chat-sidebar/";

interface ChatSidebarProps {
  onClose: () => void;
  className?: string;
}

export const ChatSidebar = ({ onClose, className }: ChatSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [promptsVisible, setPromptsVisible] = useState(true);
  const [activeContexts, setActiveContexts] = useState<ActiveContext[]>([]);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [isPromptsExpanded, setIsPromptsExpanded] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  // 🎯 จำกัดจำนวนข้อความในหน่วยความจำ
  const MAX_CONTEXT_MESSAGES = 10; // เก็บเฉพาะ 10 ข้อความล่าสุด

  useEffect(() => {
    if (!conversationId) {
      // ตัวอย่าง: ดึง conversationId จาก backend หรือสร้างใหม่
      const newConversationId = crypto.randomUUID(); // แทนที่ด้วยการดึงจาก backend
      setConversationId(newConversationId);
    }
  }, [conversationId]);

  // 🛡️ ใช้ useMemo เพื่อจำกัดข้อความใน Context
  const limitedMessages = useMemo(() => {
    return messages.slice(-MAX_CONTEXT_MESSAGES);
  }, [messages]);

  const latestMessagesRef = useRef<Message[]>(limitedMessages);
  useEffect(() => {
    latestMessagesRef.current = limitedMessages;
  }, [limitedMessages]);

  // 🛡️ Safe JSON stringify function to handle circular references
  const safeStringify = (obj: unknown): string => {
    const seen = new Set();
    try {
      return JSON.stringify(
        obj,
        (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular Reference]";
            }
            seen.add(value);
          }

          // Handle specific problematic types
          if (typeof value === "function") {
            return "[Function]";
          }
          if (value instanceof Date) {
            return value.toISOString();
          }
          if (value instanceof Error) {
            return `[Error: ${value.message}]`;
          }

          // Handle DOM elements or React elements
          if (
            value &&
            typeof value === "object" &&
            (value.nodeType ||
              value.$$typeof ||
              (value.constructor &&
                value.constructor.name &&
                !["Object", "Array"].includes(value.constructor.name)))
          ) {
            return `[${value.constructor?.name || "ComplexObject"}]`;
          }

          // 🎯 ลดขนาด: จำกัดความยาวของ string
          if (typeof value === "string" && value.length > 500) {
            return value.substring(0, 500) + "... [ตัดข้อมูล]";
          }

          return value;
        },
        2
      );
    } catch (error) {
      console.error("Stringify error:", error);
      return `[Error serializing data: ${
        error instanceof Error ? error.message : "Unknown error"
      }]`;
    }
  };

  // 🛡️ Helper function to create safe message objects
  const createSafeMessage = (
    id: string,
    type: "user" | "bot",
    content: unknown,
    timestamp: Date = new Date()
  ): Message => {
    let safeContent: string;

    if (typeof content === "string") {
      safeContent = content;
    } else if (content === null || content === undefined) {
      safeContent = "";
    } else if (typeof content === "object") {
      // ใช้ safeStringify สำหรับ object แทน String()
      safeContent = safeStringify(content);
    } else {
      // สำหรับ primitive types อื่นๆ (number, boolean, etc.)
      safeContent = String(content);
    }

    console.log("📝 Creating message:", {
      id: String(id),
      type,
      originalContent: content,
      contentType: typeof content,
      safeContent,
      safeContentType: typeof safeContent,
    });

    return {
      id: String(id),
      type,
      content: safeContent,
      timestamp,
    };
  };

  // 🎯 Handle เพิ่ม Context จาก Widget
  const handleContextAdd = (widget: WidgetData) => {
    // 🛡️ จำกัดจำนวน Active Contexts ไม่เกิน 3 รายการ
    if (activeContexts.length >= 3) {
      const warningMessage = createSafeMessage(
        `warning-${Date.now()}`,
        "bot",
        `⚠️ ไม่สามารถเพิ่ม Context ได้อีก\nสามารถเก็บ Context ได้สูงสุด 3 รายการเท่านั้น กรุณาลบบางรายการก่อน`
      );
      setMessages((prev) => [...prev, warningMessage]);
      return;
    }

    // ตรวจสอบว่ามี widget นี้อยู่แล้วหรือไม่
    const exists = activeContexts.some((ctx) => ctx.widget.id === widget.id);

    if (exists) {
      // แสดงข้อความแจ้งเตือนเมื่อพยายามเพิ่มซ้ำ
      const warningMessage = createSafeMessage(
        `warning-${Date.now()}`,
        "bot",
        `⚠️ "${widget.name}" ถูกเพิ่มใน Context แล้ว\nหากต้องการอัพเดทข้อมูล กรุณาลบออกก่อนแล้วเพิ่มใหม่`
      );
      setMessages((prev) => [...prev, warningMessage]);
      return;
    }

    const newContext: ActiveContext = {
      widget: {
        id: widget.id,
        name: widget.name,
        description: widget.description,
        data: widget.data,
      },
      addedAt: new Date(),
    };

    setActiveContexts((prev) => [...prev, newContext]);

    // แสดงข้อความแจ้งเตือนใน chat
    const contextMessage = createSafeMessage(
      `context-${Date.now()}`,
      "bot",
      `✅ เพิ่ม Context: "${widget.name}" เรียบร้อยแล้ว\nตอนนี้คุณสามารถถามคำถามเกี่ยวกับข้อมูลนี้ได้`
    );

    setMessages((prev) => [...prev, contextMessage]);
  };

  // 🗑️ Remove Context
  const handleContextRemove = (widgetId: string) => {
    const removedWidget = activeContexts.find(
      (ctx) => ctx.widget.id === widgetId
    );

    setActiveContexts((prev) =>
      prev.filter((ctx) => ctx.widget.id !== widgetId)
    );

    // แสดงข้อความแจ้งเตือนเมื่อลบ context
    if (removedWidget) {
      const removeMessage = createSafeMessage(
        `remove-${Date.now()}`,
        "bot",
        `🗑️ ลบ Context: "${removedWidget.widget.name}" เรียบร้อยแล้ว\nตอนนี้คุณสามารถเพิ่ม Widget นี้ใหม่ได้`
      );

      setMessages((prev) => [...prev, removeMessage]);
    }
  };

  // Handle prompt click
  const handlePromptClick = (prompt: string) => {
    console.log("🎯 Prompt clicked:", typeof prompt, prompt);

    // Ensure prompt is always a string
    const safePrompt = typeof prompt === "string" ? prompt : String(prompt);
    console.log("🎯 Safe prompt:", typeof safePrompt, safePrompt);

    setInputValue(""); // Clear input first to prevent double sending
    handleSendMessage(safePrompt);
  };

  const handleSendMessage = async (customMessage?: string) => {
    console.log("🔍 handleSendMessage called with:", {
      customMessage,
      customMessageType: typeof customMessage,
      inputValue,
      inputValueType: typeof inputValue,
    });

    const messageContent = customMessage || inputValue.trim();
    if (!messageContent || isThinking) return;

    console.log("🚀 เริ่มส่งข้อความ:", typeof messageContent, messageContent);
    console.log("📊 Active Contexts:", activeContexts.length);

    // Ensure message content is always a string
    const safeMessageContent =
      typeof messageContent === "string"
        ? messageContent
        : String(messageContent);

    const userMessage = createSafeMessage(
      Date.now().toString(),
      "user",
      safeMessageContent
    );

    const streamingId = `streaming-${Date.now()}`;

    // Set initial states early to prevent multiple submissions
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setIsThinking(true);
    setPromptsVisible(false);

    try {
      let botReply = "";

      // 🤖 แสดงข้อความ "AI กำลังคิด..." พร้อมอนิเมชัน
      setMessages((prev) => [
        ...prev,
        createSafeMessage(
          streamingId,
          "bot",
          "thinking" // ใช้ "thinking" เป็น flag สำหรับแสดงอนิเมชัน
        ),
      ]);

      // 🎯 สร้าง System Message สำหรับ AI ให้ตอบแบบตรงจุด
      const systemMessage =
        activeContexts.length > 0
          ? "คุณเป็น AI ผู้ช่วยวิเคราะห์ข้อมูล ตอบคำถามแบบตรงจุดและละเอียด ไม่ต้องขออภัยหรือบอกว่าไม่เข้าใจ หากมีข้อมูล context ให้ใช้ข้อมูลนั้นตอบคำถาม"
          : "คุณเป็น AI ผู้ช่วยเกี่ยวกับธุรกิจจำนำ ตอบคำถามแบบเป็นมิตรและให้ข้อมูลที่เป็นประโยชน์";

      // 🛡️ จำกัดจำนวนข้อความที่ส่งให้ AI (เก็บเฉพาะข้อความล่าสุด)
      const historyMessages: {
        role: "user" | "assistant" | "system";
        content: string;
      }[] = [...latestMessagesRef.current, userMessage]
        .filter((msg) => msg.content !== "thinking") // 🐛 กรองข้อความ thinking ออก
        .slice(-8) // 🎯 เก็บเฉพาะ 8 ข้อความล่าสุด (4 คู่สนทนา)
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      // 🎯 เพิ่ม Context จาก Active Widgets
      if (activeContexts.length > 0) {
        console.log("📝 กำลังเตรียม Context ข้อมูล...");
        console.log("📊 จำนวน Widgets:", activeContexts.length);

        const contextPrompt = activeContexts
          .map((ctx, index) => {
            try {
              console.log(`📊 Widget ${index + 1}:`, ctx.widget.name);
              console.log(`📄 Widget data type:`, typeof ctx.widget.data);

              // Use safe stringify to prevent circular reference errors
              const dataString = ctx.widget.data
                ? safeStringify(ctx.widget.data)
                : "ไม่มีข้อมูล";

              console.log(`✅ Widget ${index + 1} data processed successfully`);

              return `Widget: ${ctx.widget.name}\nDescription: ${
                ctx.widget.description || "ไม่มีคำอธิบาย"
              }\nData: ${dataString}`;
            } catch (error) {
              console.error(`❌ Error processing widget ${index + 1}:`, error);
              return `Widget: ${ctx.widget.name}\nDescription: ${
                ctx.widget.description || "ไม่มีคำอธิบาย"
              }\nData: ไม่สามารถประมวลผลข้อมูลได้`;
            }
          })
          .join("\n\n---\n\n");

        console.log("✅ Context เตรียมเสร็จแล้ว");

        historyMessages.unshift({
          role: "system",
          content: `${systemMessage}\n\nคุณมีข้อมูล context จาก widgets ดังนี้:\n\n${contextPrompt}\n\nใช้ข้อมูลนี้เพื่อตอบคำถามของผู้ใช้อย่างถูกต้องและละเอียด ไม่ต้องขออภัยหรือบอกว่าไม่เข้าใจ`,
        });
      } else {
        historyMessages.unshift({
          role: "system",
          content: systemMessage,
        });
      }

      await sendChatMessageStream(
        userMessage.content,
        (chunk: string) => {
          try {
            // Ensure chunk is always a string
            const safeChunk = typeof chunk === "string" ? chunk : String(chunk);

            if (botReply === "") {
              setIsThinking(false);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === streamingId ? { ...msg, content: safeChunk } : msg
                )
              );
            }

            botReply += safeChunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamingId ? { ...msg, content: botReply } : msg
              )
            );
          } catch (error) {
            console.error("❌ Error updating message chunk:", error);
          }
        },
        historyMessages,
        conversationId || undefined,
        () => {
          console.log("✅ Streaming เสร็จสิ้น - ปลดล็อก input");
          setIsSending(false);
          setIsThinking(false);
        }
      );
    } catch (error) {
      console.error("❌ Error จาก AI:", error);
      console.error(
        "❌ Error stack:",
        error instanceof Error ? error.stack : "Unknown error"
      );
      console.error("❌ Error details:", {
        messageContent,
        activeContextsCount: activeContexts.length,
        hasContext: activeContexts.length > 0,
      });

      setIsThinking(false);
      setIsSending(false);

      // Remove thinking message and add error message
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== streamingId),
        createSafeMessage(
          Date.now().toString(),
          "bot",
          error instanceof Error && error.message.includes("⏰")
            ? "⏰ " +
                error.message +
                "\n\n💡 **คุณสามารถส่งข้อความใหม่ได้เลย** การ timeout นี้ไม่ส่งผลต่อการสนทนา"
            : "❌ เกิดข้อผิดพลาดในการติดต่อ AI โปรดลองใหม่อีกครั้ง\n\n" +
                (error instanceof Error
                  ? `เหตุผล: ${error.message}`
                  : "ข้อผิดพลาดไม่ทราบสาเหตุ")
        ),
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isThinking && inputValue.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generalPrompts = [
    "ราคาทองวันนี้เท่าไร?",
    "แนวโน้มราคาทองช่วงนี้เป็นอย่างไร?",
    "ควรขายทองตอนนี้ไหม?",
    "จำนำทองทำยังไง?",
    "การประเมินราคาทองคำเป็นอย่างไร?",
  ];

  const contextPrompts = generateDynamicPrompts(activeContexts);

  return (
    <ChatErrorBoundary>
      <div
        className={cn(
          "w-148 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col h-full shadow-lg",
          className
        )}
        data-chat-sidebar
      >
        <ChatHeader
          onClose={onClose}
          onContextAdded={handleContextAdd}
          activeContexts={activeContexts}
        />

        <ActiveContextSection
          activeContexts={activeContexts}
          isExpanded={isContextExpanded}
          onToggleExpanded={() => setIsContextExpanded(!isContextExpanded)}
          onContextRemove={handleContextRemove}
          getContextSummary={() => getContextSummary(activeContexts)}
        />

        <MessagesArea messages={messages} />

        {promptsVisible && activeContexts.length === 0 && !isThinking && (
          <PromptSuggestions
            isExpanded={isPromptsExpanded}
            onToggleExpanded={() => setIsPromptsExpanded(!isPromptsExpanded)}
            prompts={generalPrompts}
            onPromptClick={handlePromptClick}
            isLoading={isSending || isThinking}
            title="คำถามที่แนะนำ"
            variant="general"
          />
        )}

        {promptsVisible && activeContexts.length > 0 && !isThinking && (
          <PromptSuggestions
            isExpanded={isPromptsExpanded}
            onToggleExpanded={() => setIsPromptsExpanded(!isPromptsExpanded)}
            prompts={contextPrompts}
            onPromptClick={handlePromptClick}
            isLoading={isSending || isThinking}
            getPromptButtonStyle={getPromptButtonStyle}
            title="คำถามสำหรับข้อมูลที่เลือก"
            subtitle="อัจฉริยะ"
            variant="context"
          />
        )}

        <ChatInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          isThinking={isThinking}
          hasContext={activeContexts.length > 0}
        />
      </div>
    </ChatErrorBoundary>
  );
};
