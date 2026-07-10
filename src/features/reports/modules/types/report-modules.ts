export type ReportSection = "review" | "finance" | "ministry" | "performance"

export type ReportModuleKey =
    | "queue"
    | "compliance"
    | "exceptions"
    | "tithes"
    | "remittance"
    | "income-expenditure"
    | "revenue"
    | "expenditures"
    | "attendance"
    | "sunday-school-attendance"
    | "check-ins"

export type ReportRouteKey = `${ReportSection}/${ReportModuleKey}`

export type ReportModuleState = "ready" | "placeholder" | "disabled"

export type ReportViewTab = {
    label: string
    key: string
}

export type ReportModuleConfig = {
    title: string
    description: string
    href: string
    state?: ReportModuleState
    defaultView?: string
    viewTabs?: readonly ReportViewTab[]
}
