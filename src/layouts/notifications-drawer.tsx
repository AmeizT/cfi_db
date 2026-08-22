"use client";

import Link from "next/link";
import { Bell, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type WorkspaceNotification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  href: string;
};

export function NotificationsDrawer({
  notifications = [],
}: {
  notifications?: readonly WorkspaceNotification[];
}) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={
                unreadCount
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
              className="relative size-10 text-[var(--shell-chrome-foreground)] hover:bg-[var(--shell-chrome-hover)] hover:text-[var(--shell-chrome-foreground)]"
            >
              <Bell className="size-5" />
              {unreadCount ? (
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-[var(--shell-chrome-background)]"
                />
              ) : null}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>

      <SheetContent className="w-[min(26rem,100vw)] sm:max-w-md">
        <SheetHeader className="border-b px-5 py-5">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Updates that need your attention across CFI Workspace.
          </SheetDescription>
        </SheetHeader>

        {notifications.length ? (
          <ol className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <SheetClose asChild>
                  <Link
                    href={notification.href}
                    className={cn(
                      "relative flex min-h-20 flex-col gap-1 rounded-lg px-3 py-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                      !notification.read && "bg-primary-muted/60 pr-8",
                    )}
                  >
                    <span className="font-medium">{notification.title}</span>
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {notification.description}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {notification.time}
                    </time>
                    {!notification.read ? (
                      <span className="absolute right-3 top-4 size-2 rounded-full bg-primary">
                        <span className="sr-only">Unread</span>
                      </span>
                    ) : null}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium">You’re all caught up</p>
              <p className="mt-1 text-sm text-muted-foreground">
                New notifications will appear here.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
