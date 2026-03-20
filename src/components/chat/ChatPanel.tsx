"use client";

import { Sparkles } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

interface ChatPanelProps {
  documentId: string;
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const { messages, isStreaming, errorMessage, sendMessage, clearError } = useChat();

  const handleSend = (question: string) => {
    sendMessage(question, documentId);
  };

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              Ready to explore
            </p>
            <p className="mt-1.5 max-w-[240px] text-sm leading-relaxed text-muted-foreground">
              Ask any question about your document and get cited answers.
            </p>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <div className="flex shrink-0 flex-col gap-2 border-t border-border px-6 py-4">
        {errorMessage && (
          <ErrorBanner message={errorMessage} onDismiss={clearError} />
        )}
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  );
}
