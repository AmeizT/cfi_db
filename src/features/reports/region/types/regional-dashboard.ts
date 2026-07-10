import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export type RegionalDashboardTab =
    | "finance"
    | "growth"
    | "ministry"
    | "leadership"
    | "compliance"
    | "risk"

export type RegionalDashboardTableSchema = Record<RegionalDashboardTab, TableSchema>

export type RegionalDashboardResponse = {
    data: RegionalDashboardData
    table_schema: RegionalDashboardTableSchema
}

export type RegionalDashboardData = {
    region: {
        id: number
        name: string
    }
    summary: {
        zones: number
        countries: number
        assemblies: number
        reports_submitted: number
        compliance_rate: number
        growth_rate: number
        total_members: number
        total_new_members: number
        fastest_growing_assembly: {
            id: number
            name: string
            growth_rate: number
        } | null
        total_active_homecells: number
        total_actual_outreaches?: number
    }
    zones: RegionalDashboardZone[]
}

export type RegionalDashboardZone = {
    id: number
    name: string
    countries: RegionalDashboardCountry[]
}

export type RegionalDashboardCountry = {
    name: string
    currency: string
    assemblies: RegionalDashboardAssembly[]
    region_metrics: unknown
}

export type RegionalDashboardAssembly = {
    id: number
    name: string
    reports: number
    compliance: RegionalComplianceMetrics
    risk: RegionalRiskMetrics
    metrics: {
        finance: RegionalFinanceMetrics
        growth: RegionalGrowthMetrics
        ministry: RegionalMinistryMetrics
        leadership: RegionalLeadershipMetrics
    }
}

export type RegionalFinanceMetrics = {
    tithes: number
    income: number
    expenditure: number
    balance: number
    status: string
}

export type RegionalGrowthMetrics = {
    total_members?: number
    new_members?: number
    growth_rate?: number
    status: string
}

export type RegionalMinistryMetrics = {
    outreaches?: number
    actual_outreaches?: number
    homecells_planted?: number
    homecell_attendance?: number
    status: string
}

export type RegionalLeadershipMetrics = {
    leaders_count?: number
    assets_valuation?: number
    meetings_conducted?: number
    status?: string
}

export type RegionalComplianceMetrics = {
    total_sections: number
    submitted: number
    skipped: number
    pending: number
    progress: number
    coverage: number
    status: string
    sections?: unknown[]
}

export type RegionalRiskMetrics = {
    score: number
    level: string
}

export type RegionalDashboardRow = {
    id: number
    zone: string
    country: string
    assembly: string
    reports: number
    [key: string]: string | number
}
