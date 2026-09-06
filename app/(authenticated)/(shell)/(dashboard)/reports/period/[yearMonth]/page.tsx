import { notFound } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import { MonthlyReportDetailView } from "@/features/reports/workflow/views/MonthlyReportDetailView"

export const metadata = getMetaData({ title: "Monthly Report" })

export default async function MonthlyReportPage({ params }: {
  params: Promise<{ yearMonth: string }>
}) {
  const { yearMonth } = await params
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(yearMonth)
  if (!match) notFound()
  return <MonthlyReportDetailView year={Number(match[1])} month={Number(match[2])} />
}
