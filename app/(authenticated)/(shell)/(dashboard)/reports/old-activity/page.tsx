import { getMetaData } from "@/config/metadata"
import { redirect } from "next/navigation"

export const metadata = getMetaData({ title: "All Reports | Report Activity" })

export default function AllReportsActivityPage() {
    redirect("/reports/activity")
}
