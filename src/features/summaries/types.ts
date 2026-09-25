export type Value = number | string | null
export type Contributor = { id: number; name: string; amount: Value }
export type Target = { name: string; achieved: Value; target: Value; percent: number | null }
export type Finance = { tithes: Value; other_revenue: Value; expenses: Value; due: Value; paid: Value; outstanding: Value }
export type SummaryMetrics = {
    assembly_count?: number
    finance_by_currency?: { currency: string | null; assembly_id: number | null; assembly_name: string | null; finance: Finance }[]
    giving?: { count: Value; previous_count: Value }
    coverage?: Record<string, { available: number; total: number }>
    currency: string | null
    report_count: number
    expected_reports: number
    attendance: { total: Value; general: Value; school: Value; cells: Value }
    finance: Finance
    membership: { comparable_assemblies?: number; previous: Value; current: Value; net: Value; percent: number | null; new: Value; transfers_in: Value; transfers_out: Value; removals: Value; households: Value; new_households: Value }
    outreach: { plants: { id: number; name: string; date: string }[]; homecells: Value; ordained: Value }
    targets: Target[]
    mixed_currencies?: boolean
}
export type AssemblySummary = SummaryMetrics & {
    monthly?: Pick<SummaryMetrics, "attendance" | "finance" | "outreach" | "report_count" | "expected_reports">
    id: number; name: string; zone_name: string
    giving: { count: number; previous_count: number; top: Contributor[] }
    assets: { added: Value; disposals: Value; pending: Value }
}
export type SummaryResponse = {
    name: string; period: string; start: string; end: string; regional: boolean
    filters?: RegionalFilters
    regions: { id: number; name: string }[]
    available_assemblies?: { id: number; name: string }[]
    summary: SummaryMetrics
    monthly_summary: SummaryMetrics
    assemblies: AssemblySummary[]
    zones: { id: number | null; name: string; region_name: string | null; summary: SummaryMetrics; assemblies: AssemblySummary[] }[]
    limitations: string[]
}
export type ContributorResponse = { assembly: string; period: string; currency: string | null; contributors: Contributor[] }

export type RegionalFilters = {
    zones: { id: number; name: string; countries: { id: string; name: string }[] }[]
    zone: number | null
    country: string | null
    countries: { id: string; name: string }[]
}
