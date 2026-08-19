import { APP_ROUTES } from "../../../config/app-routes.ts"

export type SourceRecordSectionKey =
    | "general_attendance"
    | "sunday_school_attendance"
    | "tithes"
    | "revenue"
    | "operating_expenses"
    | "activity_other_expenses"

export type SourceRecordsHrefOptions = {
    period?: string | null
    reportId?: string | number | null
}

type SourceRoute = {
    href: string
    area: "Finance" | "Engagement"
    expenseType?: "operating" | "activity-other"
}

export const REPORT_SOURCE_RECORD_ROUTES: Record<SourceRecordSectionKey, SourceRoute> = {
    general_attendance: {
        href: APP_ROUTES.engagement.attendance,
        area: "Engagement",
    },
    sunday_school_attendance: {
        href: APP_ROUTES.engagement.sundaySchool,
        area: "Engagement",
    },
    tithes: {
        href: APP_ROUTES.finance.tithes,
        area: "Finance",
    },
    revenue: {
        href: APP_ROUTES.finance.revenue,
        area: "Finance",
    },
    operating_expenses: {
        href: APP_ROUTES.finance.expenses,
        area: "Finance",
        expenseType: "operating",
    },
    activity_other_expenses: {
        href: APP_ROUTES.finance.expenses,
        area: "Finance",
        expenseType: "activity-other",
    },
}

export function isSourceRecordSectionKey(value: string): value is SourceRecordSectionKey {
    return Object.hasOwn(REPORT_SOURCE_RECORD_ROUTES, value)
}

export function createSourceRecordsHref(
    sectionKey: SourceRecordSectionKey,
    { period, reportId }: SourceRecordsHrefOptions = {},
) {
    const route = REPORT_SOURCE_RECORD_ROUTES[sectionKey]
    const params = new URLSearchParams()
    const normalizedPeriod = period?.slice(0, 7)

    if (normalizedPeriod && /^\d{4}-\d{2}$/.test(normalizedPeriod)) {
        params.set("period", normalizedPeriod)
    }
    if (reportId !== null && reportId !== undefined && String(reportId)) {
        params.set("report_id", String(reportId))
    }
    params.set("section", sectionKey)
    if (route.expenseType) params.set("type", route.expenseType)

    return `${route.href}?${params.toString()}`
}
