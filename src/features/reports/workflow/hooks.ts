"use client"

import { useQuery } from "@tanstack/react-query"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import {
  getCurrentReport,
  getReportDetail,
  getReportActivity,
  getReportsOverview,
  getSubmittedReport,
  getSubmittedSection,
} from "./api"

// Share the status popover's authoritative report state with inline editors.
export function useReportDetail(reportId: number, enabled = true) {
  return useQuery({
    queryKey: ["reports-workflow", "status-popover", reportId],
    queryFn: () => getReportDetail(reportId),
    enabled: enabled && Number.isFinite(reportId) && reportId > 0,
  })
}

export function useReportsOverview(year: number) {
  const assemblyId = useActiveAssemblyId()
  return useQuery({
    queryKey: ["reports-workflow", assemblyId, "overview", year],
    queryFn: () => getReportsOverview(year),
    enabled: Boolean(assemblyId),
  })
}

export function useReportActivity(year: number, status?: string) {
  const assemblyId = useActiveAssemblyId()
  return useQuery({
    queryKey: ["reports-workflow", assemblyId, "activity", year, status ?? "all"],
    queryFn: () => getReportActivity(year, status),
    enabled: Boolean(assemblyId),
  })
}

export function useCurrentReport(year?: number, month?: number) {
  const assemblyId = useActiveAssemblyId()
  return useQuery({
    queryKey: ["reports-workflow", assemblyId, "current", year, month],
    queryFn: () => getCurrentReport(year, month),
    enabled: Boolean(assemblyId),
  })
}

export function useSubmittedReport(reportId: number, version?: number, enabled = true) {
  return useQuery({
    queryKey: ["reports-workflow", "submitted", reportId, version ?? "current"],
    queryFn: () => getSubmittedReport(reportId, version),
    enabled: enabled && Number.isFinite(reportId) && reportId > 0,
  })
}

export function useSubmittedSection(reportId: number, section: string, version?: number) {
  return useQuery({
    queryKey: ["reports-workflow", "submitted-section", reportId, section, version ?? "current"],
    queryFn: () => getSubmittedSection(reportId, section, version),
    enabled: Number.isFinite(reportId) && Boolean(section),
  })
}
