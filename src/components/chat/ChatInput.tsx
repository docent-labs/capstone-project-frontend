"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div className="flex items-end gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm transition-shadow duration-150 focus-within:shadow-[0_0_0_3px] focus-within:shadow-primary/20 focus-within:border-primary/50">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question…"
        disabled={disabled}
        rows={1}
        aria-label="Chat message"
        className="max-h-36 flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150",
          canSend
            ? "bg-primary text-white shadow-sm hover:bg-primary/90 active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
