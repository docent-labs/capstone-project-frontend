"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export function DropZone({
  onFile,
  accept = ".pdf,.txt",
  disabled,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload a file by dropping or clicking to browse"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-10 text-center transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/[0.08] shadow-[0_0_0_4px] shadow-primary/10"
          : "border-primary/30 bg-primary/[0.03] hover:border-primary/50 hover:bg-primary/[0.06]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl transition-colors duration-200",
          isDragging ? "bg-primary/20" : "bg-primary/10"
        )}
      >
        <UploadCloud
          className={cn(
            "size-6 transition-colors duration-200",
            isDragging ? "text-primary" : "text-primary/70"
          )}
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Drop a file here or{" "}
          <span className="text-primary underline-offset-2 hover:underline">
            click to browse
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">PDF or plain text</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
      />
    </div>
  );
}
