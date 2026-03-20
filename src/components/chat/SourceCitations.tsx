"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import type { SourceChunk } from "@/types/api";

interface SourceCitationsProps {
  chunks: SourceChunk[];
}

export function SourceCitations({ chunks }: SourceCitationsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!chunks.length) return null;

  const label = `${chunks.length} source${chunks.length !== 1 ? "s" : ""}`;

  return (
    <div className="mt-3 text-sm">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <BookOpen className="size-3.5" aria-hidden="true" />
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp className="size-3.5" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-3.5" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <ul className="mt-2 flex flex-col gap-2" aria-label="Source citations">
          {chunks.map((chunk) => (
            <li
              key={chunk.chunk_index}
              className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
            >
              <span className="mb-1 block font-medium text-foreground/70">
                Chunk {chunk.chunk_index + 1}
              </span>
              {chunk.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
