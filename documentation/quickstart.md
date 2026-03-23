# Quickstart

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
