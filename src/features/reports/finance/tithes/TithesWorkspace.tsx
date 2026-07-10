"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import { PeriodSelector } from "@/features/reports/statements/components/PeriodSelector"
import { getReportSubmoduleTitle } from "@/features/reports/modules/config/report-submodules"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"
import TithesView from "./TithesView"
import { AuditView } from "./components/AuditView"
import { ContributorsView } from "./components/ContributorsView"
import { CumulativeView } from "./components/CumulativeView"
import { EmptyState } from "./components/EmptyState"
import { Filters } from "./components/Filters"
import { Navigation } from "./components/Navigation"
import { PerformanceView } from "./components/PerformanceView"
import { ReceiptsView } from "./components/ReceiptsView"
import { useAudit } from "./hooks/useAudit"
import { useContributors } from "./hooks/useContributors"
import { usePerformance } from "./hooks/usePerformance"
import { useReceipts } from "./hooks/useReceipts"
import { useReportTithes } from "./hooks/useReportTithes"
import type { TithesRouteView } from "./types"
import { getReportId, getStatus, getViewFromPathname } from "./utils/helpers"

export type { TithesRouteView } from "./types"

export function TithesRouteContent({ view }: { view: TithesRouteView }) {
    const searchParams = useSearchParams()
    const status = view === "records" ? getStatus(searchParams) : "active"
    const reportId = getReportId(searchParams)
    const pagination = useDataTablePagination()
    const rowsQuery = useReportTithes(reportId, status, view === "records")
    const auditQuery = useAudit(reportId, view === "audit-log")
    const contributorsQuery = useContributors(reportId, view === "contributors")
    const receiptsQuery = useReceipts(reportId, view === "receipts")
    const performanceQuery = usePerformance(reportId, view === "performance")

    if (!reportId) {
        return <EmptyState>Select a report before opening the Tithes workspace.</EmptyState>
    }

    if (view === "audit-log") {
        return (
            <AuditView
                rows={auditQuery.data?.rows ?? []}
                isLoading={auditQuery.isLoading}
                config={auditQuery.data?.config}
                totalRows={auditQuery.data?.count}
                pagination={pagination}
            />
        )
    }

    if (view === "cumulative") {
        return <CumulativeView reportId={reportId} />
    }

    if (view === "contributors") {
        return (
            <ContributorsView
                rows={contributorsQuery.data?.rows ?? []}
                meta={contributorsQuery.data?.meta}
                isLoading={contributorsQuery.isLoading}
                config={contributorsQuery.data?.config}
                reportId={reportId}
                totalRows={contributorsQuery.data?.count}
                pagination={pagination}
            />
        )
    }

    if (view === "receipts") {
        return (
            <ReceiptsView
                rows={receiptsQuery.data?.rows ?? []}
                isLoading={receiptsQuery.isLoading}
                config={receiptsQuery.data?.config}
                totalRows={receiptsQuery.data?.count}
                pagination={pagination}
            />
        )
    }

    if (view === "performance") {
        return <PerformanceView data={performanceQuery.data} isLoading={performanceQuery.isLoading} />
    }

    return (
        <TithesView
            tithes={rowsQuery.data}
            isLoading={rowsQuery.isLoading}
            pagination={pagination}
        />
    )
}

export function TithesModuleLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const view = getViewFromPathname(pathname)
    const status = view === "records" ? getStatus(searchParams) : "active"
    const title = getReportSubmoduleTitle("finance", "tithes", view) ?? "Tithes"

    return (
        <View className="gap-0">
            <View.Header
                pagename={title}
                description="Monthly records, cumulative reporting, contributors, receipts, performance, and audit history."
                actions={<PeriodSelector />}
            />
            <Navigation view={view} status={status} />
            {view !== "audit-log" ? <Filters /> : null}
            <View.Body className="gap-4 py-4">
                {children}
            </View.Body>
        </View>
    )
}

export function TithesWorkspace({ view }: { view: TithesRouteView }) {
    return (
        <TithesModuleLayout>
            <TithesRouteContent view={view} />
        </TithesModuleLayout>
    )
}
