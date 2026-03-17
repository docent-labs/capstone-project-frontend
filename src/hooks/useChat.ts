"use client";

import { useCallback, useState } from "react";
import { streamChat } from "@/lib/api";
import type { ChatMessage } from "@/types/chat";
import type { Message } from "@/types/api";

interface UseChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  errorMessage: string | null;
  sendMessage: (question: string, documentId: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (question: string, documentId: string) => {
      if (isStreaming) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      const assistantId = crypto.randomUUID();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);
      setErrorMessage(null);

      const history: Message[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        await streamChat(
          { document_id: documentId, question, chat_history: history },
          (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + token }
                  : m,
              ),
            );
          },
          (chunks) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, sources: chunks } : m,
              ),
            );
          },
          () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, isStreaming: false } : m,
              ),
            );
            setIsStreaming(false);
          },
        );
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, isStreaming: false, isError: true, content: "Something went wrong. Please try again." }
              : m,
          ),
        );
        setErrorMessage(err instanceof Error ? err.message : "Chat failed.");
        setIsStreaming(false);
      }
    },
    [isStreaming, messages],
  );

  const clearError = useCallback(() => setErrorMessage(null), []);

  return { messages, isStreaming, errorMessage, sendMessage, clearError };
}
