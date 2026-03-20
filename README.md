# Frontend Architecture
## Context

Greenfield Next.js 16 + React 19 frontend for a capstone RAG project. Users upload a PDF or
paste text, wait for backend processing, then chat with the document via a streaming AI interface.
The app integrates with a FastAPI backend (localhost:8000) via three endpoints: document upload (multipart POST), document status polling (GET), and SSE chat stream (POST).

**User decisions:** Tailwind CSS · Single-page layout · Native fetch SSE · Vitest + RTL tests

---

## Running the App

```bash
npm install
npm run dev       # http://localhost:3000
```
Requires the FastAPI backend running at `http://localhost:8000` (set `NEXT_PUBLIC_API_URL` in `.env.local` to override).

```bash
npm run build     # production build
npm test          # vitest
```
---

## Directory Structure

```
capstone-project-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — metadata, globals.css import
│   │   ├── page.tsx                # "use client" — composes UploadPanel + ChatPanel
│   │   └── globals.css             # Tailwind directives (@tailwind base/components/utilities)
│   ├── types/
│   │   ├── api.ts                  # DocumentUploadResponse, DocumentStatusResponse, ChatRequest, StreamEvent, SourceChunk
│   │   └── chat.ts                 # ChatMessage interface (id, role, content, sources, isStreaming, isError)
│   ├── lib/
│   │   ├── env.ts                  # export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "<http://localhost:8000>"
│   │   ├── sse.ts                  # async generator parseSSEStream(stream): yields typed StreamEvent objects
│   │   └── api.ts                  # uploadDocument, uploadText, getDocumentStatus, streamChat — all typed
│   ├── hooks/
│   │   ├── useDocumentUpload.ts    # Upload state machine + setTimeout polling (idle→uploading→polling→ready|error)
│   │   └── useChat.ts              # Chat history + SSE streaming, functional state updater pattern
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx          # variant (primary|secondary|ghost|danger), size, isLoading
│   │   │   ├── Spinner.tsx         # SVG spinner, animate-spin
│   │   │   ├── Badge.tsx           # variant (processing|ready|error)
│   │   │   ├── Tabs.tsx            # Tab switcher (PDF / Text upload modes)
│   │   │   └── ErrorBanner.tsx     # Inline red alert, onDismiss
│   │   ├── upload/
│   │   │   ├── DropZone.tsx        # Drag-and-drop + click-to-browse, validates .pdf + ≤20MB
│   │   │   ├── TextUploadForm.tsx  # Textarea + filename input
│   │   │   ├── UploadButton.tsx    # Shared submit button with loading state
│   │   │   ├── ProcessingStatus.tsx # Spinner during uploading/polling, green check on ready
│   │   │   └── UploadPanel.tsx     # Container: Tabs + DropZone|TextUploadForm + ProcessingStatus + ErrorBanner
│   │   └── chat/
│   │       ├── StreamingIndicator.tsx # Three staggered bouncing dots (Tailwind animate-bounce)
│   │       ├── SourceCitations.tsx    # Collapsed "N sources" button → expandable chunk cards
│   │       ├── ChatMessage.tsx        # User bubble (right, blue) / assistant bubble (left, white) + citations
│   │       ├── ChatInput.tsx          # Auto-grow textarea, Enter-to-send, disabled while streaming
│   │       ├── MessageList.tsx        # Scrollable list, auto-scroll to bottom on new content
│   │       └── ChatPanel.tsx          # Container: MessageList + ChatInput, disabled overlay when no document
│   └── __tests__/
│       ├── setup.ts                   # vi.mock fetch, crypto.randomUUID
│       ├── lib/
│       │   ├── sse.test.ts            # 4 tests: token events, sources events, stops at done, handles fragmented chunks
│       │   └── api.test.ts            # Mocked fetch assertions for each API function
│       ├── components/
│       │   ├── DropZone.test.tsx      # Render, valid drop, invalid drop, disabled state
│       │   └── SourceCitations.test.tsx # Count shown, expands on click, chunk index labels
│       └── hooks/
│           ├── useDocumentUpload.test.ts # idle start, upload→polling, polling→ready, error, reset
│           └── useChat.test.ts           # sendMessage adds messages, streaming updates in place
├── postcss.config.mjs
├── vitest.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```