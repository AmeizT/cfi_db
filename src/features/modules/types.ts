import type { ComponentType, ReactNode } from "react"

export type ModuleRoute = {
    section: string
    page: string
    subpage?: string
}

export type ModuleTab = {
    key: string
    label: string
    href: string
}

export type ModulePageConfig = {
    title: string
    tabs?: readonly ModuleTab[]
    content: ComponentType
    permissions?: readonly string[]
    emptyState?: ReactNode
    loadingState?: ReactNode
    errorState?: ReactNode
    showPeriodSelector?: boolean
    showReportNavigator?: boolean
    actions?: ReactNode
}

export type ModuleRegistry = Record<string, Record<string, {
    defaultSubpage?: string
    pages: Record<string, ModulePageConfig>
}>>
