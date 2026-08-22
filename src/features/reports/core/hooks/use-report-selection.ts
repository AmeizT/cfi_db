"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    ALL_REPORTS_PAGE_SIZE,
    createReportSelectionQuery,
    getReportRows,
    hasValidReportId,
    resolveReportSelection,
} from "../lib/report-selection"
import { useReports } from "./use-reports"

type UseReportSelectionOptions = {
    enabled: boolean
    reportId?: string
    defaultTab?: string
}

export function useReportSelection({
    enabled,
    reportId,
    defaultTab,
}: UseReportSelectionOptions) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const hasExplicitReport = hasValidReportId(reportId)
    const reportsQuery = useReports({
        year: undefined,
        pageSize: ALL_REPORTS_PAGE_SIZE,
        enabled,
    })
    const reports = React.useMemo(
        () => getReportRows(reportsQuery.data),
        [reportsQuery.data],
    )
    const selectedReport = React.useMemo(
        () => resolveReportSelection(reports, reportId),
        [reportId, reports],
    )
    const explicitReportIsMissing = hasExplicitReport
        && reportsQuery.isSuccess
        && !reports.some((report) => String(report.id) === reportId)
    const shouldResolveLatest = enabled
        && (!hasExplicitReport || explicitReportIsMissing)

    React.useEffect(() => {
        if (!enabled || !selectedReport) return

        const query = createReportSelectionQuery(searchParams, selectedReport, {
            defaultTab,
        })

        if (query === searchParams.toString()) return
        router.replace(`${pathname}?${query}`, { scroll: false })
    }, [defaultTab, enabled, pathname, router, searchParams, selectedReport])

    return {
        selectedReport,
        isLoading: enabled && reportsQuery.isLoading,
        isResolving: shouldResolveLatest
            && (reportsQuery.isLoading || reportsQuery.isFetching || Boolean(selectedReport)),
    }
}
