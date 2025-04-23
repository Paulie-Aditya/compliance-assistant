"use client";

import type { Message } from "ai";
import { cn } from "@/lib/utils";
import type { SupplierResult, SupplierSearchResult } from "@/lib/types";
import { SupplierCard } from "./supplier-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const content = message.content;
  let parsed: Partial<SupplierSearchResult> = {};
  const looksLikeJSON =
    typeof content === "string" && content.trim().startsWith("{");

  try {
    if (looksLikeJSON) {
      const parsedJSON = JSON.parse(content);
      if (
        typeof parsedJSON === "object" &&
        parsedJSON !== null &&
        "suppliers" in parsedJSON &&
        Array.isArray(parsedJSON.suppliers)
      ) {
        parsed = parsedJSON;
      }
    }
  } catch (err) {
    console.warn("Failed to parse tool result as JSON:", err);
  }

  if (
    typeof parsed.count === "number" &&
    parsed.count > 0 &&
    Array.isArray(parsed.suppliers)
  ) {
    return (
      <div
        className={cn(
          "mb-4 flex px-2",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] p-3 space-y-4",
            isUser
              ? "bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-md rounded-bl-md"
              : "bg-muted text-muted-foreground rounded-tr-2xl rounded-tl-md rounded-br-md"
          )}
        >
          <div className="text-xs text-muted-foreground font-semibold uppercase">
            Compliance Assistant Tool Response
          </div>

          <div className="text-sm font-medium">
            Found {parsed.count} supplier{parsed.count > 1 ? "s" : ""}:
          </div>

          <div className="grid grid-cols-1 gap-3">
            {parsed.suppliers.map((s: SupplierResult, i: number) => (
              <SupplierCard key={i} supplier={s} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render as markdown
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {typeof content === "string" ? content : ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}
