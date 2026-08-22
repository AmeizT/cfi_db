import { redirect } from "next/navigation"
export default function ReportWizardCreatePage() {
    redirect("/report-wizard/create/attendance?method=manual-entry")
}
