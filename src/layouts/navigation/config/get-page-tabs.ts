import { getStatementTabs } from "../pages/statement.tabs"
import { getComplianceTabs } from "../pages/compliance.tabs"
import { getDataImportTabs } from "../pages/data-imports.tabs"
import { getReportTabs } from "../pages/reports.tabs"
import { ReadonlyURLSearchParams } from "next/navigation"
import { getReportStatementTabs } from "../pages/report-statement.tabs"

type TabContext = {
    searchParams: ReadonlyURLSearchParams
    reportPage?: string
}

type PageTabsMap = {
    imports: (context: TabContext) => ReturnType<typeof getDataImportTabs>
    reports: (context: TabContext) => ReturnType<typeof getReportTabs>
    compliance: (context: TabContext) => ReturnType<typeof getComplianceTabs>
    statements: (context: TabContext) => ReturnType<typeof getStatementTabs>
    stats: (context: TabContext) => ReturnType<typeof getReportStatementTabs>
}

const pageTabsMap: PageTabsMap = {
    compliance: ({ searchParams }) => getComplianceTabs(searchParams),
    imports: () => getDataImportTabs(),
    reports: ({ searchParams }) => getReportTabs(searchParams),
    statements: ({ searchParams }) => getStatementTabs(searchParams),
    stats: ({ searchParams, reportPage }) =>
        getReportStatementTabs(reportPage ?? "", searchParams),
}

export function getPageTabs(
    pageKey: keyof PageTabsMap,
    context: TabContext
) {
    return pageTabsMap[pageKey](context) ?? []
}
