import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { StreamingIndicator } from "./StreamingIndicator";
import { SourceCitations } from "./SourceCitations";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm",
          isUser
            ? "rounded-br-sm bg-primary text-white"
            : "rounded-bl-sm border border-border bg-white text-foreground",
          message.isError &&
            "border-destructive/20 bg-destructive/5 text-destructive"
        )}
      >
        {message.isStreaming && !message.content ? (
          <StreamingIndicator />
        ) : (
          <>
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
            {message.isStreaming && (
              <span className="mt-2 block">
                <StreamingIndicator />
              </span>
            )}
          </>
        )}
        {!isUser && message.sources && (
          <SourceCitations chunks={message.sources} />
        )}
      </div>
    </div>
  );
}
