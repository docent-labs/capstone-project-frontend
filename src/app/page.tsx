"use client";

import { useState } from "react";
import { BookOpenText, MessageSquare, Upload } from "lucide-react";
import { UploadPanel } from "@/components/upload/UploadPanel";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function Home() {
  const [documentId, setDocumentId] = useState<string | null>(null);

  return (
    <div className="flex h-screen flex-col bg-background">

      {/* ── Header ── */}
      <header className="flex shrink-0 items-center gap-4 border-b border-border bg-white px-8 py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
          <BookOpenText className="size-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Docent
        </span>
      </header>

      {/* ── Panels ── */}
      <div className="grid flex-1 grid-cols-[400px_1fr] gap-5 overflow-hidden p-5">

        {/* Upload panel */}
        <section
          aria-label="Document upload"
          className="flex flex-col overflow-y-auto rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          {/* Panel header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border p-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Upload className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Upload document</h2>
              <p className="text-xs text-muted-foreground">PDF or plain text</p>
            </div>
          </div>

          {/* UploadPanel owns its own padding */}
          <UploadPanel onReady={setDocumentId} />
        </section>

        {/* Chat panel */}
        <section
          aria-label="Chat"
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          {/* Panel header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border p-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Chat</h2>
              <p className="text-xs text-muted-foreground">
                {documentId ? "Ask questions about your document" : "Upload a document to begin"}
              </p>
            </div>
          </div>

          {documentId ? <ChatPanel documentId={documentId} /> : <EmptyChat />}
        </section>

      </div>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <MessageSquare className="size-7 text-primary" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <p className="text-base font-semibold text-foreground">Ask anything</p>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Upload a document on the left, then ask questions and get cited answers.
        </p>
      </div>
    </div>
  );
}
