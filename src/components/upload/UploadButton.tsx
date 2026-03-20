import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface UploadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function UploadButton({
  loading,
  disabled,
  children = "Upload",
  className,
  ...props
}: UploadButtonProps) {
  return (
    <Button disabled={disabled || loading} className={cn(className)} {...props}>
      {loading ? (
        <Spinner size="sm" className="text-primary-foreground" />
      ) : (
        <Upload className="size-4" aria-hidden="true" />
      )}
      {children}
    </Button>
  );
}
