"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { sendChatMessageStream } from "@/services/chat-service";
import { WidgetData, useWidgetContext } from "@/context/widget-context";
import { useFilter } from "@/context/filter-context";
import {
  ChatHeader,
  ActiveContextSection,
  MessagesArea,
  PromptSuggestions,
  ChatInput,
  ChatErrorBoundary,
  StartNewChatButton,
  ContextWarning,
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

  // 🔄 Start New Chat functionality
  const [showStartNewChat, setShowStartNewChat] = useState(false);
  const [startNewChatReason, setStartNewChatReason] = useState<
    "error" | "context-limit"
  >("error");
  const [errorCount, setErrorCount] = useState(0); // นับจำนวน error ติดต่อกัน

  // 🎯 Widget Context & Filter Context
  const { onWidgetUpdate, contextReplacement } = useWidgetContext();
  const { onFilterChange } = useFilter();

  useEffect(() => {
    if (!conversationId) {
      // ตัวอย่าง: ดึง conversationId จาก backend หรือสร้างใหม่
      const newConversationId = crypto.randomUUID(); // แทนที่ด้วยการดึงจาก backend
      setConversationId(newConversationId);
    }
  }, [conversationId]);

  // 🔄 Auto-Update: Widget Data Changes (อัพเดทเงียบๆ ไม่แสดงข้อความ)
  useEffect(() => {
    const unsubscribeWidgetUpdate = onWidgetUpdate((updatedWidget) => {
      const options = contextReplacement.get(updatedWidget.id);

      if (options?.replaceOnUpdate) {
        // Context Replacement: แทนที่ context เดิม (ไม่แสดงข้อความ)
        setActiveContexts((prev) => {
          const exists = prev.find((ctx) => ctx.widget.id === updatedWidget.id);
          if (exists) {
            return prev.map((ctx) =>
              ctx.widget.id === updatedWidget.id
                ? {
                    ...ctx,
                    widget: {
                      id: updatedWidget.id,
                      name: updatedWidget.name,
                      description: updatedWidget.description,
                      data: updatedWidget.data,
                    },
                  }
                : ctx
            );
          }
          return prev;
        });
      }
    });

    return unsubscribeWidgetUpdate;
  }, [onWidgetUpdate, contextReplacement]);

  // 🔄 Auto-Update: Filter Changes (แสดงข้อความเดียว)
  useEffect(() => {
    let filterTimeout: NodeJS.Timeout;

    const unsubscribeFilterChange = onFilterChange(() => {
      // ยกเลิก timeout เก่า
      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }

      // รอให้ widget อัพเดทก่อน แล้วค่อยแสดงข้อความรวม
      filterTimeout = setTimeout(() => {
        if (activeContexts.length > 0) {
          const contextNames = activeContexts
            .map((ctx) => ctx.widget.name)
            .join(", ");
          const combinedMessage = createSafeMessage(
            `context-updated-${Date.now()}`,
            "bot",
            `🔄 อัพเดท Context เรียบร้อยแล้ว: ${contextNames}`
          );

          setMessages((prevMessages) => [...prevMessages, combinedMessage]);
        }
      }, 800); // รอให้ widget update เสร็จก่อน
    });

    return () => {
      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }
      unsubscribeFilterChange();
    };
  }, [onFilterChange, activeContexts.length]);

  const latestMessagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

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

          // Limit string length to prevent extremely long outputs
          if (typeof value === "string" && value.length > 1000) {
            return value.substring(0, 1000) + "... [truncated]";
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

    return {
      id: String(id),
      type,
      content: safeContent,
      timestamp,
    };
  };

  // 🎯 Handle เพิ่ม Context จาก Widget - รองรับ Context Replacement
  const handleContextAdd = (widget: WidgetData) => {
    // ตรวจสอบว่ามี widget นี้อยู่แล้วหรือไม่
    const exists = activeContexts.some((ctx) => ctx.widget.id === widget.id);

    if (exists) {
      // Context Replacement: แทนที่ context เดิม
      setActiveContexts((prev) =>
        prev.map((ctx) =>
          ctx.widget.id === widget.id
            ? {
                ...ctx,
                widget: {
                  id: widget.id,
                  name: widget.name,
                  description: widget.description,
                  data: widget.data,
                },
                addedAt: new Date(), // อัพเดทเวลา
              }
            : ctx
        )
      );

      const replaceMessage = createSafeMessage(
        `replace-${Date.now()}`,
        "bot",
        `🔄 แทนที่ Context: "${widget.name}" เรียบร้อยแล้ว\nข้อมูลใหม่พร้อมใช้งาน`
      );
      setMessages((prev) => [...prev, replaceMessage]);
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

    // 📝 เมื่อเพิ่ม context

    setActiveContexts((prev) => {
      const updatedContexts = [...prev, newContext];
      return updatedContexts;
    });

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
    // Ensure prompt is always a string
    const safePrompt = typeof prompt === "string" ? prompt : String(prompt);

    setInputValue(""); // Clear input first to prevent double sending
    handleSendMessage(safePrompt);
  };

  // 🔄 Start New Chat Handler
  const handleStartNewChat = () => {
    setMessages([]);
    setInputValue("");
    setIsSending(false);
    setIsThinking(false);
    setPromptsVisible(true);
    setActiveContexts([]);
    setIsContextExpanded(false);
    setIsPromptsExpanded(false);
    setShowStartNewChat(false);
    setErrorCount(0); // Reset error count
    setConversationId(crypto.randomUUID());
  };

  // 🎯 useEffect to manage Start New Chat button visibility
  useEffect(() => {
    // Count user messages (exclude bot messages and context messages)
    const userMessages = messages.filter((msg) => msg.type === "user");

    // Show if 6 or more user messages
    // if (userMessages.length >= 6 && !showStartNewChat) {
    //   setStartNewChatReason("context-limit");
    //   setShowStartNewChat(true);
    //   return;
    // }

    // Check for persistent error messages (only show after multiple errors)
    const recentMessages = messages.slice(-6); // Check last 6 messages
    const errorMessages = recentMessages.filter(
      (msg) =>
        msg.type === "bot" &&
        (msg.content.includes("การเชื่อมต่อถูกยกเลิก") ||
          msg.content.includes("ขออภัยในความไม่สะดวก") ||
          msg.content.includes("การสนทนาถูกขัดจังหวะ") ||
          msg.content.includes("เกิดปัญหาการเชื่อมต่อ") ||
          msg.content.includes("ไม่สามารถประมวลผล"))
    );

    // Show Start New Chat only if there are 2+ errors in recent messages
    // or if the last 2 consecutive messages are errors
    if (
      !showStartNewChat &&
      (errorMessages.length >= 2 ||
        (recentMessages.length >= 2 &&
          recentMessages
            .slice(-2)
            .every(
              (msg) =>
                msg.type === "bot" &&
                (msg.content.includes("การเชื่อมต่อถูกยกเลิก") ||
                  msg.content.includes("ขออภัยในความไม่สะดวก") ||
                  msg.content.includes("การสนทนาถูกขัดจังหวะ"))
            )))
    ) {
      setStartNewChatReason("error");
      setShowStartNewChat(true);
    }
  }, [messages, showStartNewChat]);

  // 🎯 Helper function to check if we should show context limit warning
  // const shouldShowContextWarning = () => {
  //   const userMessages = messages.filter((msg) => msg.type === "user");
  //   return userMessages.length === 5; // Show warning at 5 messages (1 before limit)
  // };

  const handleSendMessage = async (customMessage?: string) => {
    const messageContent = customMessage || inputValue.trim();
    if (!messageContent || isThinking) return;

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
          .map((ctx, index) => {
            try {
              // Use safe stringify to prevent circular reference errors
              const dataString = ctx.widget.data
                ? safeStringify(ctx.widget.data)
                : "ไม่มีข้อมูล";

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

        //  ข้อมูลเต็มของแต่ละ widget

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
          setIsSending(false);
          setIsThinking(false);
          setErrorCount(0); // Reset error count on successful completion
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

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "";

      // สร้าง error message ที่เป็นมิตรกับผู้ใช้
      let userFriendlyMessage = "";

      if (typeof errorMessage === "string") {
        if (/signal is aborted|abort|aborted/i.test(errorMessage)) {
          userFriendlyMessage =
            "การเชื่อมต่อถูกยกเลิก โปรดลองใหม่อีกครั้ง หรือลองเปลี่ยนบริบท (Context) เพื่อสนทนาต่อ";
        } else if (/timeout|timed out/i.test(errorMessage)) {
          userFriendlyMessage =
            "การเชื่อมต่อใช้เวลานานเกินไป โปรดลองใหม่อีกครั้ง หรือลองแบ่งคำถามเป็นส่วนเล็กลง";
        } else if (/network|connection/i.test(errorMessage)) {
          userFriendlyMessage =
            "เกิดปัญหาการเชื่อมต่อเครือข่าย โปรดตรวจสอบอินเทอร์เน็ตและลองใหม่อีกครั้ง";
        } else if (/reset|closed/i.test(errorMessage)) {
          userFriendlyMessage =
            "การเชื่อมต่อถูกปิด โปรดลองใหม่อีกครั้ง หากปัญหายังคงเกิดขึ้น ลองเปลี่ยนบริบท (Context) ใหม่";
        }
      }

      // ถ้าไม่มี message ที่เหมาะสม ใช้ default
      if (!userFriendlyMessage) {
        userFriendlyMessage =
          "การสนทนาถูกขัดจังหวะ โปรดลองใหม่อีกครั้ง โดยการเปลี่ยนบริบท (Context) หรือเริ่มสนทนาใหม่";
      }

      // Remove thinking message and add error message
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== streamingId),
        createSafeMessage(
          Date.now().toString(),
          "bot",
          // (error instanceof Error ? error.message : "ข้อผิดพลาดไม่ทราบสาเหตุ") +
          userFriendlyMessage + "\n\nขออภัยในความไม่สะดวก"
        ),
      ]);

      // 🔄 Only show Start New Chat button after multiple consecutive errors
      setErrorCount((prev) => prev + 1);

      // Show Start New Chat only after 2 consecutive errors
      if (errorCount >= 1) {
        // This will be 2 after increment
        setShowStartNewChat(true);
        setStartNewChatReason("error");
      }
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
          "w-1/2 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col h-full shadow-lg",
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

        {/* � Context Warning at 5 messages */}
        {/* {shouldShowContextWarning() && !showStartNewChat && <ContextWarning />} */}

        {/* �🔄 Start New Chat Button */}
        {showStartNewChat && (
          <div className="px-4 py-2">
            <StartNewChatButton
              onStartNewChat={handleStartNewChat}
              reason={startNewChatReason}
            />
          </div>
        )}

        {promptsVisible &&
          activeContexts.length === 0 &&
          !isThinking &&
          !showStartNewChat && (
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

        {promptsVisible &&
          activeContexts.length > 0 &&
          !isThinking &&
          !showStartNewChat && (
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
