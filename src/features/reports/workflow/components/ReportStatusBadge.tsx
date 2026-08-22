import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReportSectionStatus, ReportStatus } from "../types"

const styles: Record<string, string> = {
  not_started: "border-border border-none bg-zinc-200 dark:bg-neutral-800 text-muted-foreground",
  not_required: "border-border bg-muted text-muted-foreground",
  draft: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  ready_to_submit: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  submitted: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  locked: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  overdue: "border-red-100 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  reopened: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
  no_activity: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
  skipped: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
}

export function reportStatusLabel(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function ReportStatusBadge({ status, className }: {
  status: ReportStatus | ReportSectionStatus | string
  className?: string
}) {
  return (
    <Badge variant="secondary" className={cn("font-medium", styles[status], className)}>
      {reportStatusLabel(status)}
    </Badge>
  )
}
