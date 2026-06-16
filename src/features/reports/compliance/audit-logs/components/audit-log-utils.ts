import { AuditAction } from "./audit-log";


export const DIFF_SKIP_KEYS = ["created_at", "updated_at"];

export function getInitials(email: string): string {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

export const actionStyles: Record<AuditAction, string> = {
  Created: "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
  Updated: "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  Deleted: "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
};

export const actionDotStyles: Record<AuditAction, string> = {
  Created: "bg-teal-500",
  Updated: "bg-blue-500",
  Deleted: "bg-red-500",
};
