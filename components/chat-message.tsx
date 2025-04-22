import type { Message } from "ai";
import { cn } from "@/lib/utils";
import type { SupplierResult } from "@/lib/types";
import { SupplierCard } from "./supplier-card";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Check if the message content contains JSON for supplier results
  const renderContent = () => {
    try {
      if (
        typeof message.content === "string" &&
        message.content.includes("__SUPPLIER_RESULTS__")
      ) {
        const parts = message.content.split("__SUPPLIER_RESULTS__");
        const textContent = parts[0];
        const jsonContent = JSON.parse(parts[1]);

        return (
          <>
            <div className="mb-4">{textContent}</div>
            <div className="grid grid-cols-1 gap-4">
              {jsonContent.suppliers.map(
                (supplier: SupplierResult, index: number) => (
                  <SupplierCard key={index} supplier={supplier} />
                )
              )}
            </div>
          </>
        );
      }

      return message.content;
    } catch (e) {
      console.log(e);
      return message.content;
    }
  };

  return (
    <div className={cn("mb-4 flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
}
