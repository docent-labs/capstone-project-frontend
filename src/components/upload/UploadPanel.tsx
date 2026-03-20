"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { DropZone } from "./DropZone";
import { TextUploadForm } from "./TextUploadForm";
import { UploadButton } from "./UploadButton";
import { ProcessingStatus } from "./ProcessingStatus";

interface UploadPanelProps {
  onReady: (documentId: string) => void;
}

export function UploadPanel({ onReady }: UploadPanelProps) {
  const { state, documentId, errorMessage, uploadFile, uploadTextContent, reset } =
    useDocumentUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isUploading = state === "uploading" || state === "polling";

  useEffect(() => {
    if (state === "ready" && documentId) {
      onReady(documentId);
    }
  }, [state, documentId, onReady]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    reset();
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    reset();
  };

  const handleDismissError = () => {
    setSelectedFile(null);
    reset();
  };

  return (
    <div className="flex flex-col gap-5 p-6">
      <Tabs defaultValue="file">
        <TabsList className="h-10 w-full rounded-xl p-1">
          <TabsTrigger
            value="file"
            disabled={isUploading}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Upload file
          </TabsTrigger>
          <TabsTrigger
            value="text"
            disabled={isUploading}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Paste text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-5">
          {selectedFile && state !== "ready" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
                <FileText
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-sm font-medium">
                  {selectedFile.name}
                </span>
                {!isUploading && (
                  <button
                    onClick={handleClearFile}
                    aria-label="Remove selected file"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <UploadButton
                onClick={() => uploadFile(selectedFile)}
                loading={isUploading}
                className="self-end"
              />
            </div>
          ) : (
            state !== "ready" && (
              <DropZone onFile={handleFileSelect} disabled={isUploading} />
            )
          )}
        </TabsContent>

        <TabsContent value="text" className="mt-5">
          <TextUploadForm onSubmit={uploadTextContent} disabled={isUploading} />
        </TabsContent>
      </Tabs>

      <ProcessingStatus state={state} />

      {errorMessage && (
        <ErrorBanner message={errorMessage} onDismiss={handleDismissError} />
      )}
    </div>
  );
}
