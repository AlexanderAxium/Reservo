"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  count?: number;
  className?: string;
}

export function NotificationBell({ count, className }: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative h-8 w-8 hover:bg-accent/50 transition-colors",
        className
      )}
    >
      <Bell className="h-4 w-4" />
      {count != null && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  );
}
