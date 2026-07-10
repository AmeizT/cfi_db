"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { parsePeriod } from "@/layouts/navigation/helpers/parse-period"
import { Button } from "@/components/ui/button"
import { useReports } from "../../core/hooks/use-reports"
import { ReportNavigatorItem } from "./ReportNavigatorItem"
import { ReportStatus } from "../types/status.types"
import { Separator } from "@/components/ui/separator"
import { Flex } from "@/components/ui/box"
import { AssemblyReport } from "@/dal/types";
import { createReportWizardHref, REPORT_WIZARD_SECTIONS } from "@/features/report-wizard/config/report-types"

type FilterKey = "all" | ReportStatus

const PRESERVED_WIZARD_PARAMS = [
    "section",
    "module",
    "period",
    "year",
    "month",
    "assembly",
    "zone",
    "country",
] as const

const MODULE_TO_WIZARD_SECTION: Record<string, string> = {
    attendance: "attendance",
    tithes: "tithes",
    tithe: "tithes",
    revenue: "revenue",
    "income-expenditure": "revenue",
    expenditure: "expenses",
    expenditures: "expenses",
    expenses: "expenses",
    overhead: "overhead",
}

function getReportRows(response: unknown): AssemblyReport[] {
    if (Array.isArray(response)) return response as AssemblyReport[]

    if (!response || typeof response !== "object") return []

    const data = "data" in response ? response.data : undefined
    const results = "results" in response ? response.results : undefined

    if (Array.isArray(data)) return data as AssemblyReport[]
    if (Array.isArray(results)) return results as AssemblyReport[]

    return []
}

function getReportCount(response: unknown, fallbackRows: AssemblyReport[]) {
    if (response && typeof response === "object" && "count" in response) {
        const count = Number(response.count)
        if (Number.isFinite(count)) return count
    }

    return fallbackRows.length
}

function getRouteContext(pathname: string) {
    const segments = pathname.split("/").filter(Boolean)
    const reportsIndex = segments.findIndex((segment) => segment === "reports")

    return {
        section: reportsIndex >= 0 ? segments[reportsIndex + 1] : undefined,
        module: reportsIndex >= 0 ? segments[reportsIndex + 2] : undefined,
    }
}

function getWizardSection(searchParams: ReadonlyURLSearchParams, pathname: string) {
    const routeContext = getRouteContext(pathname)
    const routeModule = searchParams.get("module") ?? routeContext.module
    const section = searchParams.get("section") ?? routeContext.section
    const candidate = routeModule ? MODULE_TO_WIZARD_SECTION[routeModule] : undefined
    const fallback = section ? MODULE_TO_WIZARD_SECTION[section] : undefined

    return candidate
        ?? fallback
        ?? REPORT_WIZARD_SECTIONS[0]?.id
        ?? "attendance"
}

function buildReportWizardHref(searchParams: ReadonlyURLSearchParams, pathname: string) {
    const routeContext = getRouteContext(pathname)
    const href = createReportWizardHref(getWizardSection(searchParams, pathname))
    const [wizardPath, wizardQuery = ""] = href.split("?")
    const params = new URLSearchParams(wizardQuery)

    for (const key of PRESERVED_WIZARD_PARAMS) {
        const value = searchParams.get(key)
        if (value) params.set(key, value)
    }

    if (!params.has("section") && routeContext.section) {
        params.set("section", routeContext.section)
    }

    if (!params.has("module") && routeContext.module) {
        params.set("module", routeContext.module)
    }

    return `${wizardPath}?${params.toString()}`
}

function getNavigatorYear(searchParams: ReadonlyURLSearchParams) {
    const period = parsePeriod(searchParams.get("period") || "")

    if (period?.type === "year" && Number.isFinite(period.value)) {
        return String(period.value)
    }

    return searchParams.get("year") ?? String(new Date().getFullYear())
}

function ReportNavigatorEmptyState({
    href,
    isFirstReport,
}: {
    href: string
    isFirstReport: boolean
}) {
    return (
        <div className="flex w-full flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                    No reports found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Create a report to start tracking this period.
                </p>
            </div>

            <Button asChild size="sm" className="self-center sm:self-auto">
                <Link href={href}>
                    {isFirstReport ? "Create your first report" : "Create report"}
                </Link>
            </Button>
        </div>
    )
}

export function ReportNavigator() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [filter] = useState<FilterKey>("all")
    const year = getNavigatorYear(searchParams)
    const { data: reports, isLoading } = useReports({ year })
    const { data: allReports } = useReports({
        year: undefined,
        pageSize: 1,
        enabled: true,
    })
    const wizardHref = useMemo(
        () => buildReportWizardHref(searchParams, pathname),
        [pathname, searchParams],
    )
    const reportData = useMemo(() => getReportRows(reports), [reports])
    const allReportRows = useMemo(() => getReportRows(allReports), [allReports])
    const allReportCount = useMemo(
        () => getReportCount(allReports, allReportRows),
        [allReports, allReportRows],
    )

    const filtered = useMemo(() => {
        return filter === "all"
            ? reportData
            : reportData.filter((r: AssemblyReport) => r.status === filter)
    }, [filter, reportData])

    const isActive = (pkey: string) => searchParams.get("reportId") === pkey

    if (!isLoading && filtered.length === 0) {
        return (
            <ReportNavigatorEmptyState
                href={wizardHref}
                isFirstReport={allReportCount === 0}
            />
        )
    }

    return (
        <Flex
            gap={3}
            direction="column"
            className="w-full h-fit no-scrollbar"
        >
            <Flex gap={1} justify={"start"} className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden"
            >
                {filtered?.map((report: AssemblyReport, index: number) => (
                    <ReportNavigatorItem
                        key={report.id}
                        index={index}
                        report={report}
                        isActive={isActive(String(report.id))}
                    />
                ))}
            </Flex>

            <Separator className="w-full hidden bg-border-subtle" />
        </Flex>
    )
}
