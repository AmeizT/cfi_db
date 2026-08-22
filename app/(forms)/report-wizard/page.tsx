import { redirect } from "next/navigation"
export default function ReportWizardPage() {
    redirect("/report-wizard/create/attendance?method=manual-entry")
}
