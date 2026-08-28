import { redirect } from "next/navigation"

export default function CentralCreateReportPage() {
    redirect("/report-wizard/create/attendance?method=manual-entry")
}
