export type ReportStatus =
  | "not_started"
  | "draft"
  | "ready_to_submit"
  | "overdue"
  | "submitted"
  | "locked"
  | "reopened"
  | "not_required"

export type ReportSectionStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "no_activity"
  | "skipped"

export type ReportFinding = {
  code: string
  level: "error" | "warning" | "info"
  section?: string
  message: string
  blocking: boolean
}

export type ReportCapabilities = {
  is_overdue: boolean
  is_locked: boolean
  is_editable: boolean
  can_start?: boolean
  can_submit: boolean
  can_amend: boolean
  can_request_reopen: boolean
  can_approve_reopen: boolean
}

export type ReportSection = {
  id: number | null
  key: string
  name: string
  label: string
  status: ReportSectionStatus
  resolved: boolean
  total: string | number
  record_count: number
  source?: {
    route?: string
    period_start?: string
    period_end?: string
    report_id?: number
    record_ids?: number[]
  }
  breakdown?: Array<Record<string, unknown>>
  skip_reason_code?: string | null
  skip_reason_detail?: string | null
  skipped_by?: number | null
  skipped_at?: string | null
  no_activity_confirmed_by?: number | null
  no_activity_confirmed_at?: string | null
  no_activity_note?: string | null
}

export type WorkflowReport = {
  id: number | null
  assembly: { id: number; name: string; country?: string; currency?: string }
  period_start: string
  period_end: string
  status: ReportStatus
  workflow_status?: string | null
  submitted_at?: string | null
  due_at: string
  editable_until?: string | null
  current_version?: number | null
  completion_percentage: number
  capabilities: ReportCapabilities
  sections: ReportSection[]
  findings: ReportFinding[]
}

export type ReportsOverview = {
  assembly: { id: number; name: string; currency?: string }
  year: number
  months: WorkflowReport[]
  cumulative: {
    submitted: Record<string, string | number>
    provisional: Record<string, string | number>
  }
}

export type SubmittedReportSection = Omit<ReportSection, "resolved" | "name">

export type SubmittedReport = {
  id: number
  report: number
  version_number: number
  status: "submitted" | "locked" | "reopened"
  assembly: { id: number; name: string; country?: string; currency?: string }
  period_start: string
  period_end: string
  submitted_by: number | null
  submitted_by_name: string | null
  submitted_at: string
  editable_until: string
  declaration_confirmed: boolean
  validation_findings: ReportFinding[]
  attendance_total: number
  sunday_school_attendance_total: number
  tithe_total: string
  revenue_total: string
  operating_expense_total: string
  activity_other_expense_total: string
  net_balance: string
  sections: SubmittedReportSection[]
  version_history: Array<{
    id: number
    version_number: number
    submitted_at: string
    submitted_by: number | null
    submitted_by_name: string | null
    editable_until: string
    is_locked: boolean
  }>
  audit_history: Array<{
    id: number
    actor: string | null
    action: string
    description: string | null
    timestamp: string
    previous?: Record<string, unknown> | null
    current?: Record<string, unknown> | null
  }>
  capabilities: Pick<
    ReportCapabilities,
    "can_amend" | "can_request_reopen" | "can_approve_reopen" | "is_locked"
  >
}

export const REPORT_SECTIONS = [
  { key: "general_attendance", label: "General Attendance", source: "Engagement" },
  { key: "sunday_school_attendance", label: "Sunday School Attendance", source: "Engagement" },
  { key: "tithes", label: "Tithes", source: "Finance" },
  { key: "revenue", label: "Revenue", source: "Finance" },
  { key: "operating_expenses", label: "Operating Expenses", source: "Finance" },
  { key: "activity_other_expenses", label: "Activity & Other Expenses", source: "Finance" },
] as const

export const SKIP_REASONS = [
  ["records_unavailable", "Records unavailable"],
  ["responsible_person_unavailable", "Responsible person unavailable"],
  ["technical_problem", "Technical problem"],
  ["records_lost_or_damaged", "Records lost or damaged"],
  ["activity_did_not_take_place", "Activity did not take place"],
  ["information_pending", "Information pending"],
  ["other", "Other"],
] as const
