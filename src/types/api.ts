export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  status: string;
}

export interface DocumentStatusResponse {
  document_id: string;
  filename: string;
  status: "processing" | "ready" | "error";
  created_at: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  document_id: string;
  question: string;
  chat_history: Message[];
}

export interface SourceChunk {
  content: string;
  chunk_index: number;
}

export type StreamEvent =
  | { type: "token"; content: string }
  | { type: "sources"; chunks: SourceChunk[] }
  | { type: "done" };
