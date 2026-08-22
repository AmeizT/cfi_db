import { apiRoutes } from "@/config/urls"
import type {
  ReportsOverview,
  ReportSection,
  SubmittedReport,
  SubmittedReportSection,
  WorkflowReport,
} from "./types"

type ActivityEnvelope = { count: number; results: WorkflowReport[] }

async function request<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = payload?.detail ?? payload?.report ?? payload?.findings?.[0]?.message
    throw new Error(typeof detail === "string" ? detail : "The report request could not be completed.")
  }
  return payload as T
}

function periodQuery(year?: number, month?: number) {
  const params = new URLSearchParams()
  if (year) params.set("year", String(year))
  if (month) params.set("month", String(month))
  const query = params.toString()
  return query ? `?${query}` : ""
}

export function getReportsOverview(year: number) {
  return request<ReportsOverview>(`${apiRoutes.reports.overview()}?year=${year}`)
}

export function getReportActivity(year: number, status?: string) {
  const params = new URLSearchParams({ year: String(year) })
  if (status) params.set("status", status)
  return request<ActivityEnvelope>(`${apiRoutes.reports.activity()}?${params}`)
}

export function getCurrentReport(year?: number, month?: number) {
  return request<WorkflowReport>(`${apiRoutes.reports.current()}${periodQuery(year, month)}`)
}

export function getReportDetail(reportId: number) {
  return request<WorkflowReport>(apiRoutes.reports.detail(reportId))
}

export function startCurrentReport(year?: number, month?: number) {
  return request<WorkflowReport>(`${apiRoutes.reports.current()}${periodQuery(year, month)}`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export function updateReportSection(
  reportId: number,
  sectionKey: string,
  body: Record<string, unknown>
) {
  return request<ReportSection>(apiRoutes.reports.section(reportId, sectionKey), {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function submitReport(reportId: number, declarationConfirmed: boolean) {
  return request<SubmittedReport>(apiRoutes.reports.submit(reportId), {
    method: "POST",
    body: JSON.stringify({ declaration_confirmed: declarationConfirmed }),
  })
}

export function getSubmittedReport(reportId: number, version?: number) {
  const query = version ? `?version=${version}` : ""
  return request<SubmittedReport>(`${apiRoutes.reports.submitted(reportId)}${query}`)
}

export function getSubmittedSection(reportId: number, section: string, version?: number) {
  const query = version ? `?version=${version}` : ""
  return request<SubmittedReportSection>(
    `${apiRoutes.reports.submittedSection(reportId, section)}${query}`
  )
}

export function amendReport(reportId: number, reason: string) {
  return request<WorkflowReport>(apiRoutes.reports.amend(reportId), {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

export function requestReportReopening(reportId: number, reason: string) {
  return request<{ id: number; status: string }>(apiRoutes.reports.requestReopening(reportId), {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}
