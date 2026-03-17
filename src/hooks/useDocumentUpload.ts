"use client";

import { useCallback, useRef, useState } from "react";
import { getDocumentStatus, uploadDocument, uploadText } from "@/lib/api";

type UploadState = "idle" | "uploading" | "polling" | "ready" | "error";

interface UseDocumentUploadReturn {
  state: UploadState;
  documentId: string | null;
  errorMessage: string | null;
  uploadFile: (file: File) => Promise<void>;
  uploadTextContent: (text: string, filename: string) => Promise<void>;
  reset: () => void;
}

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 60;

export function useDocumentUpload(): UseDocumentUploadReturn {
  const [state, setState] = useState<UploadState>("idle");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const poll = useCallback((docId: string) => {
    attemptsRef.current += 1;

    if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
      setState("error");
      setErrorMessage("Document processing timed out.");
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const status = await getDocumentStatus(docId);
        if (status.status === "ready") {
          setState("ready");
        } else if (status.status === "error") {
          setState("error");
          setErrorMessage("Document processing failed.");
        } else {
          poll(docId);
        }
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : "Polling failed.");
      }
    }, POLL_INTERVAL_MS);
  }, []);

  const startUpload = useCallback(
    async (uploadFn: () => Promise<{ document_id: string }>) => {
      clearTimer();
      attemptsRef.current = 0;
      setState("uploading");
      setErrorMessage(null);
      setDocumentId(null);

      try {
        const res = await uploadFn();
        setDocumentId(res.document_id);
        setState("polling");
        poll(res.document_id);
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : "Upload failed.");
      }
    },
    [poll],
  );

  const uploadFile = useCallback(
    (file: File) => startUpload(() => uploadDocument(file)),
    [startUpload],
  );

  const uploadTextContent = useCallback(
    (text: string, filename: string) =>
      startUpload(() => uploadText(text, filename)),
    [startUpload],
  );

  const reset = useCallback(() => {
    clearTimer();
    attemptsRef.current = 0;
    setState("idle");
    setDocumentId(null);
    setErrorMessage(null);
  }, []);

  return { state, documentId, errorMessage, uploadFile, uploadTextContent, reset };
}
