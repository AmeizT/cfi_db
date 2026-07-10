import { z } from "zod"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export const ComplianceIssueTypeSchema = z.enum([
    "no_data",
    "not_collected",
    "not_applicable",
    "technical_issue",
    "other",
])

export const ComplianceIssueFollowUpStatusSchema = z.enum([
    "PENDING",
    "CONTACTED",
    "RESOLVED",
    "ESCALATED",
])

export const ComplianceIssueSchema = z.object({
    section_id: z.number(),
    report_id: z.number(),
    assembly_id: z.number(),
    assembly_name: z.string(),
    zone_id: z.number().nullable(),
    zone: z.string().nullable(),
    region_id: z.number().nullable(),
    region: z.string().nullable(),
    country: z.string(),
    period: z.string(),
    month: z.number(),
    year: z.number(),
    section_skipped: z.string(),
    reason_for_skipping: z.string().nullable(),
    skip_reason: ComplianceIssueTypeSchema.nullable(),
    skip_notes: z.string().nullable(),
    skipped_at: z.string(),
    follow_up_status: ComplianceIssueFollowUpStatusSchema,
    follow_up_action: ComplianceIssueFollowUpStatusSchema,
    follow_up_notes: z.string().nullable(),
    follow_up_assigned_to: z.string().nullable(),
    report_status: z.string(),
    workflow_status: z.string(),
    is_late_submission: z.boolean(),
    days_late: z.number().nullable(),
    due_date: z.string().nullable(),
    submitted_at: z.string().nullable(),
}).strict()

export const ComplianceIssuesSummarySchema = z.object({
    total_skipped_sections: z.number(),
    by_reason: z.record(z.string(), z.number()),
    by_assembly: z.record(z.string(), z.number()),
    by_follow_up_status: z.record(z.string(), z.number()),
    unresolved_count: z.number(),
}).strict()

export const ComplianceIssuesPayloadSchema = z.object({
    results: z.array(ComplianceIssueSchema),
    summary: ComplianceIssuesSummarySchema,
}).strict()

export const ComplianceIssuesResponseSchema = z.object({
    data: ComplianceIssuesPayloadSchema,
    table_schema: z.custom<TableSchema>().optional(),
}).strict()

export type ComplianceIssueType = z.infer<typeof ComplianceIssueTypeSchema>
export type ComplianceIssueFollowUpStatus = z.infer<
    typeof ComplianceIssueFollowUpStatusSchema
>
export type ComplianceIssue = z.infer<typeof ComplianceIssueSchema>
export type ComplianceIssuesSummary = z.infer<typeof ComplianceIssuesSummarySchema>
export type ComplianceIssuesResponse = z.infer<typeof ComplianceIssuesResponseSchema>

