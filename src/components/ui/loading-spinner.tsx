import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full h-12 w-12 border-b-2 border-primary",
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
}
