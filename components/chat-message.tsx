// components/chat-message.tsx
"use client";

import type { Message } from "ai";
import { cn } from "@/lib/utils";
import type { SupplierResult } from "@/lib/types";
import { SupplierCard } from "./supplier-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const renderContent = () => {
    // 1️⃣ Handle embedded supplier JSON
    if (
      typeof message.content === "string" &&
      message.content.includes("__SUPPLIER_RESULTS__")
    ) {
      try {
        const [textPart, jsonPart] = message.content.split(
          "__SUPPLIER_RESULTS__"
        );
        const { suppliers } = JSON.parse(jsonPart) as {
          suppliers: SupplierResult[];
        };

        return (
          <>
            {/* Markdown for the text before the table */}
            <div className="mb-4 whitespace-pre-wrap text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {textPart}
              </ReactMarkdown>
            </div>

            {/* Your supplier cards */}
            <div className="grid grid-cols-1 gap-4">
              {suppliers.map((s, i) => (
                <SupplierCard key={i} supplier={s} />
              ))}
            </div>
          </>
        );
      } catch (err) {
        console.error("Failed to parse suppliers JSON", err);
        // fallback to plain rendering below
      }
    }

    // 2️⃣ Default: render the entire message as markdown
    return (
      <div className="whitespace-pre-wrap text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {typeof message.content === "string" ? message.content : ""}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div
      className={cn("mb-4 flex px-2", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap text-sm p-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-md rounded-bl-md"
            : "bg-muted text-muted-foreground rounded-tr-2xl rounded-tl-md rounded-br-md"
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
}
