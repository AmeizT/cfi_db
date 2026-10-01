import assert from "node:assert/strict"
import test from "node:test"
import { QueryClient, QueryObserver } from "@tanstack/react-query"
import { refreshReopenedReport } from "../refresh-reopened-report"
import type { WorkflowReport } from "../types"
import { getReportContextActionVisibility, isReportDataReadOnly } from "@/features/workspace/config/report-context"

const submitted = {
  id: 42, status: "submitted",
  capabilities: { is_editable: false, can_amend: true, can_request_reopen: false },
} as WorkflowReport
const reopened = {
  ...submitted, status: "reopened",
  capabilities: { ...submitted.capabilities, is_editable: true, can_amend: false },
} as WorkflowReport

test("reopening enables editors from the server response before refetch completes", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const key = ["reports-workflow", "status-popover", 42]
  client.setQueryData(key, submitted)
  client.setQueryData(["reports", "list"], [])
  client.setQueryData(["assembly", "attendance"], [])
  let resolve!: (report: WorkflowReport) => void
  const pending = new Promise<WorkflowReport>(done => { resolve = done })
  const observer = new QueryObserver(client, { queryKey: key, queryFn: () => pending, staleTime: Infinity })
  const unsubscribe = observer.subscribe(() => {})
  try {
    assert.equal(isReportDataReadOnly(client.getQueryData(key)), true)
    const refresh = refreshReopenedReport(client, 42, reopened)
    assert.equal(isReportDataReadOnly(client.getQueryData(key)), false)
    assert.equal(client.getQueryState(["reports", "list"])?.isInvalidated, true)
    assert.equal(client.getQueryState(["assembly", "attendance"])?.isInvalidated, true)
    resolve(reopened)
    await refresh
    assert.equal(observer.getCurrentResult().data?.status, "reopened")
  } finally {
    unsubscribe()
    client.clear()
  }
})

test("server capabilities gate reopening and preserve the expired-report request workflow", () => {
  assert.equal(getReportContextActionVisibility("submitted", submitted.capabilities).amendReport, true)
  assert.equal(getReportContextActionVisibility("submitted", { ...submitted.capabilities, can_amend: false }).amendReport, false)
  const expired = getReportContextActionVisibility("locked", { ...submitted.capabilities, can_amend: false, can_request_reopen: true })
  assert.equal(expired.amendReport, false)
  assert.equal(expired.requestReopening, true)
  assert.equal(getReportContextActionVisibility("reopened", reopened.capabilities).amendReport, false)
})
