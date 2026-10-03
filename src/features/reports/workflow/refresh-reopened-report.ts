import type { QueryClient } from "@tanstack/react-query"
import type { WorkflowReport } from "./types"

// Use the operation's server response immediately, then refresh all dependent views.
export async function refreshReopenedReport(client: QueryClient, reportId: number, report: WorkflowReport) {
  client.setQueryData(["reports-workflow", "status-popover", reportId], report)
  await Promise.all([
    client.invalidateQueries({ queryKey: ["reports-workflow"] }),
    client.invalidateQueries({ queryKey: ["reports"] }),
    client.invalidateQueries({ queryKey: ["assembly"] }),
  ])
}
