import type {
  ChatRequest,
  DocumentStatusResponse,
  DocumentUploadResponse,
  SourceChunk,
} from "@/types/api";
import { API_URL } from "./env";
import { parseSSEStream } from "./sse";

export async function uploadDocument(
  file: File,
): Promise<DocumentUploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/api/documents/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function uploadText(
  text: string,
  filename: string,
): Promise<DocumentUploadResponse> {
  const form = new FormData();
  form.append("text", text);
  form.append("filename", filename);

  const res = await fetch(`${API_URL}/api/documents/upload-text`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function getDocumentStatus(
  documentId: string,
): Promise<DocumentStatusResponse> {
  const res = await fetch(`${API_URL}/api/documents/${documentId}/status`);
  if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
  return res.json();
}

export async function streamChat(
  request: ChatRequest,
  onToken: (token: string) => void,
  onSources: (chunks: SourceChunk[]) => void,
  onDone: () => void,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);
  if (!res.body) throw new Error("Response body is null");

  for await (const event of parseSSEStream(res.body)) {
    if (event.type === "token") onToken(event.content);
    else if (event.type === "sources") onSources(event.chunks);
    else if (event.type === "done") onDone();
  }
}
