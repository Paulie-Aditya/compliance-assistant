"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatMessage } from "./chat-message";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      onError: (err) => {
        console.error("Chat error:", err);
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col w-full h-[70vh] bg-white rounded-lg border shadow-sm">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">
                Welcome to the Compliance Assistant
              </h3>
              <p className="text-sm text-gray-500">
                Ask questions about supplier risks such as:
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>Show me high-risk suppliers, risk score above 5</li>
                <li>
                  Which suppliers in the technology sector have risk scores
                  above 7?
                </li>
                <li>List suppliers in Asia with compliance issues</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50">
          {error.message || "An error occurred. Please try again."}
        </div>
      )}

      <div className="border-t p-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex items-center space-x-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about supplier risks..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
