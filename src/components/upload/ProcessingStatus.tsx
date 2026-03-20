import { CheckCircle2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

type UploadState = "idle" | "uploading" | "polling" | "ready" | "error";

interface ProcessingStatusProps {
  state: UploadState;
}

const loadingMessages: Partial<Record<UploadState, string>> = {
  uploading: "Uploading document…",
  polling: "Processing document…",
};

export function ProcessingStatus({ state }: ProcessingStatusProps) {
  if (state === "idle" || state === "error") return null;

  if (state === "uploading" || state === "polling") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner size="sm" />
        <span>{loadingMessages[state]}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-green-600" aria-hidden="true" />
      <span className="text-sm font-medium text-green-700">
        Document ready — start chatting below
      </span>
    </div>
  );
}
