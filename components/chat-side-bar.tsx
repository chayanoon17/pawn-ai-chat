"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessageStream } from "@/lib/api";
import { AddContextButton } from "@/components/ui/add-context-button";
import { WidgetData } from "@/context/widget-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

interface ActiveContext {
  widget: WidgetData;
  addedAt: Date;
}

// Mock data ราคาทอง (สามารถปรับเปลี่ยนได้)
const goldPrice = {
  buy: 30000, // ราคาซื้อ
  sell: 30500, // ราคาขาย
  source: "สมาคมค้าทองคำ",
};

// 🤖 AI Thinking Animation Component
const ThinkingAnimation = () => (
  <div className="flex items-center space-x-1">
    <Bot className="w-3 h-3" />
    <span className="text-xs opacity-75">AI กำลังคิด</span>
    <div className="flex space-x-1">
      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);

// 📝 Markdown Message Component
const MarkdownMessage = ({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) => {
  if (isUser) {
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
  }

  return (
    <div className="prose prose-sm max-w-none text-gray-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-gray-900 mb-2 mt-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-gray-900 mb-2 mt-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-gray-900 mb-1 mt-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-gray-900 mb-1 mt-1">
              {children}
            </h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-sm text-gray-900 mb-2 leading-relaxed">
              {children}
            </p>
          ),
          // Strong (Bold)
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          // Emphasis (Italic)
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-sm text-gray-900 mb-2 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-sm text-gray-900 mb-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-gray-900 leading-relaxed">
              {children}
            </li>
          ),
          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-auto mb-2">
                <code>{children}</code>
              </pre>
            );
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-200 pl-3 py-1 bg-blue-50 text-sm text-gray-800 mb-2">
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full text-xs border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-2 py-1">{children}</td>
          ),
          // Horizontal Rule
          hr: () => <hr className="border-gray-300 my-2" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const ChatSidebar = ({
  isOpen,
  onClose,
  className,
}: ChatSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [promptsVisible, setPromptsVisible] = useState(true);
  const [activeContexts, setActiveContexts] = useState<ActiveContext[]>([]);

  const latestMessagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  // 🎯 Handle เพิ่ม Context จาก Widget
  const handleContextAdd = (widget: WidgetData) => {
    const newContext: ActiveContext = {
      widget,
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

  // 🎯 Generate Dynamic Prompts ตาม Active Contexts
  const generateDynamicPrompts = (): string[] => {
    if (activeContexts.length === 0) return [];

    const prompts: string[] = [];
    const widgetIds = activeContexts.map((ctx) => ctx.widget.id);

    // Dashboard Context Prompts
    if (widgetIds.includes("weekly-operation-summary")) {
      prompts.push(
        "เงินสดรับเฉพาะวันจันทร์ของอาทิตย์นี้และอาทิตย์ที่แล้วต่างกันเยอะไหม?",
        "วันไหนที่มีเงินสดรับสูงที่สุดในอาทิตย์นี้?",
        "เปรียบเทียบผลงานอาทิตย์นี้กับอาทิตย์ที่แล้ว",
        "แนวโน้มเงินสดจ่ายเป็นอย่างไร?",
        "วิเคราะห์สาเหตุที่เงินสดรับลดลง"
      );
    }

    if (widgetIds.includes("gold-price")) {
      prompts.push(
        "ราคาทองแท่งกับทองรูปพรรณต่างกันเท่าไร?",
        "ส่วนต่างราคาซื้อ-ขายทองคำเป็นอย่างไร?",
        "ราคาทองอัปเดตล่าสุดเมื่อไหร?",
        "ควรซื้อทองแท่งหรือทองรูปพรรณดี?"
      );
    }

    if (widgetIds.includes("daily-operation-summary")) {
      prompts.push(
        "ยอดคงเหลือวันนี้เปลี่ยนแปลงอย่างไรจากตอนเปิดร้าน?",
        "จำนวนรายการเพิ่มขึ้นหรือลดลง?",
        "มูลค่าสต็อกรวมเป็นเท่าไร?",
        "แนวโน้มการเปลี่ยนแปลงยอดคงเหลือเป็นอย่างไร?"
      );
    }

    if (widgetIds.includes("contract-transaction-summary")) {
      prompts.push(
        "ประเภทธุรกรรมไหนที่มีมากที่สุดวันนี้?",
        "จำนวนรายการทั้งหมดเป็นเท่าไร?",
        "การไถ่ถอนมีกี่รายการ?",
        "ธุรกรรมใหม่เทียบกับการต่อดอกเบี้ยอย่างไร?"
      );
    }

    if (widgetIds.includes("contract-transaction-details")) {
      prompts.push(
        "รายการที่มีมูลค่าสูงที่สุดเป็นอย่างไร?",
        "ลูกค้าคนไหนมีรายการมากที่สุด?",
        "ทรัพย์สินประเภทไหนได้รับความนิยม?",
        "รายการที่ค้างชำระนานที่สุดคือรายการไหน?"
      );
    }

    // Asset Type Context Prompts
    if (widgetIds.includes("asset-type-summary")) {
      prompts.push(
        "ประเภททรัพย์สินไหนที่ได้รับความนิยมมากที่สุด?",
        "สัดส่วนของแต่ละประเภททรัพย์สินเป็นอย่างไร?",
        "มีประเภททรัพย์สินทั้งหมดกี่ประเภท?",
        "ประเภทไหนที่มีน้อยที่สุด?"
      );
    }

    if (widgetIds.includes("top-ranking-asset-type")) {
      prompts.push(
        "อันดับ 1 ประเภททรัพย์สินคืออะไร?",
        "ประเภทไหนที่มีมูลค่าสูงที่สุด?",
        "เปรียบเทียบอันดับ 1 กับอันดับ 2",
        "มูลค่าเฉลี่ยของแต่ละประเภทเป็นเท่าไร?"
      );
    }

    if (widgetIds.includes("ranking-by-period-asset-type")) {
      prompts.push(
        "แนวโน้มประเภททรัพย์สินเป็นอย่างไรในช่วงนี้?",
        "ประเภทไหนที่มีการเติบโตมากที่สุด?",
        "ช่วงเวลาไหนที่มีการรับจำนำมากที่สุด?",
        "วิเคราะห์แนวโน้มตามช่วงเวลา"
      );
    }

    // Mixed Context Prompts (เมื่อมีหลาย widget)
    if (widgetIds.length > 1) {
      // Smart combination prompts
      if (
        widgetIds.includes("weekly-operation-summary") &&
        widgetIds.includes("daily-operation-summary")
      ) {
        prompts.push(
          "เปรียบเทียบยอดรับจำนำรายสัปดาห์กับยอดคงเหลือรายวัน",
          "แนวโน้มการเติบโตจากข้อมูลรายวันและรายสัปดาห์"
        );
      }

      if (
        widgetIds.includes("gold-price") &&
        widgetIds.includes("weekly-operation-summary")
      ) {
        prompts.push(
          "ราคาทองมีผลต่อยอดรับจำนำอย่างไร?",
          "ช่วงที่ราคาทองสูงมีผลต่อธุรกิจไหม?"
        );
      }

      if (
        widgetIds.includes("asset-type-summary") &&
        widgetIds.includes("contract-transaction-summary")
      ) {
        prompts.push(
          "ประเภททรัพย์สินไหนที่มีการทำธุรกรรมมากที่สุด?",
          "วิเคราะห์ความสัมพันธ์ระหว่างประเภททรัพย์สินกับประเภทธุรกรรม"
        );
      }

      prompts.push(
        "สรุปภาพรวมข้อมูลทั้งหมดให้ฟัง",
        "วิเคราะห์ความสัมพันธ์ระหว่างข้อมูลต่างๆ",
        "จุดที่น่าสนใจจากข้อมูลทั้งหมดคืออะไร?",
        "ข้อเสนอแนะจากการวิเคราะห์ข้อมูลเหล่านี้"
      );
    }

    // Return unique prompts only (remove duplicates)
    return [...new Set(prompts)].slice(0, 10); // เพิ่มเป็น 10 คำถาม
  };

  // 🎨 Get prompt button color based on widget type
  const getPromptButtonStyle = (prompt: string) => {
    // Analysis prompts - สำหรับคำถามวิเคราะห์
    if (
      prompt.includes("วิเคราะห์") ||
      prompt.includes("เปรียบเทียบ") ||
      prompt.includes("แนวโน้ม")
    ) {
      return "text-sm bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100";
    }
    // Summary prompts - สำหรับคำถามสรุป
    if (
      prompt.includes("สรุป") ||
      prompt.includes("ภาพรวม") ||
      prompt.includes("ทั้งหมด")
    ) {
      return "text-sm bg-green-50 border-green-200 text-green-700 hover:bg-green-100";
    }
    // Specific data prompts - สำหรับคำถามข้อมูลเฉพาะ
    if (
      prompt.includes("เท่าไร") ||
      prompt.includes("กี่") ||
      prompt.includes("ไหน")
    ) {
      return "text-sm bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100";
    }
    // Default style
    return "text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100";
  };

  // 📊 Get Context Summary Info
  const getContextSummary = () => {
    if (activeContexts.length === 0) return null;

    const contextTypes = activeContexts.map((ctx) => {
      if (ctx.widget.id.includes("asset-type")) return "ประเภททรัพย์สิน";
      if (ctx.widget.id.includes("transaction")) return "ธุรกรรม";
      if (ctx.widget.id.includes("operation")) return "ปฏิบัติการ";
      if (ctx.widget.id.includes("gold")) return "ราคาทอง";
      return "อื่นๆ";
    });

    const uniqueTypes = [...new Set(contextTypes)];
    return uniqueTypes.join(", ");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || isThinking) return;

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
    setIsThinking(true); // 🤖 เริ่มแสดงอนิเมชันการคิด
    setPromptsVisible(false); // เมื่อส่งข้อความ ให้ซ่อน prompt

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
          // เมื่อเริ่มได้รับ response แรก ให้ลบอนิเมชันการคิดและเริ่มแสดงข้อความจริง
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
          // 🎯 Callback เมื่อ streaming จบสมบูรณ์
          console.log("✅ Streaming เสร็จสิ้น - ปลดล็อก input");
          setIsSending(false);
          setIsThinking(false);
        }
      );

      // ❌ ไม่ต้อง set message ซ้ำ เพราะ streaming จะ update อัตโนมัติ
      // เหลือไว้เฉพาะสำหรับ final message ถ้าจำเป็น
    } catch (error) {
      console.error("❌ Error จาก AI:", error);
      setIsThinking(false); // 🤖 หยุดอนิเมชันการคิดเมื่อ error
      setIsSending(false); // 🔓 ปลดล็อก input เมื่อ error
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== streamingId), // ลบข้อความ thinking
        {
          id: Date.now().toString(),
          type: "bot",
          content: "❌ เกิดข้อผิดพลาดในการติดต่อ AI โปรดลองใหม่อีกครั้ง",
          timestamp: new Date(),
        },
      ]);
    } finally {
      // 🔄 ไม่ต้อง reset states ที่นี่ เพราะจะ handle ผ่าน onComplete callback
      // การ reset จะทำใน onComplete callback หรือใน catch block เท่านั้น
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
        <div className="flex items-center space-x-2">
          <AddContextButton
            onContextAdded={handleContextAdd}
            className="text-xs"
          />
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active Contexts */}
      {activeContexts.length > 0 && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">
              Active Context
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-blue-600">
                {activeContexts.length} widget(s)
              </span>
              {getContextSummary() && (
                <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                  {getContextSummary()}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            {activeContexts.map((ctx) => (
              <div
                key={ctx.widget.id}
                className="flex items-center justify-between bg-white rounded p-2"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <FileText className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-900 truncate">
                    {ctx.widget.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContextRemove(ctx.widget.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  ) : message.content === "thinking" ? (
                    <ThinkingAnimation />
                  ) : (
                    <>
                      <Bot className="w-3 h-3" />
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </>
                  )}
                  {message.type === "user" && (
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                {message.content !== "thinking" && (
                  <MarkdownMessage
                    content={message.content}
                    isUser={message.type === "user"}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      {promptsVisible && activeContexts.length === 0 && !isThinking && (
        <div className="px-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {[
              "ราคาทองวันนี้เท่าไร?",
              "แนวโน้มราคาทองช่วงนี้เป็นอย่างไร?",
              "ควรขายทองตอนนี้ไหม?",
              "จำนำทองทำยังไง?",
              "การประเมินราคาทองคำเป็นอย่างไร?",
            ].map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="text-sm"
                disabled={isSending || isThinking}
                onClick={() => {
                  setInputValue(prompt);
                  handleSendMessage();
                }}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Context-based Prompts */}
      {promptsVisible && activeContexts.length > 0 && !isThinking && (
        <div className="px-4 pt-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700">
              คำถามที่แนะนำสำหรับข้อมูลที่เลือก:
            </span>
            <span className="text-xs text-blue-500">
              {generateDynamicPrompts().length} คำถาม
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {generateDynamicPrompts().map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className={getPromptButtonStyle(prompt)}
                disabled={isSending || isThinking}
                onClick={() => {
                  setInputValue(prompt);
                  handleSendMessage();
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
            placeholder={isThinking ? "AI กำลังคิด..." : "พิมพ์ข้อความ..."}
            className="flex-1"
            disabled={isThinking}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={isThinking || !inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
