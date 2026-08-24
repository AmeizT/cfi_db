import { getMetaData } from "@/config/metadata"
import { redirect } from "next/navigation"

export const metadata = getMetaData({ title: "Needs Attention | Report Activity" })

export default function NeedsAttentionPage() {
    redirect("/reports/activity/flagged")
}
