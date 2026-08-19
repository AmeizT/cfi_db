"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { useReportActivity } from "../hooks"
import { formatReportDate, formatReportPeriod, reportDestination } from "../format"
import { ReportStatusBadge } from "../components/ReportStatusBadge"

const filters = [
  ["all", "All", undefined],
  ["drafts", "Drafts", "not_started,draft,ready_to_submit"],
  ["submitted", "Submitted", "submitted,locked"],
  ["exceptions", "Exceptions", "overdue"],
  ["amendments", "Amendments", "reopened"],
] as const

export function ReportActivityView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const year = Number(searchParams.get("year")) || new Date().getFullYear()
  const filter = searchParams.get("view") ?? "all"
  const status = filters.find(([key]) => key === filter)?.[2]
  const query = useReportActivity(year, status)

  return (
    <View>
      <View.Header
        pagename="Report Activity"
        actions={
          <select
            aria-label="Reporting year"
            value={year}
            onChange={(event) => router.push(`/reports/activity?year=${event.target.value}&view=${filter}`)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - 3 + index).map((item) => <option key={item}>{item}</option>)}
          </select>
        }
      />
      <View.Body className="gap-4 py-4 lg:px-6">
        <div className="flex gap-1 overflow-x-auto border-b border-border pb-2" role="tablist" aria-label="Report activity filters">
          {filters.map(([key, label]) => (
            <Button key={key} asChild size="sm" variant={filter === key ? "secondary" : "ghost"}>
              <Link href={`/reports/activity?year=${year}&view=${key}`}>{label}</Link>
            </Button>
          ))}
        </div>
        {query.isLoading ? <Skeleton className="h-80 rounded-xl" /> : query.isError ? (
          <Alert variant="destructive"><AlertTitle>Activity could not be loaded</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>
        ) : !query.data?.results.length ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <p className="font-medium">No reports in this view</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another year or activity filter.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Period</th><th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Completion</th><th className="px-4 py-3 font-medium">Submitted at</th>
                    <th className="px-4 py-3 font-medium">Version</th><th className="px-4 py-3 font-medium">Locked</th><th className="px-4 py-3"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {query.data.results.map((report) => {
                    const destination = reportDestination(report)
                    const exceptionCount = report.sections.filter((section) => section.status === "skipped").length
                    return (
                      <tr key={report.id}>
                        <td className="px-4 py-3 font-medium">{formatReportPeriod(report.period_start)}</td>
                        <td className="px-4 py-3"><ReportStatusBadge status={report.status} />{exceptionCount ? <span className="ml-2 text-xs text-amber-700">{exceptionCount} exception{exceptionCount === 1 ? "" : "s"}</span> : null}</td>
                        <td className="px-4 py-3">{report.completion_percentage}%</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatReportDate(report.submitted_at, true)}</td>
                        <td className="px-4 py-3">{report.current_version ? `v${report.current_version}` : "—"}</td>
                        <td className="px-4 py-3">{report.capabilities.is_locked ? "Yes" : "No"}</td>
                        <td className="px-4 py-3 text-right">{destination ? <Button asChild variant="ghost" size="sm"><Link href={destination}>{["submitted", "locked"].includes(report.status) ? "View" : "Continue"}</Link></Button> : null}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </View.Body>
    </View>
  )
}
