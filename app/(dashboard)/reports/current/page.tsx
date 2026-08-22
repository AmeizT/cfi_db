import { getMetaData } from "@/config/metadata"
import { redirect } from "next/navigation"
import { reportPeriodHref } from "@/features/reports/workflow/format"

export const metadata = getMetaData({ title: "Current Report" })

export default function CurrentReportPage() {
  redirect(reportPeriodHref(new Date()))
}
