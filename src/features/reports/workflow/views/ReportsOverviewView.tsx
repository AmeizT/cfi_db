"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, FileCheck2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { cn } from "@/lib/utils"
import { useReportsOverview } from "../hooks"
import { formatReportDate, formatReportValue, reportDestination } from "../format"
import { REPORT_SECTIONS } from "../types"
import { ReportStatusBadge } from "../components/ReportStatusBadge"

function YearSelect({ year }: { year: number }) {
  const router = useRouter()
  const years = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - 3 + index)
  return (
    <select
      aria-label="Reporting year"
      value={year}
      onChange={(event) => router.push(`/reports?year=${event.target.value}`)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
    >
      {years.map((item) => <option key={item}>{item}</option>)}
    </select>
  )
}

export function ReportsOverviewView() {
  const searchParams = useSearchParams()
  const year = Number(searchParams.get("year")) || new Date().getFullYear()
  const query = useReportsOverview(year)

  return (
    <View>
      <View.Header
        pagename="Reports Overview"
        actions={<YearSelect year={year} />}
      >
        {query.data ? (
          <p className="hidden mt-1 text-sm text-muted-foreground">
            {query.data.assembly.name} · Monthly compliance and official submissions
          </p>
        ) : null}
      </View.Header>

      <View.Body className="gap-5 py-4 lg:px-6">
        {query.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)}
          </div>
        ) : query.isError || !query.data ? (
          <Alert variant="destructive">
            <AlertTitle>Reports could not be loaded</AlertTitle>
            <AlertDescription>{query.error?.message ?? "Try again shortly."}</AlertDescription>
          </Alert>
        ) : (
          <>
            <section aria-labelledby="periods-heading">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div className="hidden">
                  <h2 id="periods-heading" className="font-semibold">{year} reporting periods</h2>
                  <p className="text-sm text-muted-foreground">Choose a month to continue a draft or open its official submission.</p>
                </div>
                <Button asChild variant="outline" className="shadow-elevation-sm">
                  <Link href="/reports/activity">View activity <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {query.data.months.map((report) => {
                  const destination = reportDestination(report)
                  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
                    new Date(`${report.period_start}T00:00:00`)
                  )
                  const content = (
                    <Card className={cn(
                      "h-42 rounded-3xl transition-colors bg-surface",
                      destination && "hover:border-primary/40 hover:bg-accent/30",
                      report.status === "overdue" && "border-red-200 dark:border-red-900"
                    )}>
                      <CardContent className="p-4 h-full flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-lg font-semibold">{month}</span>
                            {report.current_version ? <span className="text-xs text-muted-foreground">v{report.current_version}</span> : null}
                          </div>
                          <ReportStatusBadge status={report.status} className="mt-1 max-w-full" />
                        </div>
                        
                        <div>
                          <Progress value={report.completion_percentage} className="mt-4 h-1.5" />
                          <p className="mt-2 text-xs text-muted-foreground">
                            {report.submitted_at
                              ? `Filed ${formatReportDate(report.submitted_at)}`
                              : `${report.completion_percentage}% complete`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                  return destination ? <Link key={report.period_start} href={destination}>{content}</Link> : <div key={report.period_start}>{content}</div>
                })}
              </div>
            </section>

            <section aria-labelledby="cumulative-heading">
              <div className="mb-3">
                <h2 id="cumulative-heading" className="font-semibold">Year-to-date cumulative data</h2>
                <p className="text-sm text-muted-foreground">Official submitted snapshots are separated from unsubmitted draft values.</p>
              </div>

              <Card className="rounded-xl border border-border-subtle">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-170 text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-b border-border-subtle">
                        <th className="px-4 py-2.5 font-medium">Section</th>
                        <th className="px-4 py-2.5 font-medium">Submitted YTD</th>
                        <th className="px-4 py-2.5 font-medium">Provisional drafts</th>
                        <th className="px-4 py-2.5 font-medium">Data basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {REPORT_SECTIONS.map((section) => {
                        const isFinancial = !section.key.includes("attendance")
                        const currency = isFinancial ? query.data.assembly.currency : undefined
                        return (
                          <tr key={section.key}>
                            <td className="px-4 py-2.5 font-medium">{section.label}</td>
                            <td className="px-4 py-2.5">{formatReportValue(query.data.cumulative.submitted[section.key] ?? 0, currency)}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{formatReportValue(query.data.cumulative.provisional[section.key] ?? 0, currency)}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5"><FileCheck2 className="size-4" /> Immutable submissions</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          </>
        )}
      </View.Body>
    </View>
  )
}
