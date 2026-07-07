import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
  );
}

export function FullPageLoader() {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
      <LoadingSpinner />
    </div>
  );
}
