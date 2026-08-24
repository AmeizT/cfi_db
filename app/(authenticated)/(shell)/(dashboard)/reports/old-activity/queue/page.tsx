import { getMetaData } from "@/config/metadata"
import { redirect } from "next/navigation"

export const metadata = getMetaData({ title: "Queue | Report Activity" })

export default function ReportQueuePage() {
    redirect("/reports/activity/queue")
}
