"use client";

import { useState } from "react";
import { UploadButton } from "./UploadButton";

interface TextUploadFormProps {
  onSubmit: (text: string, filename: string) => void;
  disabled?: boolean;
}

export function TextUploadForm({ onSubmit, disabled }: TextUploadFormProps) {
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onSubmit(trimmedText, filename.trim() || "document.txt");
  };

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-primary/50 transition-shadow duration-150 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="text-content" className="text-sm font-semibold text-foreground">
          Text content
        </label>
        <textarea
          id="text-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your document text here…"
          disabled={disabled}
          rows={8}
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="filename" className="text-sm font-semibold text-foreground">
          Filename{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="filename"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="document.txt"
          disabled={disabled}
          className={inputClass}
        />
      </div>
      <UploadButton
        type="submit"
        disabled={disabled || !text.trim()}
        className="self-end"
      >
        Upload text
      </UploadButton>
    </form>
  );
}
