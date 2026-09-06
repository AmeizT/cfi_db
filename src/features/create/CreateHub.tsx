"use client"

import { useEffect, useRef, useState } from "react"
import { Clock3 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { CreateDashboard } from "./CreateDashboard"
import { CreateTopbar } from "./CreateTopbar"
import { MonthlyReportWorkspace } from "./monthly-report"
import {
    createMonthlyReportHref,
    getMonthlyReportResumeSection,
    MONTHLY_REPORT_WORKSPACE,
} from "./monthly-report/routing"
import { createCentralTemplatesHref } from "@/features/report-wizard/config/report-types"
import { startCurrentReport } from "@/features/reports/workflow/api"
import { useCurrentReport, useReportsOverview } from "@/features/reports/workflow/hooks"
import type { SetupTab } from "./types"

type OpenReportRequest = {
    tab: SetupTab
    section?: string
    replace?: boolean
}

export function CreateHub() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()
    const [toast, setToast] = useState<string | null>(null)
    const directLaunchRef = useRef<string | null>(null)
    const workspace = searchParams.get("workspace")
    const section = searchParams.get("section") ?? "attendance"
    const reportId = searchParams.get("report_id")
    const currentReportQuery = useCurrentReport()
    const currentYear = new Date().getFullYear()
    const overviewQuery = useReportsOverview(currentYear)
    const reports = overviewQuery.data?.months ?? []
    const submitted = reports.filter((report) =>
        report.status === "submitted" || report.status === "locked"
    ).length
    const total = reports.length || 12

    const showToast = (message: string) => setToast(message)

    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 2600)
        return () => clearTimeout(timer)
    }, [toast])

    const openReportMutation = useMutation({
        mutationFn: async (request: OpenReportRequest) => {
            const currentReport = currentReportQuery.data
            if (!currentReport) {
                throw new Error("The current reporting period is still loading.")
            }
            if (currentReport.id) return { report: currentReport, request }
            if (!currentReport.capabilities.can_start) {
                throw new Error("This reporting period cannot be started yet.")
            }

            const period = new Date(`${currentReport.period_start}T00:00:00`)
            const report = await startCurrentReport(
                period.getFullYear(),
                period.getMonth() + 1,
            )
            return { report, request }
        },
        onSuccess: async ({ report, request }) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["reports"] }),
                queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
            ])
            const method = request.tab === "uploads" ? "upload" : "manual-entry"
            const href = createMonthlyReportHref(
                request.section ?? getMonthlyReportResumeSection(report),
                {
                    method,
                    upload_type: method === "upload" ? "excel" : null,
                    report_id: report.id,
                    amendment_context: report.status === "reopened" ? "reopened" : null,
                },
            )
            if (request.replace) router.replace(href)
            else router.push(href)
        },
        onError: (error) => {
            showToast(error instanceof Error ? error.message : "The monthly report could not be opened.")
        },
    })

    const openSetup = (tab: SetupTab = "manual") => {
        if (currentReportQuery.isLoading) {
            showToast("Loading the current reporting period…")
            return
        }
        openReportMutation.mutate({ tab })
    }

    const openTemplates = () => {
        const currentReport = currentReportQuery.data
        const resumeSection = currentReport
            ? getMonthlyReportResumeSection(currentReport)
            : "attendance"
        router.push(createCentralTemplatesHref(resumeSection, {
            method: "upload",
            upload_type: "excel",
            report_id: currentReport?.id,
            amendment_context: currentReport?.status === "reopened" ? "reopened" : null,
        }))
    }

    useEffect(() => {
        if (
            workspace !== MONTHLY_REPORT_WORKSPACE ||
            reportId ||
            !currentReportQuery.data
        ) return

        const method = searchParams.get("method") === "upload" ? "uploads" : "manual"
        const launchKey = [
            currentReportQuery.data.assembly.id,
            currentReportQuery.data.period_start,
            section,
            method,
        ].join(":")
        if (directLaunchRef.current === launchKey) return
        directLaunchRef.current = launchKey
        openReportMutation.mutate({ tab: method, section, replace: true })
    }, [
        currentReportQuery.data,
        openReportMutation,
        reportId,
        searchParams,
        section,
        workspace,
    ])

    if (workspace === MONTHLY_REPORT_WORKSPACE) {
        if (!reportId) {
            return (
                <div className="flex min-h-screen items-center justify-center px-4 text-foreground">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
                        <h1 className="text-xl font-bold">Opening Monthly Report</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {openReportMutation.isError
                                ? openReportMutation.error.message
                                : "Loading the active assembly and reporting period…"}
                        </p>
                        {openReportMutation.isError ? (
                            <button
                                type="button"
                                className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                                onClick={() => router.replace("/create")}
                            >
                                Back to Create
                            </button>
                        ) : null}
                    </div>
                </div>
            )
        }
        return <MonthlyReportWorkspace section={section} />
    }

    return (
        <div className="min-h-screen font-sans text-foreground antialiased">
            <CreateTopbar />

            <CreateDashboard
                submitted={submitted}
                total={total}
                currentReport={currentReportQuery.data}
                reportLoading={currentReportQuery.isLoading}
                reportOpening={openReportMutation.isPending}
                onOpenSetup={openSetup}
                onOpenTemplates={openTemplates}
                onToast={showToast}
            />

            {toast && (
                <div className="fixed bottom-7 left-1/2 z-100 flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] border border-border bg-popover px-4.5 py-3 text-[13.5px] font-medium text-popover-foreground shadow-lg">
                    <Clock3 className="size-4 text-primary" strokeWidth={2} />
                    {toast}
                </div>
            )}
        </div>
    )
}
