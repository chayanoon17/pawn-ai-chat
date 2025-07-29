"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { sendChatMessageStream } from "@/lib/api";
import { WidgetData } from "@/context/widget-context";
import {
  ChatHeader,
  ActiveContextSection,
  MessagesArea,
  PromptSuggestions,
  ChatInput,
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

  const latestMessagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  // 🎯 Handle เพิ่ม Context จาก Widget
  const handleContextAdd = (widget: WidgetData) => {
    const newContext: ActiveContext = {
      widget: {
        id: widget.id,
        name: widget.name,
        description: widget.description,
        data: widget.data,
      },
      addedAt: new Date(),
    };

    setActiveContexts((prev) => {
      // ตรวจสอบว่ามี widget นี้อยู่แล้วหรือไม่
      const exists = prev.some((ctx) => ctx.widget.id === widget.id);
      if (exists) return prev;

      return [...prev, newContext];
    });

    // แสดงข้อความแจ้งเตือนใน chat
    const contextMessage: Message = {
      id: `context-${Date.now()}`,
      type: "bot",
      content: `✅ เพิ่ม Context: "${widget.name}" เรียบร้อยแล้ว\nตอนนี้คุณสามารถถามคำถามเกี่ยวกับข้อมูลนี้ได้`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, contextMessage]);
  };

  // 🗑️ Remove Context
  const handleContextRemove = (widgetId: string) => {
    setActiveContexts((prev) =>
      prev.filter((ctx) => ctx.widget.id !== widgetId)
    );
  };

  // Handle prompt click
  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage();
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageContent = customMessage || inputValue.trim();
    if (!messageContent || isSending || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    const streamingId = `streaming-${Date.now()}`;

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
        {
          id: streamingId,
          type: "bot",
          content: "thinking", // ใช้ "thinking" เป็น flag สำหรับแสดงอนิเมชัน
          timestamp: new Date(),
        },
      ]);

      // 🎯 สร้าง System Message สำหรับ AI ให้ตอบแบบตรงจุด
      const systemMessage =
        activeContexts.length > 0
          ? "คุณเป็น AI ผู้ช่วยวิเคราะห์ข้อมูล ตอบคำถามแบบตรงจุดและละเอียด ไม่ต้องขออภัยหรือบอกว่าไม่เข้าใจ หากมีข้อมูล context ให้ใช้ข้อมูลนั้นตอบคำถาม"
          : "คุณเป็น AI ผู้ช่วยเกี่ยวกับธุรกิจจำนำ ตอบคำถามแบบเป็นมิตรและให้ข้อมูลที่เป็นประโยชน์";

      const historyMessages: {
        role: "user" | "assistant" | "system";
        content: string;
      }[] = [...latestMessagesRef.current, userMessage]
        .filter((msg) => msg.content !== "thinking") // 🐛 กรองข้อความ thinking ออก
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      // 🎯 เพิ่ม Context จาก Active Widgets
      if (activeContexts.length > 0) {
        const contextPrompt = activeContexts
          .map((ctx) => {
            return `Widget: ${ctx.widget.name}\nDescription: ${
              ctx.widget.description
            }\nData: ${JSON.stringify(ctx.widget.data, null, 2)}`;
          })
          .join("\n\n---\n\n");

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
          if (botReply === "") {
            setIsThinking(false);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamingId ? { ...msg, content: chunk } : msg
              )
            );
          }

          botReply += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId ? { ...msg, content: botReply } : msg
            )
          );
        },
        historyMessages,
        () => {
          console.log("✅ Streaming เสร็จสิ้น - ปลดล็อก input");
          setIsSending(false);
          setIsThinking(false);
        }
      );
    } catch (error) {
      console.error("❌ Error จาก AI:", error);
      setIsThinking(false);
      setIsSending(false);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== streamingId),
        {
          id: Date.now().toString(),
          type: "bot",
          content: "❌ เกิดข้อผิดพลาดในการติดต่อ AI โปรดลองใหม่อีกครั้ง",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !isSending &&
      !isThinking &&
      inputValue.trim()
    ) {
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
    <div
      className={cn(
        "w-148 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col h-full shadow-lg",
        className
      )}
      data-chat-sidebar
    >
      <ChatHeader onClose={onClose} onContextAdded={handleContextAdd} />

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
        isSending={isSending}
        hasContext={activeContexts.length > 0}
      />
    </div>
  );
};
