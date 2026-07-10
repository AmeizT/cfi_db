import { z } from "zod"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export type RegionalModuleKey =
    | "finance"
    | "compliance"
    | "risk"
    | "growth"
    | "ministry"
    | "leadership"

export type RegionalModuleTab = "reports" | "performance"

export const MonthlyComplianceSectionSchema = z.object({
    status: z.enum(["SUBMITTED", "MISSING", "SKIPPED"]).catch("MISSING"),
    skip_reason: z.string().nullable().default(null),
})

export const MonthlyComplianceSchema = z.object({
    month: z.string().default(""),
    period: z.string().default(""),
    report_status: z
        .enum(["SUBMITTED", "DRAFT", "NOT_SUBMITTED"])
        .catch("NOT_SUBMITTED"),
    is_submitted: z.boolean().catch(false),
    is_late: z.boolean().catch(false),
    submitted_at: z.string().nullable().catch(null),
    due_date: z.string().nullable().catch(null),
    days_late: z.coerce.number().catch(0),
    completion: z.coerce.number().catch(0),
    coverage: z.coerce.number().catch(0),
    sections: z.record(z.string(), MonthlyComplianceSectionSchema).catch({}),
})

const SummarySchema = z.record(z.string(), z.unknown())

export const RegionalAssemblySchema = z
    .object({
        id: z.coerce.number(),
        name: z.string().default(""),
        zone: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        currency: z.string().nullable().optional(),
        primary_currency: z.string().nullable().optional(),
        expected_reports: z.coerce.number().optional(),
        submitted_reports: z.coerce.number().optional(),
        missing_reports: z.coerce.number().optional(),
        incomplete_reports: z.coerce.number().optional(),
        skipped_reports: z.coerce.number().optional(),
        late_reports: z.coerce.number().optional(),
        compliance_rate: z.coerce.number().optional(),
        completion_rate: z.coerce.number().optional(),
        current_status: z.string().optional(),
        risk_level: z.string().optional(),
        monthly_compliance: z.array(MonthlyComplianceSchema).default([]),
    })
    .catchall(z.unknown())

export const RegionalModuleCountrySchema = z
    .object({
        name: z.string().default(""),
        currency: z
            .string()
            .nullable()
            .optional()
            .transform((value) => value ?? ""),
        summary: SummarySchema.optional(),
        assemblies: z.array(RegionalAssemblySchema).default([]),
    })
    .catchall(z.unknown())

export const RegionalModuleZoneSchema = z
    .object({
        id: z.coerce.number(),
        name: z.string().default(""),
        summary: SummarySchema.optional(),
        countries: z.array(RegionalModuleCountrySchema).default([]),
    })
    .catchall(z.unknown())

export const RegionalModuleResponseSchema = z
    .object({
        summary: SummarySchema.optional(),
        zones: z.array(RegionalModuleZoneSchema).default([]),
        table_schema: z.custom<TableSchema>().optional(),
    })
    .catchall(z.unknown())

export type MonthlyComplianceSection = z.infer<typeof MonthlyComplianceSectionSchema>
export type MonthlyComplianceItem = z.infer<typeof MonthlyComplianceSchema>
export type RegionalAssemblyRow = z.infer<typeof RegionalAssemblySchema>
export type RegionalModuleCountry = z.infer<typeof RegionalModuleCountrySchema>
export type RegionalModuleZone = z.infer<typeof RegionalModuleZoneSchema>
export type RegionalModuleResponse = z.infer<typeof RegionalModuleResponseSchema>

export type RegionalOverviewResponse = {
    region?: {
        id: number
        name: string
    }
    summary?: Record<string, unknown>
    kpis?: Record<string, unknown>
    zone_kpis?: Array<{
        id: number
        name: string
        summary?: Record<string, unknown>
    }>
    alerts?: Array<{
        type?: string
        level?: string
        message?: string
    }>
}
