import type { StreamEvent } from "@/types/api";

export async function* parseSSEStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<StreamEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const raw = line.slice(5).trim();
        if (!raw) continue;

        const event: StreamEvent = JSON.parse(raw);
        yield event;

        if (event.type === "done") return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
