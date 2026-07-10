"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon, CircleIcon, SkipForwardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import View from "@/components/ui/view"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { cn } from "@/lib/utils"
import {
    REPORT_WIZARD_SECTIONS,
    createReportWizardHref,
    getReportWizardResumeSection,
    getReportWizardSectionByBackend,
    getReportWizardSections,
    getReportWizardTitle,
    isPartialReportWizardReport,
    toReportWizardList,
    type ReportWizardSectionStatus,
} from "../config/report-types"

const DEFAULT_REPORT_SECTION_ID = REPORT_WIZARD_SECTIONS[0]?.id ?? "attendance"

function StatusIcon({ status }: { status: ReportWizardSectionStatus }) {
    if (status === "submitted") {
        return <CheckIcon className="size-3.5 text-emerald-700" />
    }

    if (status === "skipped") {
        return <SkipForwardIcon className="size-3.5 text-amber-700" />
    }

    return <CircleIcon className="size-3.5 text-muted-foreground" />
}

function statusLabel(status: ReportWizardSectionStatus) {
    if (status === "submitted") return "Done"
    if (status === "skipped") return "Skipped"
    return "Pending"
}

export function ReportWizardInProgressView() {
    const reportsQuery = useReports({
        year: String(getCurrentYear()),
        pageSize: 50,
    })
    const partialReports = React.useMemo(() => {
        return toReportWizardList(reportsQuery.data)
            .filter(isPartialReportWizardReport)
    }, [reportsQuery.data])

    const isLoading = reportsQuery.isLoading || reportsQuery.isFetching

    return (
        <View>
            <View.Header
                pagename="In Progress"
                description="Resume report sections that still need entry, upload, or review before submission."
                actions={(
                    <Button asChild>
                        <Link href={createReportWizardHref(DEFAULT_REPORT_SECTION_ID)}>
                            New report
                        </Link>
                    </Button>
                )}
            />

            <View.Body className="gap-4 pb-8">
                {isLoading ? (
                    <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-card">
                        <Spinner className="bg-muted-foreground" />
                    </div>
                ) : partialReports.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                        <p className="text-base font-semibold text-foreground">
                            No reports in progress
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            Start a report and any unfinished sections will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {partialReports.map((report) => {
                            const resumeSection = getReportWizardResumeSection(report)
                            const href = createReportWizardHref(resumeSection, {
                                method: "manual-entry",
                                report_id: report.id,
                            })

                            return (
                                <Card key={report.id} className="gap-0 rounded-lg border border-border">
                                    <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-4 py-3">
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="truncate text-base">
                                                {getReportWizardTitle(report)}
                                            </CardTitle>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Continue from {getReportWizardSectionByBackend(resumeSection).label}
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={href}>
                                                Resume
                                                <ArrowRightIcon className="size-4" />
                                            </Link>
                                        </Button>
                                    </CardHeader>

                                    <CardContent className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {getReportWizardSections(report).map((section) => {
                                            const sectionMeta = getReportWizardSectionByBackend(section.name)

                                            return (
                                                <div
                                                    key={`${report.id}-${section.name}`}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm",
                                                        section.status === "pending" && "bg-muted/40"
                                                    )}
                                                >
                                                    <StatusIcon status={section.status} />
                                                    <span className="min-w-0 flex-1 truncate text-foreground">
                                                        {sectionMeta.label}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {statusLabel(section.status)}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </View.Body>
        </View>
    )
}
