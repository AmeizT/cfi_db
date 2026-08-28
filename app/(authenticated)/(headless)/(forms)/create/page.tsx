import { redirect } from "next/navigation"

export default function CentralCreatePage() {
    redirect("/report-wizard/create/attendance?method=manual-entry")
}
