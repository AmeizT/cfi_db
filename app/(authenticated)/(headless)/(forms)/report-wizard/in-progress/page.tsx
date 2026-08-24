import { redirect } from "next/navigation"

export default function ReportWizardInProgressPage() {
    redirect("/reports/activity?view=drafts")
}
