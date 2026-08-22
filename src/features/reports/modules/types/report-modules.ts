export type ReportSection = "activity" | "finance" | "ministry" | "performance"

export type ModulePageContext = "reports" | "workspace"

export type ReportModuleKey =
    | "all"
    | "overview"
    | "queue"
    | "compliance"
    | "flagged"
    | "tithes"
    | "financial-activity"
    | "remittance"
    | "income-expenditure"
    | "revenue"
    | "expenditures"
    | "attendance"
    | "sunday-school-attendance"
    | "outreach"
    | "check-ins"

export type ReportRouteKey = `${ReportSection}/${ReportModuleKey}`

export type ReportModuleState = "ready" | "placeholder" | "disabled"

export type ReportViewTab = {
    label: string
    key: string
}

export type ReportModuleConfig = {
    title: string
    tabLabel?: string
    description: string
    href: string
    state?: ReportModuleState
    showPeriodSelector?: boolean
    defaultView?: string
    viewTabs?: readonly ReportViewTab[]
}
