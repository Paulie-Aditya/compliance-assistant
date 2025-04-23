"use client";

import type { Message, ToolInvocation } from "ai";
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

  // If there are structured parts (text/tool events)
  if (message.parts && message.parts.length > 0) {
    return (
      <div
        className={cn(
          "mb-4 flex px-2",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] p-3 space-y-2",
            isUser
              ? "bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-md rounded-bl-md"
              : "bg-muted text-muted-foreground rounded-tr-2xl rounded-tl-md rounded-br-md"
          )}
        >
          {message.parts.map((part, idx) => {
            const { type } = part as any;

            // Plain text delta
            if (type === "text") {
              return (
                <div key={idx} className="text-sm whitespace-pre-wrap">
                  {(part as any).text}
                </div>
              );
            }

            // Boundaries between reasoning/tool steps
            if (type === "step-start") {
              return <hr key={idx} className="my-2 border-gray-300" />;
            }

            // Tool invocation events
            if (type === "tool-invocation" || type === "toolInvocation") {
              const invocation = (part as any).toolInvocation as ToolInvocation;
              if (invocation.toolName !== "supplierSearch") return null;

              // While calling the tool
              if (
                invocation.state === "call" ||
                invocation.state === "partial-call"
              ) {
                return (
                  <div
                    key={invocation.toolCallId}
                    className="text-sm italic text-gray-500"
                  >
                    Fetching suppliers...
                  </div>
                );
              }

              // Tool result
              if (invocation.state === "result") {
                const result = invocation.result as SupplierSearchResult;
                return (
                  <div key={invocation.toolCallId} className="space-y-4">
                    <div className="text-xs text-muted-foreground font-semibold uppercase">
                      Compliance Assistant Tool Response
                    </div>
                    <div className="text-sm font-medium">
                      Found {result.count} supplier{result.count > 1 ? "s" : ""}
                      :
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {result.suppliers.map(
                        (sup: SupplierResult, i: number) => (
                          <SupplierCard key={sup.id} supplier={sup} />
                        )
                      )}
                    </div>
                  </div>
                );
              }
            }

            return null;
          })}
        </div>
      </div>
    );
  }

  // Fallback: markdown content
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
          {typeof message.content === "string" ? message.content : ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}
