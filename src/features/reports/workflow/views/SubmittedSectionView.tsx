"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { formatReportValue, reportPeriodHref } from "../format"
import { useSubmittedReport, useSubmittedSection } from "../hooks"
import { ReportStatusBadge } from "../components/ReportStatusBadge"
import {
  createSourceRecordsHref,
  isSourceRecordSectionKey,
} from "@/features/workspace/config/report-source-routing"

function printable(value: unknown) {
  if (value === null || value === undefined || value === "") return "—"
  return typeof value === "object" ? JSON.stringify(value) : String(value)
}

export function SubmittedSectionView({ reportId, sectionKey }: { reportId: number; sectionKey: string }) {
  const searchParams = useSearchParams()
  const version = Number(searchParams.get("version")) || undefined
  const reportQuery = useSubmittedReport(reportId, version)
  const sectionQuery = useSubmittedSection(reportId, sectionKey, version)
  if (reportQuery.isLoading || sectionQuery.isLoading) return <View><View.Header pagename="Submitted Section" /><View.Body className="py-4 lg:px-6"><Skeleton className="h-96 rounded-xl" /></View.Body></View>
  if (reportQuery.isError || sectionQuery.isError || !reportQuery.data || !sectionQuery.data) return <View><View.Header pagename="Submitted Section" /><View.Body className="py-4 lg:px-6"><Alert variant="destructive"><AlertTitle>Submitted section could not be loaded</AlertTitle><AlertDescription>{reportQuery.error?.message ?? sectionQuery.error?.message}</AlertDescription></Alert></View.Body></View>

  const report = reportQuery.data
  const section = sectionQuery.data
  const sourceHref = isSourceRecordSectionKey(sectionKey)
    ? createSourceRecordsHref(sectionKey, { reportId, period: report.period_start })
    : "/workspace"
  const requestedReturnTo = searchParams.get("return_to")
  const returnTo = requestedReturnTo?.startsWith("/reports/period/")
    ? requestedReturnTo
    : reportPeriodHref(report.period_start)
  const columns = Array.from(new Set(section.breakdown?.flatMap((row) => Object.keys(row)) ?? [])).slice(0, 7)
  return (
    <View>
      <View.Header pagename={section.label} actions={<ReportStatusBadge status={section.status} />}>
        <p className="mt-1 text-sm text-muted-foreground">Official version {report.version_number} · Frozen at {new Date(report.submitted_at).toLocaleString()}</p>
      </View.Header>
      <View.Body className="gap-4 py-4 lg:px-6">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm"><Link href={returnTo}><ArrowLeft className="size-4" /> Full submitted report</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href={sourceHref}>Open source records in Finance/Engagement <ExternalLink className="size-4" /></Link></Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-xl"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Submitted total</p><p className="mt-1 text-2xl font-semibold">{formatReportValue(section.total, sectionKey.includes("attendance") ? undefined : report.assembly.currency)}</p></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Record count</p><p className="mt-1 text-2xl font-semibold">{section.record_count}</p></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Snapshot version</p><p className="mt-1 text-2xl font-semibold">v{report.version_number}</p></CardContent></Card>
        </div>
        {section.status === "skipped" ? <Alert><AlertTitle>Submitted as skipped</AlertTitle><AlertDescription>{section.skip_reason_detail}</AlertDescription></Alert> : null}
        {section.status === "no_activity" ? <Alert><AlertTitle>No activity confirmed</AlertTitle><AlertDescription>{section.no_activity_note || "No activity was recorded for this period."}</AlertDescription></Alert> : null}
        <Card className="overflow-hidden rounded-xl">
          {section.breakdown?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground"><tr>{columns.map((column) => <th key={column} className="px-4 py-3 font-medium">{column.replaceAll("__", " ").replaceAll("_", " ")}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">{section.breakdown.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map((column) => <td key={column} className="px-4 py-3">{printable(row[column])}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : <CardContent className="flex min-h-44 items-center justify-center text-sm text-muted-foreground">No line items were included in this submitted section.</CardContent>}
        </Card>
        <p className="text-xs text-muted-foreground">This page shows the immutable submitted snapshot. Opening or changing current source records will not alter version {report.version_number}.</p>
      </View.Body>
    </View>
  )
}
