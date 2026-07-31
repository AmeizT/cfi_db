import { getMetaData } from "@/config/metadata"
import { redirect } from "next/navigation"

export const metadata = getMetaData({ title: "Compliance | Report Activity" })

export default function ReportActivityCompliancePage() {
    redirect("/reports/activity/compliance")
}
