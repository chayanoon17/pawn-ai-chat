"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  from: "user" | "ai";
  text: string;
  time: string;
}

interface ChatModalProps {
  messages: Message[] | null;
  selectedTopic: string | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  messages,
  selectedTopic,
  onClose,
}) => {
  if (!messages || !selectedTopic) return null;

  const [question, answer] = selectedTopic.split("|||");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden shadow-xl border">
        {/* หัวข้อคำถาม/คำตอบ */}
        <div className="bg-gray-100 p-10 border-b space-y-2">
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-xl px-4 py-2 max-w-[75%] text-sm shadow">
              <p className="whitespace-pre-wrap">{question}</p>
              <p className="text-[11px] text-right text-blue-100 mt-1">👤 ผู้ใช้</p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white border text-gray-900 rounded-xl px-4 py-2 max-w-[75%] text-sm shadow">
              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="text-sm text-gray-800 mb-2">{children}</p>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {answer}
                </ReactMarkdown>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 text-left">🤖 AI</p>
            </div>
          </div>
        </div>

        {/* กล่องสนทนา */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={`${msg.from}-${msg.time}-${index}`}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl shadow text-sm whitespace-pre-wrap ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-900"
                }`}
              >
                {msg.from === "user" ? (
                  <p>{msg.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="text-sm text-gray-800 mb-2">{children}</p>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-1 text-right">
                  {msg.from === "user" ? "👤 ผู้ใช้" : "🤖 AI"} |{" "}
                  {new Date(msg.time).toLocaleString("th-TH", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มปิด */}
        <button
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
